variable "project_id" {
  type        = string
  description = "ID del proyecto de GCP"
}

variable "region" {
  type        = string
  description = "Región de GCP"
  default     = "us-central1"
}

variable "zone" {
  type        = string
  description = "Zona de GCP"
  default     = "us-central1-a"
}

variable "service_account_email" {
  type        = string
  description = "Correo de la cuenta de servicio (opcional)."
  default     = "" # Si dejas vacío, usará la cuenta default de Compute
}

// language: terraform
variable "db_username" {
  type        = string
  description = "Nombre de usuario para la base de datos"
}

variable "db_password" {
  type        = string
  description = "Contraseña para la base de datos"
  sensitive   = true
}

variable "db_name" {
  type        = string
  description = "Nombre de la base de datos para los reportes de analytics"
}