terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 4.0"
    }
  }
  required_version = ">= 1.0.0"
}

provider "google" {
  project = var.project_id
  region  = var.region
  zone    = var.zone
}

# 1. Crear VPC (sin subredes automáticas)
resource "google_compute_network" "puppeteer_network" {
  name                    = "puppeteer-network"
  auto_create_subnetworks = false
}

# 2. Crear subred en la región especificada
resource "google_compute_subnetwork" "puppeteer_subnetwork" {
  name          = "puppeteer-subnetwork"
  ip_cidr_range = "10.0.0.0/24"
  network       = google_compute_network.puppeteer_network.self_link
  region        = var.region
}

# 3. Reservar una IP externa estática
resource "google_compute_address" "puppeteer_ip" {
  name    = "puppeteer-ip"
  project = var.project_id
  region  = var.region
}

# 4a. Regla de firewall para permitir tráfico en el puerto 8081
resource "google_compute_firewall" "puppeteer_firewall" {
  name    = "allow-puppeteer-8081"
  network = google_compute_network.puppeteer_network.self_link

  allow {
    protocol = "tcp"
    ports    = ["8081"]
  }

  # Permite desde cualquier dirección (0.0.0.0/0) solo en pruebas
  source_ranges = ["0.0.0.0/0"]

  # Aplica esta regla a las VMs con el tag "puppeteer"
  target_tags = ["puppeteer"]
}

# 4b. Regla de firewall para SSH (puerto 22) a todo el mundo (no recomendado en prod)
resource "google_compute_firewall" "allow_ssh_public" {
  name    = "allow-ssh-public"
  network = google_compute_network.puppeteer_network.self_link

  allow {
    protocol = "tcp"
    ports    = ["22"]
  }

  source_ranges = ["0.0.0.0/0"]
  target_tags   = ["puppeteer"]
}

# 5. Instancia Compute Engine para tu Puppeteer server
resource "google_compute_instance" "puppeteer_vm" {
  name         = "puppeteer-vm"
  machine_type = "e2-medium"
  zone         = var.zone
  project      = var.project_id

  # Disco de arranque (Ubuntu)
  boot_disk {
    initialize_params {
      image = "ubuntu-os-cloud/ubuntu-2004-lts"
      size  = 20
    }
  }

  # Conectada a la subred + IP estática
  network_interface {
    subnetwork   = google_compute_subnetwork.puppeteer_subnetwork.self_link
    access_config {
      nat_ip = google_compute_address.puppeteer_ip.address
    }
  }

  # Startup script para instalar Node, Puppeteer y arrancar tu index.js
  metadata_startup_script = <<-EOT
    #!/bin/bash
    apt-get update -y
    apt-get install -y nodejs npm

    mkdir -p /opt/puppeteer-server
    cd /opt/puppeteer-server

    cat <<'EOF' > index.js
    const express = require('express');
    const puppeteer = require('puppeteer');
    const app = express();

    app.get('/render', async (req, res) => {
        const url = req.query.url;
        if (!url) {
            return res.status(400).send('Falta el parámetro URL.');
        }

        let browser;
        console.time('Tiempo total de renderizado');
        try {
            browser = await puppeteer.launch({
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-dev-shm-usage',
                    '--disable-gpu',
                    '--single-process'
                ],
                headless: 'new'
            });

            console.time('Tiempo de inicio del navegador');
            const page = await browser.newPage();
            console.timeEnd('Tiempo de inicio del navegador');

            await page.setViewport({ width: 1280, height: 720 });
            await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)');

            await page.setRequestInterception(true);
            page.on('request', (reqIntercept) => {
                const blockResources = [];
                if (blockResources.includes(reqIntercept.resourceType())) {
                    reqIntercept.abort();
                } else {
                    reqIntercept.continue();
                }
            });

            console.time('Tiempo de navegación de la página');
            await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
            console.timeEnd('Tiempo de navegación de la página');

            console.time('Tiempo de extracción de contenido');
            const content = await page.content();
            console.timeEnd('Tiempo de extracción de contenido');

            console.timeEnd('Tiempo total de renderizado');
            res.status(200).send(content);
        } catch (error) {
            console.error('Error durante el renderizado:', error.message);
            res.status(500).send(\`Error al renderizar la página: \${error.message}\`);
        } finally {
            if (browser) {
                await browser.close();
            }
        }
    });

    const PORT = 8081;
    app.listen(PORT, () => {
        console.log(\`Servidor corriendo en http://localhost:\${PORT}\`);
    });
    EOF

    npm init -y
    npm install express puppeteer

    # Ejecutamos en segundo plano
    nohup node index.js > /var/log/puppeteer.log 2>&1 &
  EOT

  # Cuenta de servicio (opcional)
  service_account {
    email  = var.service_account_email
    scopes = ["cloud-platform"]
  }

  # Tag de red para que la regla firewall se aplique
  tags = ["puppeteer"]
}

# Output de la IP externa
output "puppeteer_external_ip" {
  description = "IP externa del servidor Puppeteer"
  value       = google_compute_address.puppeteer_ip.address
}
