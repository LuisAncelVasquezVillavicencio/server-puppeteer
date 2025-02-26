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

resource "google_compute_network" "puppeteer_network" {
  name                    = "puppeteer-network"
  auto_create_subnetworks = false
}

resource "google_compute_subnetwork" "puppeteer_subnetwork" {
  name          = "puppeteer-subnetwork"
  ip_cidr_range = "10.0.0.0/24"
  network       = google_compute_network.puppeteer_network.self_link
  region        = var.region
}

resource "google_compute_address" "puppeteer_ip" {
  name    = "puppeteer-ip"
  project = var.project_id
  region  = var.region
}

resource "google_compute_firewall" "allow_http" {
  name    = "allow-http"
  network = google_compute_network.puppeteer_network.self_link

  allow {
    protocol = "tcp"
    ports    = ["80"]
  }

  source_ranges = ["0.0.0.0/0"]
  target_tags   = ["puppeteer"]
}

resource "google_compute_firewall" "allow_https" {
  name    = "allow-https"
  network = google_compute_network.puppeteer_network.self_link

  allow {
    protocol = "tcp"
    ports    = ["443"]
  }

  source_ranges = ["0.0.0.0/0"]
  target_tags   = ["puppeteer"]
}

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

resource "google_compute_instance" "puppeteer_vm" {
  name         = "puppeteer-vm"
  machine_type = "e2-medium"
  zone         = var.zone
  project      = var.project_id

  metadata = {
    google-logging-enabled = "true"
  }

  boot_disk {
    initialize_params {
      image = "ubuntu-os-cloud/ubuntu-2004-lts"
      size  = 20
    }
  }

  network_interface {
    subnetwork   = google_compute_subnetwork.puppeteer_subnetwork.self_link
    access_config {
      nat_ip = google_compute_address.puppeteer_ip.address
    }
  }

  metadata_startup_script = <<-EOT
    #!/bin/bash
    exec > /var/log/startup-script.log 2>&1
    echo "⏳ Iniciando instalación..."

    ##############################################################################
    # 1. Crear usuario "puppeteer" y preparar directorio para logs
    ##############################################################################
    id -u puppeteer &>/dev/null || adduser --disabled-password --gecos "" puppeteer
    mkdir -p /var/log/puppeteer
    chown -R puppeteer:puppeteer /var/log/puppeteer
    chmod 755 /var/log/puppeteer

    ##############################################################################
    # 2. Instalar paquetes básicos como root
    ##############################################################################
    apt-get update -y
    apt-get install -y wget unzip git curl nginx gdebi-core
    echo "✅ Instalación de paquetes básicos completada"

    ##############################################################################
    # 3. Instalar PostgreSQL y configurar base de datos
    ##############################################################################
    apt-get install -y postgresql postgresql-contrib
    echo "✅ PostgreSQL instalado"
    systemctl enable postgresql
    systemctl start postgresql
    sleep 5
    sudo -u postgres psql -c "CREATE ROLE ${var.db_username} LOGIN PASSWORD '${var.db_password}'" || true
    sudo -u postgres psql -c "CREATE DATABASE ${var.db_name} OWNER ${var.db_username}" || true
    echo "✅ Base de datos '${var.db_name}' configurada"

    ##############################################################################
    # 4. Instalar Node.js y PM2
    ##############################################################################
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    apt-get install -y nodejs
    npm install -g pm2
    echo "✅ Node.js y PM2 instalados"

    ##############################################################################
    # 5. Instalar y configurar Redis
    ##############################################################################
    apt-get install -y redis-server
    systemctl enable redis-server
    systemctl start redis-server
    chown redis:redis /var/lib/redis
    chmod 770 /var/lib/redis
    echo "✅ Redis instalado y en ejecución"

    ##############################################################################
    # 6. Clonar repositorio y arrancar la app con usuario "puppeteer"
    ##############################################################################
    sudo -u puppeteer bash <<'EOF_USER'
      set -e

      # Definir variables de entorno para PM2
      export HOME=/home/puppeteer
      export PM2_HOME=/home/puppeteer/.pm2

      # Clonar repositorio en /opt y dar permisos al usuario puppeteer
      mkdir -p /opt
      cd /opt
      git clone https://github.com/LuisAncelVasquezVillavicencio/server-puppeteer.git
      echo "✅ Repositorio clonado"

      # Ajustar permisos del repositorio
      chown -R puppeteer:puppeteer /opt/server-puppeteer
      chmod -R 755 /opt/server-puppeteer

      cd /opt/server-puppeteer/puppeteer-server
      npm install
      echo "✅ Dependencias instaladas"

      # Instalar Google Chrome para Puppeteer
      wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
      sudo gdebi -n google-chrome-stable_current_amd64.deb
      echo "✅ Google Chrome instalado"
      google-chrome --version

      # Construir la aplicación Next.js
      echo '⏳ Ejecutando build de Next.js...'
      npm run build
      echo '✅ Build completado'

      # Ajustar permisos en .next
      chmod -R 755 /opt/server-puppeteer/puppeteer-server/.next
      chown -R puppeteer:puppeteer /opt/server-puppeteer/puppeteer-server/.next

      # Iniciar la app con PM2, logs en /var/log/puppeteer
      pm2 start npm --name "puppeteer-server" -- run start \
        --output "/var/log/puppeteer/puppeteer-server.log" \
        --error "/var/log/puppeteer/puppeteer-server-error.log"

      pm2 save
      pm2 startup systemd -u puppeteer --hp /home/puppeteer
      echo "✅ Servidor iniciado con PM2 bajo el usuario puppeteer"
    EOF_USER

    ##############################################################################
    # 7. Configurar Nginx (como root)
    ##############################################################################
    cat <<'EOF' > /etc/nginx/sites-available/default
    server {
      listen 80;
      server_name _;

      location /ws {
        proxy_pass http://localhost:8080/ws;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
      }

      location / {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
      }
    }
    EOF

    systemctl restart nginx
    systemctl enable nginx
    echo "✅ NGINX configurado y reiniciado"
    echo "🚀 Instalación completada "
  EOT


  service_account {
    email  = var.service_account_email
    scopes = ["cloud-platform"]
  }

  tags = ["puppeteer"]
}

output "puppeteer_external_ip" {
  description = "IP externa del servidor Puppeteer"
  value       = google_compute_address.puppeteer_ip.address
}
