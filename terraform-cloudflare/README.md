# Terraform Cloudflare Configuration

Este proyecto configura los registros DNS y los Workers en Cloudflare utilizando Terraform.

## Variables de Configuración

En el archivo `terraform.tfvars`, se definen las siguientes variables:

- `cloudflare_api_token`: Token de API de Cloudflare.
- `cloudflare_zone_id`: ID de la zona de Cloudflare.
- `subdominio`: Subdominio que se configurará en Cloudflare.
- `dominio`: Dominio principal.
- `destino_ip`: IP de destino para el registro A.

### Valores Actuales

```plaintext
cloudflare_api_token = "nleq_apvkS3DcBh5HdAgkuiRZ_M4C2wRv_v0TuWY"
cloudflare_zone_id   = "5c68abc89bda3c35285c884bc97271dc"
subdominio           = "render2"
dominio              = "portalmicanva.com"
destino_ip           = "35.226.22.221"
```

### Cómo Generar los Valores

1. **Token de API de Cloudflare (`cloudflare_api_token`)**:
   - Ve a la [página de Tokens de API de Cloudflare](https://dash.cloudflare.com/profile/api-tokens).
   - Crea un nuevo token con permisos para configurar DNS, reglas de página y administrar Workers.

2. **ID de la Zona de Cloudflare (`cloudflare_zone_id`)**:
   - Ve a la [página de tu dominio en Cloudflare](https://dash.cloudflare.com).
   - El ID de la zona se encuentra en la sección "Información de la Zona".

3. **Subdominio (`subdominio`)**:
   - Define el subdominio que deseas configurar, por ejemplo, `render2`.

4. **Dominio (`dominio`)**:
   - Define tu dominio principal, por ejemplo, `portalmicanva.com`.

5. **IP de Destino (`destino_ip`)**:
   - Define la IP de destino para el registro A, por ejemplo, `35.226.22.221`.

## Ejecución de Terraform

Para ejecutar Terraform y aplicar la configuración, sigue estos pasos:

1. **Inicializar Terraform**:
   ```sh
   terraform init
   ```
2. **Planificar la Infraestructura**:
   ```sh
   terraform plan
   ```
3. **Aplicar la Configuración:**:
   ```sh
   terraform apply
   ```
## Permisos Correctos para Terraform en Cloudflare

Necesitas permisos para:

- Configurar registros DNS (Registro A)
- Configurar reglas de página (Page Rules)
- Administrar Workers y asignarlos a dominios

### Permisos Necesarios (Slecciona tipo de permiso)

| Permiso          | Recurso         | Acción |
|------------------|-----------------|--------|
| Zone             | DNS             | Edit   |
| Zone             | Page Rules      | Edit   |
| Zone             | Workers Routes  | Edit   |
| Zone             | Workers Scripts | Edit   |
| Account          | Workers Scripts | Edit   |

## Contribuciones

Las contribuciones son bienvenidas. Por favor, abre un issue o un pull request para cualquier mejora o corrección.

## Licencia

Este proyecto está licenciado bajo la Licencia MIT.

Adicional :

## Recomendacion habilitar fallo abierto
## Ir a la consola de Cloudflare → Workers & Pages
1. Seleccionar tu Worker
2. Editar la ruta donde se asigna el Worker
3. Habilitar "Fallo abierto (continuar)", que permite que las rutas excluidas sean ignoradas por el Worker y vayan al servidor de origen.


# Tarifario de Precios de Cloudflare Workers

Cloudflare ofrece un plan de pago para su plataforma Workers que incluye una cantidad específica de solicitudes mensuales y un costo adicional por solicitudes que excedan ese límite.

## **Plan de Workers:**
- **Costo mensual:** $5 USD
- **Solicitudes incluidas:** 10 millones de solicitudes por mes
- **Costo por solicitudes adicionales:** $0.30 USD por cada millón de solicitudes adicionales

### **Ejemplos de costos mensuales según volumen de solicitudes:**

| **Cantidad de Solicitudes (millones)** | **Costo Mensual (USD)** |
|----------------------------------------|-------------------------|
| 10                                     | $5.00                   |
| 20                                     | $5.00 + $3.00 = $8.00   |
| 50                                     | $5.00 + $12.00 = $17.00 |
| 100                                    | $5.00 + $27.00 = $32.00 |
| 200                                    | $5.00 + $57.00 = $62.00 |
| 500                                    | $5.00 + $147.00 = $152.00 |
| 1000                                   | $5.00 + $297.00 = $302.00 |

## **Notas:**
- Para los primeros 10 millones de solicitudes mensuales, el costo es de $5 USD.
- Por cada millón de solicitudes adicionales, se añade un costo de $0.30 USD.

Para más detalles y actualizaciones sobre los precios, consulta la página oficial de precios de la plataforma para desarrolladores de Cloudflare:  
[Cloudflare Workers Pricing](https://www.cloudflare.com/es-la/plans/developer-platform-pricing/)


