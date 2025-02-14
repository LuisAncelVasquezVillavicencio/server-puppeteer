provider "cloudflare" {
  api_token = var.cloudflare_api_token
}

# ✅ Crear Registro A
resource "cloudflare_record" "registro_a" {
  zone_id = var.cloudflare_zone_id
  name    = var.subdominio
  type    = "A"
  value   = var.destino_ip
  proxied = true
}

# ✅ Crear Regla de Página con SSL Estricto
resource "cloudflare_page_rule" "seguridad_ssl" {
  zone_id  = var.cloudflare_zone_id
  target   = "https://${var.subdominio}.${var.dominio}/*"
  priority = 1
  status   = "active"

  actions {
    ssl = "strict"
  }
}

# ✅ Crear el Worker
resource "cloudflare_worker_script" "mi_worker" {
  name = "bot-protector"
  content = file("${path.module}/worker.js")
}

# ✅ Asignar el Worker al dominio
resource "cloudflare_worker_route" "asignacion_worker" {
  zone_id     = var.cloudflare_zone_id
  pattern     = "${var.subdominio}.${var.dominio}/*"
  script_name = cloudflare_worker_script.mi_worker.name
}
