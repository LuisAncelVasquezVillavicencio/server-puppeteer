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
