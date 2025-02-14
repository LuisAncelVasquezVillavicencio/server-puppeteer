resource "cloudflare_page_rule" "seguridad_ssl" {
  zone_id  = var.cloudflare_zone_id
  target   = "https://${var.subdominio}.${var.dominio}/*"
  priority = 1
  status   = "active"

  actions {
    ssl = "flexible" # SSL Flexible activado
  }

}
