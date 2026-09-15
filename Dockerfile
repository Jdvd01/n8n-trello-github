FROM n8nio/n8n:latest

ENV N8N_LISTEN_ADDRESS=0.0.0.0

CMD ["sh", "-c", "n8n start --port ${PORT:-5678}"]