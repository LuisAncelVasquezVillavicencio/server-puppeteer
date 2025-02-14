resource "cloudflare_record" "registro_a" {
  zone_id = var.cloudflare_zone_id
  name    = var.subdominio
  type    = "A"
  content   = var.destino_ip
  proxied = true
  allow_overwrite = true
}
