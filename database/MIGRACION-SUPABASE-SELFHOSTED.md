# Migración a Supabase Self-Hosted

## 📋 Pasos para migrar Estudio 56 a Supabase Self-Hosted

### 1. Exportar datos actuales

#### Opción A: Desde Supabase Dashboard (Recomendado)
1. Ve a tu proyecto Supabase actual: https://supabase.com/dashboard
2. Navega a **Database** → **Backups**
3. Haz clic en **Download** para obtener un dump completo
4. Guarda el archivo como `database/backup-supabase.sql`

#### Opción B: Usando el script de exportación
```bash
# 1. Instalar dependencias
npm install @supabase/supabase-js

# 2. Configurar variables de entorno en .env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu_anon_key_actual

# 3. Ejecutar script de exportación
node database/export-data-script.js

# 4. Se generará: database/data-export.sql
```

### 2. Preparar Supabase Self-Hosted

#### Instalación de Supabase Self-Hosted
```bash
# Clonar repositorio de Supabase
git clone --depth 1 https://github.com/supabase/supabase

# Ir al directorio de Docker
cd supabase/docker

# Copiar archivo de configuración
cp .env.example .env

# Editar .env con tus configuraciones
nano .env
```

#### Configuraciones importantes en .env:
```env
# PostgreSQL
POSTGRES_PASSWORD=tu_password_seguro

# JWT Secret (generar uno nuevo)
JWT_SECRET=tu_jwt_secret_super_seguro

# Anon Key y Service Role Key
# Generar en: https://supabase.com/docs/guides/self-hosting/docker#generate-api-keys
ANON_KEY=tu_anon_key
SERVICE_ROLE_KEY=tu_service_role_key

# URLs
SITE_URL=https://tu-dominio.com
API_EXTERNAL_URL=https://api.tu-dominio.com
```

#### Iniciar Supabase
```bash
# Iniciar todos los servicios
docker-compose up -d

# Verificar que todo esté corriendo
docker-compose ps
```

### 3. Ejecutar migración de esquema

```bash
# Conectarse a PostgreSQL
docker exec -it supabase-db psql -U postgres

# O usar el cliente de tu preferencia con:
# Host: localhost
# Port: 5432
# Database: postgres
# User: postgres
# Password: (el que configuraste en .env)
```

Ejecutar en orden:

```sql
-- 1. Crear esquema completo
\i /path/to/database/complete-migration.sql

-- 2. Importar datos exportados (si usaste opción B)
\i /path/to/database/data-export.sql

-- O si usaste opción A (backup de Supabase)
\i /path/to/database/backup-supabase.sql
```

### 4. Verificar migración

```sql
-- Verificar tablas creadas
\dt

-- Verificar datos en tablas principales
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM brands;
SELECT COUNT(*) FROM flyer_generations;
SELECT COUNT(*) FROM payments;

-- Verificar planes
SELECT * FROM user_plans;

-- Verificar RLS está habilitado
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';
```

### 5. Configurar Storage

El storage de Supabase self-hosted usa MinIO. Necesitas:

1. **Acceder a MinIO Console**:
   - URL: http://localhost:9001
   - User: minioadmin (o el configurado en .env)
   - Password: minioadmin (o el configurado en .env)

2. **Crear buckets**:
   - `logos` (público)
   - `products` (público)

3. **Configurar políticas de acceso**:
   - Ambos buckets deben ser públicos para lectura
   - Las políticas de escritura ya están en el SQL

### 6. Migrar archivos de Storage

#### Opción A: Descarga manual desde Supabase Dashboard
1. Ve a **Storage** en tu Supabase actual
2. Descarga todos los archivos de `logos` y `products`
3. Súbelos manualmente a MinIO

#### Opción B: Script de migración de storage
```javascript
// Crear archivo: database/migrate-storage.js
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const oldSupabase = createClient(
  process.env.OLD_SUPABASE_URL,
  process.env.OLD_SUPABASE_KEY
);

const newSupabase = createClient(
  process.env.NEW_SUPABASE_URL,
  process.env.NEW_SUPABASE_KEY
);

async function migrateStorage() {
  const buckets = ['logos', 'products'];
  
  for (const bucket of buckets) {
    console.log(`Migrando bucket: ${bucket}`);
    
    // Listar archivos
    const { data: files } = await oldSupabase
      .storage
      .from(bucket)
      .list();
    
    for (const file of files) {
      // Descargar
      const { data: blob } = await oldSupabase
        .storage
        .from(bucket)
        .download(file.name);
      
      // Subir a nuevo Supabase
      await newSupabase
        .storage
        .from(bucket)
        .upload(file.name, blob);
      
      console.log(`✅ Migrado: ${file.name}`);
    }
  }
}

migrateStorage();
```

### 7. Actualizar variables de entorno en tu app

Actualizar `.env` y `.env.local`:

```env
# Nuevas URLs de Supabase Self-Hosted
VITE_SUPABASE_URL=https://api.tu-dominio.com
VITE_SUPABASE_ANON_KEY=tu_nuevo_anon_key

# Mantener las demás variables
VITE_GEMINI_API_KEY=...
VITE_FAL_AI_API_KEY=...
# etc.
```

### 8. Configurar dominio y SSL

#### Usando Nginx como reverse proxy:

```nginx
# /etc/nginx/sites-available/supabase
server {
    listen 80;
    server_name api.tu-dominio.com;
    
    location / {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}

server {
    listen 80;
    server_name studio.tu-dominio.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

Configurar SSL con Let's Encrypt:
```bash
sudo certbot --nginx -d api.tu-dominio.com -d studio.tu-dominio.com
```

### 9. Testing

```bash
# 1. Probar autenticación
curl https://api.tu-dominio.com/auth/v1/health

# 2. Probar base de datos
curl https://api.tu-dominio.com/rest/v1/user_plans \
  -H "apikey: tu_anon_key"

# 3. Probar storage
curl https://api.tu-dominio.com/storage/v1/bucket/logos
```

### 10. Deploy de la aplicación

```bash
# 1. Actualizar variables en Netlify
netlify env:set VITE_SUPABASE_URL "https://api.tu-dominio.com"
netlify env:set VITE_SUPABASE_ANON_KEY "tu_nuevo_anon_key"

# 2. Rebuild
netlify deploy --prod
```

## 🔒 Seguridad

### Checklist de seguridad:
- [ ] Cambiar todas las contraseñas por defecto
- [ ] Generar nuevos JWT secrets
- [ ] Configurar firewall para PostgreSQL (solo localhost)
- [ ] Habilitar SSL/TLS en todas las conexiones
- [ ] Configurar backups automáticos
- [ ] Revisar políticas RLS
- [ ] Configurar rate limiting
- [ ] Habilitar logs de auditoría

### Backups automáticos:

```bash
# Crear script de backup: /opt/supabase-backup.sh
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/supabase"
mkdir -p $BACKUP_DIR

# Backup de PostgreSQL
docker exec supabase-db pg_dump -U postgres postgres > \
  $BACKUP_DIR/backup_$DATE.sql

# Backup de Storage (MinIO)
docker exec supabase-storage mc mirror /data/supabase \
  $BACKUP_DIR/storage_$DATE/

# Comprimir
tar -czf $BACKUP_DIR/backup_$DATE.tar.gz \
  $BACKUP_DIR/backup_$DATE.sql \
  $BACKUP_DIR/storage_$DATE/

# Limpiar archivos temporales
rm -rf $BACKUP_DIR/backup_$DATE.sql $BACKUP_DIR/storage_$DATE/

# Mantener solo últimos 7 días
find $BACKUP_DIR -name "backup_*.tar.gz" -mtime +7 -delete
```

Agregar a crontab:
```bash
# Backup diario a las 2 AM
0 2 * * * /opt/supabase-backup.sh
```

## 📊 Monitoreo

### Prometheus + Grafana

```yaml
# docker-compose.monitoring.yml
version: '3.8'
services:
  prometheus:
    image: prom/prometheus
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
    ports:
      - "9090:9090"
  
  grafana:
    image: grafana/grafana
    ports:
      - "3001:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
```

## 🆘 Troubleshooting

### Problema: No se pueden conectar los clientes
```bash
# Verificar que los servicios estén corriendo
docker-compose ps

# Ver logs
docker-compose logs -f supabase-kong
docker-compose logs -f supabase-db
```

### Problema: RLS no funciona
```sql
-- Verificar políticas
SELECT * FROM pg_policies WHERE tablename = 'users';

-- Verificar que RLS esté habilitado
SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';
```

### Problema: Storage no funciona
```bash
# Verificar MinIO
docker-compose logs -f supabase-storage

# Verificar buckets
docker exec -it supabase-storage mc ls supabase
```

## 📚 Recursos

- [Supabase Self-Hosting Docs](https://supabase.com/docs/guides/self-hosting)
- [Docker Compose Setup](https://supabase.com/docs/guides/self-hosting/docker)
- [PostgreSQL Backup Guide](https://www.postgresql.org/docs/current/backup.html)
- [MinIO Documentation](https://min.io/docs/minio/linux/index.html)

## ✅ Checklist Final

- [ ] Esquema de base de datos migrado
- [ ] Datos migrados y verificados
- [ ] Storage configurado y archivos migrados
- [ ] Variables de entorno actualizadas
- [ ] SSL/TLS configurado
- [ ] Backups automáticos configurados
- [ ] Monitoreo configurado
- [ ] Aplicación desplegada y funcionando
- [ ] Tests de integración pasando
- [ ] Documentación actualizada
