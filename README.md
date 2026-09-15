# n8n: Trello to GitHub Issues

Repositorio base para desplegar n8n en Railway y automatizar la creación o actualización de GitHub Issues a partir de eventos de Trello.

## Estructura

- `Dockerfile`: imagen oficial de n8n configurada para escuchar el puerto de Railway.
- `railway.json`: configuración de build y healthcheck.
- `.env.example`: variables necesarias para n8n, PostgreSQL y GitHub.
- `workflows/trello-to-github-issue.json`: workflow de ejemplo para importar en n8n.

## Despliegue en Railway

1. Crea un repositorio vacío en GitHub y sube este proyecto.
2. En Railway, crea un proyecto y elige **Deploy from GitHub repo**.
3. Añade el plugin **PostgreSQL** al mismo proyecto.
4. En el servicio de n8n, configura `N8N_ENCRYPTION_KEY`, `N8N_HOST`, `N8N_PROTOCOL`, `WEBHOOK_URL` y `DB_TYPE=postgresdb`.
5. Mapea `DB_POSTGRESDB_HOST`, `DB_POSTGRESDB_PORT`, `DB_POSTGRESDB_DATABASE`, `DB_POSTGRESDB_USER` y `DB_POSTGRESDB_PASSWORD` a `PGHOST`, `PGPORT`, `PGDATABASE`, `PGUSER` y `PGPASSWORD` del servicio PostgreSQL.
6. Genera un dominio público en **Settings > Networking** y actualiza `N8N_HOST` y `WEBHOOK_URL` con ese dominio.
7. Abre n8n, crea el usuario propietario e importa `workflows/trello-to-github-issue.json`.

Railway proporciona `PORT` automáticamente. El `Dockerfile` lo usa al arrancar n8n; no necesitas fijarlo manualmente.

## Credenciales y GitHub

El workflow de ejemplo espera `GITHUB_OWNER`, `GITHUB_REPO` y `GITHUB_TOKEN` como variables de entorno de n8n. Para producción, es preferible crear una credencial de GitHub en n8n y seleccionarla en el nodo HTTP Request.

Con un fine-grained token de GitHub, concede **Issues: Read and write** sobre el repositorio elegido. No guardes tokens en el repositorio.

## Configurar Trello

El workflow expone `POST /webhook/trello-card-created`. En Trello, configura un webhook sobre el tablero o modelo que quieras observar y usa la URL de producción que muestra n8n.

El payload real de Trello puede variar según el evento. El nodo `Normalize Trello Card` concentra el mapeo de campos para que puedas adaptarlo sin tocar la llamada a GitHub.

## Desarrollo local

Para probar n8n localmente, copia `.env.example` a `.env`, completa los valores y ejecuta:

```bash
docker run --rm -it --env-file .env -p 5678:5678 n8nio/n8n:latest
```

La instancia quedará disponible en `http://localhost:5678`. Para persistencia local, monta un volumen en `/home/node/.n8n`.
