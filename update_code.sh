#!/bin/bash

# Ruta del repositorio
REPO_DIR="/opt/server-puppeteer/puppeteer-server"

echo "⏳ Deteniendo servidor con PM2..."
pm2 stop puppeteer-server || true

echo "🔄 Actualizando código..."
cd $REPO_DIR
git pull origin main

echo "📦 Instalando dependencias..."
npm install

echo "🔧 Construyendo la aplicación..."
npm run build

echo "🚀 Reiniciando aplicación con PM2..."
pm2 restart puppeteer-server

echo "✅ Actualización completada."
