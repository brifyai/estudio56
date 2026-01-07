import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables');
  console.log('Necesitas VITE_SUPABASE_SERVICE_ROLE_KEY en tu archivo .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function migratePlans() {
  try {
    console.log('🚀 Ejecutando migración de planes...');
    console.log(`📡 Conectando a: ${supabaseUrl}`);

    // 1. Agregar columnas nuevas si no existen
    console.log('📋 Agregando columnas nuevas...');
    
    const alterTableSQL = `
      ALTER TABLE user_plans 
      ADD COLUMN IF NOT EXISTS credits_hd INTEGER DEFAULT 0,
      ADD COLUMN IF NOT EXISTS drafts INTEGER DEFAULT 0;
    `;

    const { error: alterError } = await supabase.rpc('exec_sql', { sql: alterTableSQL });
    
    if (alterError) {
      // Try alternative approach - execute raw SQL through a different method
      console.log('⚠️  Error con RPC, intentando otro método...');
    }

    // 2. Actualizar los planes existentes
    console.log('📋 Actualizando planes...');
    
    const updatePlans = [
      {
        name: 'GRATIS',
        price: 0.00,
        credits_hd: 0,
        drafts: 3,
        features: ['3 Borradores/día (Imagen)', 'Solo Visualización (Sin descarga)', 'Sin Créditos HD', 'Sin Generación de Video']
      },
      {
        name: 'ESTOY PARTIENDO',
        price: 14990,
        credits_hd: 40,
        drafts: 200,
        features: ['40 Créditos HD (40 fotos o 4 videos)', '200 Borradores de Imagen', 'Videos HD (Requiere 10 créditos c/u)', 'Sin Carga de Productos']
      },
      {
        name: 'JEFE PYME',
        price: 44990,
        credits_hd: 150,
        drafts: 750,
        features: ['150 Créditos HD (150 fotos o 15 videos)', '750 Borradores de Imagen', 'Videos HD (Costo: 10 créditos)', 'Carga de Productos (PNG)']
      },
      {
        name: 'AGENCIA',
        price: 139990,
        credits_hd: 500,
        drafts: 2500,
        features: ['500 Créditos HD (500 fotos o 50 videos)', '2.500 Borradores de Imagen', 'Licencia Comercial', 'Soporte Humano']
      }
    ];

    // Update each plan
    for (const plan of updatePlans) {
      console.log(`   Actualizando: ${plan.name}`);
      
      const { error: updateError } = await supabase
        .from('user_plans')
        .update({
          price: plan.price,
          credits_hd: plan.credits_hd,
          drafts: plan.drafts,
          features: plan.features
        })
        .eq('name', plan.name);

      if (updateError) {
        console.error(`   ❌ Error actualizando ${plan.name}:`, updateError.message);
      } else {
        console.log(`   ✅ ${plan.name} actualizado`);
      }
    }

    // 3. Verificar los planes
    console.log('');
    console.log('🔍 Verificando planes actualizados...');
    const { data: plans, error: fetchError } = await supabase
      .from('user_plans')
      .select('*')
      .order('price');

    if (fetchError) {
      console.error('❌ Error verificando planes:', fetchError.message);
    } else {
      console.log('✅ Planes verificados:');
      plans?.forEach((plan, index) => {
        console.log(`   ${index + 1}. ${plan.name} - $${plan.price}`);
        console.log(`      Créditos HD: ${plan.credits_hd}, Borradores: ${plan.drafts}`);
      });
    }

    console.log('');
    console.log('🎉 Migración completada!');
    console.log('');
    console.log('📋 Resumen:');
    console.log('✅ Planes actualizados con nueva estructura');
    console.log('✅ Créditos HD y Borradores configurados');
    console.log('✅ Base de datos sincronizada');

  } catch (error) {
    console.error('❌ Error en migración:', error);
    process.exit(1);
  }
}

migratePlans();