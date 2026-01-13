/**
 * Script para exportar datos de Supabase actual
 * 
 * INSTRUCCIONES:
 * 1. Instalar dependencias: npm install @supabase/supabase-js
 * 2. Configurar variables de entorno en .env:
 *    VITE_SUPABASE_URL=tu_url_actual
 *    VITE_SUPABASE_ANON_KEY=tu_key_actual
 * 3. Ejecutar: node database/export-data-script.js
 * 4. Se generará un archivo: database/data-export.sql
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración de Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY deben estar configurados');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Función para escapar valores SQL
function escapeSQLValue(value) {
  if (value === null || value === undefined) return 'NULL';
  if (typeof value === 'boolean') return value ? 'TRUE' : 'FALSE';
  if (typeof value === 'number') return value;
  if (Array.isArray(value)) return `ARRAY[${value.map(v => `'${String(v).replace(/'/g, "''")}'`).join(', ')}]`;
  if (value instanceof Date) return `'${value.toISOString()}'`;
  return `'${String(value).replace(/'/g, "''")}'`;
}

// Función para generar INSERT statements
function generateInserts(tableName, rows) {
  if (!rows || rows.length === 0) return '';
  
  const columns = Object.keys(rows[0]);
  let sql = `\n-- Datos de ${tableName}\n`;
  
  rows.forEach(row => {
    const values = columns.map(col => escapeSQLValue(row[col])).join(', ');
    sql += `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES (${values});\n`;
  });
  
  return sql;
}

async function exportData() {
  console.log('🚀 Iniciando exportación de datos...\n');
  
  let sqlOutput = `-- ============================================
-- EXPORTACIÓN DE DATOS - ESTUDIO 56
-- Fecha: ${new Date().toISOString()}
-- ============================================

-- Deshabilitar triggers temporalmente para la importación
SET session_replication_role = 'replica';

`;

  try {
    // 1. Exportar user_plans
    console.log('📦 Exportando user_plans...');
    const { data: plans, error: plansError } = await supabase
      .from('user_plans')
      .select('*')
      .order('created_at');
    
    if (plansError) throw plansError;
    console.log(`   ✅ ${plans?.length || 0} planes encontrados`);
    sqlOutput += generateInserts('user_plans', plans);

    // 2. Exportar users
    console.log('📦 Exportando users...');
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('*')
      .order('created_at');
    
    if (usersError) throw usersError;
    console.log(`   ✅ ${users?.length || 0} usuarios encontrados`);
    sqlOutput += generateInserts('users', users);

    // 3. Exportar brands
    console.log('📦 Exportando brands...');
    const { data: brands, error: brandsError } = await supabase
      .from('brands')
      .select('*')
      .order('created_at');
    
    if (brandsError) {
      console.log(`   ⚠️  Tabla brands no encontrada o vacía`);
    } else {
      console.log(`   ✅ ${brands?.length || 0} marcas encontradas`);
      sqlOutput += generateInserts('brands', brands);
    }

    // 4. Exportar flyer_generations
    console.log('📦 Exportando flyer_generations...');
    const { data: generations, error: generationsError } = await supabase
      .from('flyer_generations')
      .select('*')
      .order('created_at')
      .limit(1000); // Limitar a últimas 1000 generaciones
    
    if (generationsError) {
      console.log(`   ⚠️  Tabla flyer_generations no encontrada o vacía`);
    } else {
      console.log(`   ✅ ${generations?.length || 0} generaciones encontradas`);
      sqlOutput += generateInserts('flyer_generations', generations);
    }

    // 5. Exportar payments
    console.log('📦 Exportando payments...');
    const { data: payments, error: paymentsError } = await supabase
      .from('payments')
      .select('*')
      .order('created_at');
    
    if (paymentsError) {
      console.log(`   ⚠️  Tabla payments no encontrada o vacía`);
    } else {
      console.log(`   ✅ ${payments?.length || 0} pagos encontrados`);
      sqlOutput += generateInserts('payments', payments);
    }

    // 6. Exportar credit_recharges
    console.log('📦 Exportando credit_recharges...');
    const { data: recharges, error: rechargesError } = await supabase
      .from('credit_recharges')
      .select('*')
      .order('created_at');
    
    if (rechargesError) {
      console.log(`   ⚠️  Tabla credit_recharges no encontrada o vacía`);
    } else {
      console.log(`   ✅ ${recharges?.length || 0} recargas encontradas`);
      sqlOutput += generateInserts('credit_recharges', recharges);
    }

    // 7. Exportar credit_equivalences
    console.log('📦 Exportando credit_equivalences...');
    const { data: equivalences, error: equivalencesError } = await supabase
      .from('credit_equivalences')
      .select('*');
    
    if (equivalencesError) {
      console.log(`   ⚠️  Tabla credit_equivalences no encontrada o vacía`);
    } else {
      console.log(`   ✅ ${equivalences?.length || 0} equivalencias encontradas`);
      sqlOutput += generateInserts('credit_equivalences', equivalences);
    }

    // 8. Exportar commercial_events
    console.log('📦 Exportando commercial_events...');
    const { data: events, error: eventsError } = await supabase
      .from('commercial_events')
      .select('*')
      .order('event_date');
    
    if (eventsError) {
      console.log(`   ⚠️  Tabla commercial_events no encontrada o vacía`);
    } else {
      console.log(`   ✅ ${events?.length || 0} eventos encontrados`);
      sqlOutput += generateInserts('commercial_events', events);
    }

    // 9. Exportar subscriptions
    console.log('📦 Exportando subscriptions...');
    const { data: subscriptions, error: subscriptionsError } = await supabase
      .from('subscriptions')
      .select('*')
      .order('created_at');
    
    if (subscriptionsError) {
      console.log(`   ⚠️  Tabla subscriptions no encontrada o vacía`);
    } else {
      console.log(`   ✅ ${subscriptions?.length || 0} suscripciones encontradas`);
      sqlOutput += generateInserts('subscriptions', subscriptions);
    }

    // Habilitar triggers nuevamente
    sqlOutput += `\n-- Habilitar triggers nuevamente
SET session_replication_role = 'origin';

-- Actualizar secuencias (si es necesario)
-- SELECT setval('table_id_seq', (SELECT MAX(id) FROM table));

COMMIT;
`;

    // Guardar archivo
    const outputPath = path.join(__dirname, 'data-export.sql');
    fs.writeFileSync(outputPath, sqlOutput, 'utf8');
    
    console.log('\n✅ Exportación completada exitosamente!');
    console.log(`📄 Archivo generado: ${outputPath}`);
    console.log('\n📋 Siguiente paso:');
    console.log('   1. Ejecuta primero: database/schema.sql en tu Supabase self-hosted');
    console.log('   2. Luego ejecuta: database/data-export.sql');
    
  } catch (error) {
    console.error('\n❌ Error durante la exportación:', error);
    process.exit(1);
  }
}

// Ejecutar exportación
exportData();
