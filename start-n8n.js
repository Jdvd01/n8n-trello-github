const { spawn } = require('node:child_process');

const port = process.env.PORT || process.env.N8N_PORT || '5678';
const environment = {
  ...process.env,
  N8N_PORT: port,
  N8N_LISTEN_ADDRESS: process.env.N8N_LISTEN_ADDRESS || '0.0.0.0'
};

const n8n = spawn('/usr/local/bin/n8n', ['start'], {
  env: environment,
  stdio: 'inherit'
});

n8n.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
  } else {
    process.exit(code ?? 1);
  }
});