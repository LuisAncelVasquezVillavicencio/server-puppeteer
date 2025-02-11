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

# 4a. Regla de firewall para permitir tráfico en puerto 8081
resource "google_compute_firewall" "puppeteer_firewall" {
  name    = "allow-puppeteer-8081"
  network = google_compute_network.puppeteer_network.self_link

  allow {
    protocol = "tcp"
    ports    = ["8081"]
  }

  source_ranges = ["0.0.0.0/0"]  # SOLO pruebas
  target_tags   = ["puppeteer"] # Aplica a la VM con este tag
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

# 5. Instancia Compute Engine para tu servidor Puppeteer + PM2
resource "google_compute_instance" "puppeteer_vm" {
  name         = "puppeteer-vm"
  machine_type = "e2-medium"
  zone         = var.zone
  project      = var.project_id

  # Disco con Ubuntu
  boot_disk {
    initialize_params {
      image = "ubuntu-os-cloud/ubuntu-2004-lts"
      size  = 20
    }
  }

  # Conexión a la subred y asignando la IP estática
  network_interface {
    subnetwork   = google_compute_subnetwork.puppeteer_subnetwork.self_link
    access_config {
      nat_ip = google_compute_address.puppeteer_ip.address
    }
  }

  # Startup script para clonar tu repo, instalar PM2 y lanzar la app
  metadata_startup_script = <<-EOT
    #!/bin/bash
    apt-get update -y
    # Instalar git, node, npm
    apt-get install -y git nodejs npm

    # Instalar PM2 globalmente
    npm install -g pm2

    # Descargar tu repositorio en /opt
    mkdir -p /opt
    cd /opt
    git clone https://github.com/LuisAncelVasquezVillavicencio/server-puppeteer.git

    # Entrar al repositorio
    cd server-puppeteer

    # Instalar dependencias
    npm install

    # Arrancar con PM2, nombrando el proceso "puppeteer-server"
    pm2 start index.js --name "puppeteer-server"

    # Guardar la lista de procesos para que PM2 los recuerde
    pm2 save

    # Configurar PM2 para que inicie tras cada reinicio
    pm2 startup systemd -u root --hp /root
  EOT

  # (Opcional) Cuenta de servicio con permisos
  service_account {
    email  = var.service_account_email
    scopes = ["cloud-platform"]
  }

  # Tag de red para que aplique la regla de firewall
  tags = ["puppeteer"]
}

# Output con la IP externa
output "puppeteer_external_ip" {
  description = "IP externa del servidor Puppeteer"
  value       = google_compute_address.puppeteer_ip.address
}
