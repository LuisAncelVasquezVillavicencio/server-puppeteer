variable "cloudflare_api_token" {
  type        = string
  description = "API Token de Cloudflare"
}

variable "cloudflare_zone_id" {
  type        = string
  description = "ID de la zona de Cloudflare"
}

variable "subdominio" {
  type        = string
  description = "Subdominio a configurar"
}

variable "dominio" {
  type        = string
  description = "Dominio principal"
}

variable "destino_ip" {
  type        = string
  description = "IP destino del registro A"
}

variable "cloudflare_account_id" {
  type        = string
  description = "Cloudflare Account ID"
}