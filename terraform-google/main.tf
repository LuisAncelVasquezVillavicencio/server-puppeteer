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

# 4a. Regla de firewall para permitir tráfico en puerto 80 (HTTP)
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

# 4b. Regla de firewall para permitir tráfico HTTPS (puerto 443)
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

# 4c. Regla de firewall para SSH (puerto 22) (solo en pruebas, restringir en producción) 
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

# 5. Instancia Compute Engine para Puppeteer + NGINX
resource "google_compute_instance" "puppeteer_vm" {
  name         = "puppeteer-vm"
  machine_type = "e2-medium"
  zone         = var.zone
  project      = var.project_id
  
  metadata = {
    google-logging-enabled = "true"
  }
  
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

  # Startup script mejorado con NGINX + Node.js + Puppeteer
  metadata_startup_script = <<-EOT
    #!/bin/bash
    exec > /var/log/startup-script.log 2>&1  # Redirigir stdout y stderr a un log
    echo "⏳ Iniciando instalación..."

    apt-get update -y
    apt-get install -y wget unzip git curl nginx

    echo "✅ Instalación de paquetes básicos completada"

    # Instalar PostgreSQL y sus contribuciones
    apt-get install -y postgresql postgresql-contrib
    echo "✅ PostgreSQL instalado"
    
    # Esperar a que se inicie el servicio de PostgreSQL
    systemctl enable postgresql
    systemctl start postgresql

    # Configurar la base de datos: crear usuario y base de datos si no existen.
    sudo -u postgres psql -c "DO \$\$ BEGIN IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = '${var.db_username}') THEN CREATE ROLE ${var.db_username} LOGIN PASSWORD '${var.db_password}'; END IF; END\$\$;"
    sudo -u postgres psql -c "DO \$\$ BEGIN IF NOT EXISTS (SELECT FROM pg_database WHERE datname = '${var.db_name}') THEN CREATE DATABASE ${var.db_name} OWNER ${var.db_username}; END IF; END\$\$;"
    echo "✅ Base de datos '${var.db_name}' configurada con el usuario '${var.db_username}'"


    # Instalar Node.js 18+ (necesario para Puppeteer)
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    apt-get install -y nodejs

    echo "✅ Node.js instalado"

    # Instalar PM2 globalmente
    npm install -g pm2
    echo "✅ PM2 instalado"

    # Instalar Redis
    apt-get install -y redis-server
    systemctl enable redis-server
    systemctl start redis-server
    echo "✅ Redis instalado y en ejecución"

    # Descargar repositorio
    mkdir -p /opt
    cd /opt
    git clone https://github.com/LuisAncelVasquezVillavicencio/server-puppeteer.git

    echo "✅ Repositorio clonado"

    # Dar permisos adecuados
    chown -R root:root /opt/server-puppeteer
    chmod -R 755 /opt/server-puppeteer

    # Entrar al repositorio
    cd /opt/server-puppeteer/puppeteer-server

    # Instalar dependencias 
    npm install
    echo "✅ Dependencias instaladas"

    # Instalar Google Chrome estable
    wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
    sudo apt install -y ./google-chrome-stable_current_amd64.deb

    echo "✅ Google Chrome instalado"

    # Verificar la instalación de Chrome
    google-chrome --version

    # Permitir que Node.js use el puerto 8080 sin root
    sudo setcap 'cap_net_bind_service=+ep' $(which node)

    # Arrancar el servidor en el puerto 8080
    pm2 start app.js --name "puppeteer-server" --output "/var/log/pm2/puppeteer-server.log" --error "/var/log/pm2/puppeteer-server-error.log"
    echo "✅ Servidor Puppeteer iniciado con PM2"

    # Guardar procesos de PM2
    pm2 save
    pm2 startup systemd -u root --hp /root

    # Configurar NGINX como Proxy Reverso
    cat <<EOF > /etc/nginx/sites-available/default
    server {
        listen 80;
        server_name _;
        location / {
            proxy_pass http://localhost:8080;
            proxy_set_header Host \$host;
            proxy_set_header X-Real-IP \$remote_addr;
            proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto \$scheme;
        }
    }
    EOF

    # Reiniciar NGINX
    systemctl restart nginx
    systemctl enable nginx
    echo "✅ NGINX configurado y reiniciado"

    echo "🚀 Instalación completada"
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
