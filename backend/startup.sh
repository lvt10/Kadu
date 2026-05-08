#!/bin/bash
# startup.sh — executado pelo Azure App Service antes de iniciar o Node.js
# Configure em: Azure Portal > App Service > Configuration > General Settings > Startup Command
# Startup command: bash startup.sh

mkdir -p /home/data
echo "✅ /home/data pronto"

node --experimental-sqlite server.js
