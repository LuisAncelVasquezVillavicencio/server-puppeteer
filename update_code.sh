#!/bin/bash

REPO_DIR="/opt/server-puppeteer/puppeteer-server"

echo "⏳ Deteniendo servidor con PM2 como deployer..."
sudo -u deployer -i pm2 stop puppeteer-server || true

echo "🔄 Descartando cambios locales y actualizando repositorio..."
sudo -u deployer -i git -C "$REPO_DIR" fetch --all
sudo -u deployer -i git -C "$REPO_DIR" reset --hard origin/main

echo "📦 Instalando dependencias..."
sudo -u deployer -i npm --prefix "$REPO_DIR" install

echo "🔧 Construyendo la aplicación..."
sudo -u deployer -i npm --prefix "$REPO_DIR" run build

echo "🚀 Reiniciando aplicación con PM2 como deployer..."
sudo -u deployer -i pm2 restart puppeteer-server

echo "✅ Actualización completada."
