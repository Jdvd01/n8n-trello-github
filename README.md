# n8n: Trello to GitHub Issues

Repositorio base para desplegar n8n en Railway y automatizar la creación o actualización de GitHub Issues a partir de eventos de Trello.

## Estructura

- `Dockerfile`: imagen oficial de n8n configurada para escuchar el puerto de Railway.
- `railway.json`: configuración de build y healthcheck.
- `compose.yaml`: arranque local de n8n con Docker Compose y persistencia.
- `.env.example`: variables necesarias para n8n, PostgreSQL y GitHub.
- `.env.local.example`: variables mínimas para desarrollo local con SQLite.
- `workflows/trello-to-github-issue.json`: workflow de ejemplo para importar en n8n.

## Despliegue en Railway

1. Crea un repositorio vacío en GitHub y sube este proyecto.
2. En Railway, crea un proyecto y elige **Deploy from GitHub repo**.
3. Añade el plugin **PostgreSQL** al mismo proyecto.
4. En el servicio de n8n, configura `N8N_ENCRYPTION_KEY`, `N8N_HOST`, `N8N_PROTOCOL`, `N8N_WEBHOOK_URL`, `N8N_BLOCK_ENV_ACCESS_IN_NODE=false` y `DB_TYPE=postgresdb`.
5. En el servicio n8n, crea `DB_POSTGRESDB_HOST`, `DB_POSTGRESDB_PORT`, `DB_POSTGRESDB_DATABASE`, `DB_POSTGRESDB_USER` y `DB_POSTGRESDB_PASSWORD` usando referencias de Railway. Si el servicio se llama `Postgres`, los valores son `${{Postgres.PGHOST}}`, `${{Postgres.PGPORT}}`, `${{Postgres.PGDATABASE}}`, `${{Postgres.PGUSER}}` y `${{Postgres.PGPASSWORD}}`. Sustituye `Postgres` por el nombre exacto de tu servicio si es diferente.
6. Genera un dominio público en **Settings > Networking** y actualiza `N8N_HOST` y `WEBHOOK_URL` con ese dominio.
7. Abre n8n, crea el usuario propietario e importa `workflows/trello-to-github-issue.json`.

Railway proporciona `PORT` automáticamente. El launcher incluido lee `PORT` y configura `N8N_PORT`; no configures `PORT` ni `N8N_PORT` manualmente en Railway.

## Credenciales y GitHub

El workflow de ejemplo espera `GITHUB_OWNER`, `GITHUB_REPO` y `GITHUB_TOKEN` como variables de entorno de n8n. Para producción, es preferible crear una credencial de GitHub en n8n y seleccionarla en el nodo HTTP Request.

Para copiar responsables y labels, añade también `TRELLO_API_KEY` y `TRELLO_TOKEN`. El workflow consulta los detalles de la card y usa el `username` de cada miembro de Trello como login de GitHub. Los labels se copian por nombre directamente. El token de GitHub debe tener permisos `Issues: Read and write`.

Con un fine-grained token de GitHub, concede **Issues: Read and write** sobre el repositorio elegido. No guardes tokens en el repositorio.

## Configurar Trello

El workflow expone `POST /webhook/trello-card-created`. Solo continúa cuando el evento es una tarjeta creada en `Dev To Do` o una tarjeta movida hacia esa lista. En Trello, configura un webhook sobre el tablero o modelo que quieras observar y usa la URL de producción que muestra n8n.

El workflow consulta la card en la API de Trello para resolver uno o varios responsables y sus labels. Necesitas una API key y un token de Trello con acceso al tablero.

`N8N_BLOCK_ENV_ACCESS_IN_NODE=false` es necesario porque el workflow lee las variables `GITHUB_*` y `TRELLO_*` mediante `$env`. En una instalación compartida o más sensible, sustituye ese acceso por credenciales nativas de n8n.

## Desarrollo local

Para probar n8n localmente, crea el archivo de variables y completa el token de GitHub:

```bash
cp .env.local.example .env.local
docker compose up -d
```

La instancia quedará disponible en `http://localhost:5678`. Los datos se guardan en el volumen Docker `n8n_data`, así que no se pierden al detener el contenedor.

Comandos útiles:

```bash
docker compose logs -f n8n
docker compose down
docker compose up -d
```
