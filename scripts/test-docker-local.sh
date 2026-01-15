#!/bin/bash

# Script para probar el Dockerfile localmente antes de subir a Easypanel
# Autor: Kiro AI
# Fecha: 15 Enero 2026

set -e

echo "🐳 Test Docker Local - Estudio 56"
echo "=================================="
echo ""

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Variables
IMAGE_NAME="estudio56-test"
CONTAINER_NAME="estudio56-test-container"
PORT=8080

echo "📦 Paso 1: Construyendo imagen Docker..."
echo ""

docker build -t $IMAGE_NAME:latest . \
  --build-arg CACHEBUST=$(date +%s)

if [ $? -eq 0 ]; then
  echo -e "${GREEN}✅ Imagen construida exitosamente${NC}"
else
  echo -e "${RED}❌ Error al construir imagen${NC}"
  exit 1
fi

echo ""
echo "🧹 Paso 2: Limpiando contenedores anteriores..."
docker rm -f $CONTAINER_NAME 2>/dev/null || true

echo ""
echo "🚀 Paso 3: Iniciando contenedor..."
echo ""

docker run -d \
  --name $CONTAINER_NAME \
  -p $PORT:80 \
  -e NODE_ENV=production \
  -e PORT=3000 \
  -e VITE_GEMINI_API_KEY=AIzaSyA40oZ6hUsB4PaZ1emgzDLez06P4ZNmJfw \
  -e VITE_SUPABASE_URL=https://supabase.estudio56.cl \
  -e VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJhbm9uIiwKICAgICJpc3MiOiAic3VwYWJhc2UtZGVtbyIsCiAgICAiaWF0IjogMTY0MTc2OTIwMCwKICAgICJleHAiOiAxNzk5NTM1NjAwCn0.dc_X5iR_VP_qT0zsiyj_I_OZ2T9FtRU2BBNWN8Bu4GE \
  -e VITE_GOOGLE_VERTEX_PROJECT=stratega-ai-x \
  -e VITE_GOOGLE_VERTEX_LOCATION=us-central1 \
  -e GEMINI_API_KEY=AIzaSyA40oZ6hUsB4PaZ1emgzDLez06P4ZNmJfw \
  -e FAL_AI_API_KEY=53f17bdf-d098-44d0-af18-5c7cc1984203:4ae450f687dd2d6b04b75fcdc8fe7d28 \
  -e GOOGLE_VERTEX_PROJECT=stratega-ai-x \
  -e GOOGLE_VERTEX_LOCATION=us-central1 \
  -e MERCADOPAGO_ACCESS_TOKEN=APP_USR-5737650046044163-010717-c671110b021996141c7378d0fa3743f3-2485402971 \
  -e MERCADOPAGO_PUBLIC_KEY=APP_USR-63af4295-1d02-4c5a-9705-706d295da708 \
  -e REACT_APP_SUPABASE_URL=https://supabase.estudio56.cl \
  -e SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpza3VuZW12ZmZ5cXl4dGZxeXptIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Njk4MjQyNywiZXhwIjoyMDgyNTU4NDI3fQ.ttKR7Bp4u8sMnet8Y5u-AkW9u7by7aV6CAIstdtPtbM \
  -e REACT_APP_USE_VIDEO_WORKER=true \
  -e REACT_APP_VIDEO_WORKER_URL=https://estudio56-video-worker.brifyaimaster.workers.dev \
  -e SECRETS_SCAN_SMART_DETECTION_ENABLED=false \
  $IMAGE_NAME:latest

if [ $? -eq 0 ]; then
  echo -e "${GREEN}✅ Contenedor iniciado${NC}"
else
  echo -e "${RED}❌ Error al iniciar contenedor${NC}"
  exit 1
fi

echo ""
echo "⏳ Esperando 10 segundos para que el servidor inicie..."
sleep 10

echo ""
echo "📋 Paso 4: Verificando logs..."
echo ""
echo "--- LOGS DEL CONTENEDOR ---"
docker logs $CONTAINER_NAME
echo "--- FIN LOGS ---"
echo ""

# Verificar que los logs contienen lo esperado
LOGS=$(docker logs $CONTAINER_NAME 2>&1)

if echo "$LOGS" | grep -q "Servidor corriendo en puerto 3000"; then
  echo -e "${GREEN}✅ Node.js backend iniciado correctamente${NC}"
else
  echo -e "${RED}❌ Node.js backend NO se inició${NC}"
  echo -e "${YELLOW}⚠️  Verifica los logs arriba${NC}"
fi

if echo "$LOGS" | grep -q "nginx"; then
  echo -e "${GREEN}✅ Nginx iniciado correctamente${NC}"
else
  echo -e "${RED}❌ Nginx NO se inició${NC}"
  echo -e "${YELLOW}⚠️  Verifica los logs arriba${NC}"
fi

echo ""
echo "🧪 Paso 5: Probando API..."
echo ""

# Probar health endpoint
echo "Probando: http://localhost:$PORT/api/health"
HEALTH_RESPONSE=$(curl -s -w "\n%{http_code}" http://localhost:$PORT/api/health)
HTTP_CODE=$(echo "$HEALTH_RESPONSE" | tail -n1)
BODY=$(echo "$HEALTH_RESPONSE" | head -n-1)

echo "HTTP Code: $HTTP_CODE"
echo "Response: $BODY"

if [ "$HTTP_CODE" = "200" ]; then
  echo -e "${GREEN}✅ API health endpoint funciona${NC}"
else
  echo -e "${RED}❌ API health endpoint falló (HTTP $HTTP_CODE)${NC}"
fi

echo ""
echo "Probando: http://localhost:$PORT/ (frontend)"
FRONTEND_RESPONSE=$(curl -s -w "\n%{http_code}" http://localhost:$PORT/)
HTTP_CODE=$(echo "$FRONTEND_RESPONSE" | tail -n1)

if [ "$HTTP_CODE" = "200" ]; then
  echo -e "${GREEN}✅ Frontend responde correctamente${NC}"
else
  echo -e "${RED}❌ Frontend falló (HTTP $HTTP_CODE)${NC}"
fi

echo ""
echo "=================================="
echo "🎯 RESUMEN"
echo "=================================="
echo ""
echo "Contenedor: $CONTAINER_NAME"
echo "Puerto: http://localhost:$PORT"
echo ""
echo "Para ver logs en tiempo real:"
echo "  docker logs -f $CONTAINER_NAME"
echo ""
echo "Para detener el contenedor:"
echo "  docker stop $CONTAINER_NAME"
echo ""
echo "Para eliminar el contenedor:"
echo "  docker rm -f $CONTAINER_NAME"
echo ""
echo "Para acceder al contenedor:"
echo "  docker exec -it $CONTAINER_NAME sh"
echo ""

# Verificación final
if echo "$LOGS" | grep -q "Servidor corriendo en puerto 3000" && \
   echo "$LOGS" | grep -q "nginx" && \
   [ "$HTTP_CODE" = "200" ]; then
  echo -e "${GREEN}✅ TODAS LAS PRUEBAS PASARON${NC}"
  echo ""
  echo "El Dockerfile está funcionando correctamente."
  echo "Puedes subirlo a Easypanel con confianza."
  echo ""
  exit 0
else
  echo -e "${RED}❌ ALGUNAS PRUEBAS FALLARON${NC}"
  echo ""
  echo "Revisa los logs arriba para identificar el problema."
  echo ""
  exit 1
fi
