resource "cloudflare_worker_script" "mi_worker" {
  name = "bot-protector"
  content = file("${path.module}/worker.js")
}

resource "cloudflare_worker_route" "asignacion_worker" {
  zone_id = var.cloudflare_zone_id
  pattern = "${var.subdominio}.${var.dominio}/*"
  script_name = cloudflare_worker_script.mi_worker.name
}
