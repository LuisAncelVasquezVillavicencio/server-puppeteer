# Crear el Worker en Cloudflare
resource "cloudflare_workers_script" "mi_worker" {
  account_id = var.cloudflare_account_id
  name       = "bot-seo"
  content    = file("${path.module}/worker.js")
}

# Configurar la ruta del Worker para TODOS los subdominios
resource "cloudflare_workers_route" "asignacion_worker_subdominios" {
  zone_id     = var.cloudflare_zone_id
  pattern     = "*.${var.dominio}/*"
  script_name = cloudflare_workers_script.mi_worker.name
}

# Configurar la ruta del Worker para el dominio raíz
resource "cloudflare_workers_route" "asignacion_worker_raiz" {
  zone_id     = var.cloudflare_zone_id
  pattern     = "${var.dominio}/*"
  script_name = cloudflare_workers_script.mi_worker.name
}

