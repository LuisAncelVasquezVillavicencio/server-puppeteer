terraform {
  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 4.0"
    }
  }
}

provider "cloudflare" {
  api_token = var.cloudflare_api_token
}

module "dns" {
  source             = "./modules/dns"
  cloudflare_zone_id = var.cloudflare_zone_id
  subdominio         = var.subdominio
  dominio            = var.dominio
  destino_ip         = var.destino_ip
  providers = {
    cloudflare = cloudflare
  }
}

module "rules" {
  source             = "./modules/rules"
  cloudflare_zone_id = var.cloudflare_zone_id
  subdominio         = var.subdominio
  dominio            = var.dominio
  providers = {
    cloudflare = cloudflare
  }
}

module "workers" {
  source              = "./modules/workers"
  cloudflare_zone_id  = var.cloudflare_zone_id
  cloudflare_account_id = var.cloudflare_account_id
  subdominio          = var.subdominio
  dominio             = var.dominio
  providers = {
    cloudflare = cloudflare
  }
}