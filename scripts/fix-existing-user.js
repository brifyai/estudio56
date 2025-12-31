import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.REACT_APP_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixExistingUser() {
  try {
    console.log('🔧 SOLUCIONANDO USUARIO EXISTENTE');
    console.log('==================================');
    console.log(`📡 Conectando a: ${supabaseUrl}`);
    console.log('');

    // First, try to sign in to get the user ID
    console.log('🔐 Autenticando usuario...');
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: 'camiloalegriabarra@gmail.com',
      password: 'Antonito26$'
    });

    if (signInError) {
      console.error('❌ Error de autenticación:', signInError.message);
      return;
    }

    if (!signInData.user) {
      console.error('❌ No se pudo obtener información del usuario');
      return;
    }

    console.log('✅ Usuario autenticado exitosamente');
    console.log(`👤 ID del usuario: ${signInData.user.id}`);
    console.log(`📧 Email: ${signInData.user.email}`);
    console.log('');

    // Get the "GRATIS" plan ID
    console.log('📋 Obteniendo plan "GRATIS"...');
    const { data: plans, error: plansError } = await supabase
      .from('user_plans')
      .select('*')
      .eq('name', 'GRATIS');

    if (plansError) {
      console.error('❌ Error obteniendo planes:', plansError.message);
      return;
    }

    if (!plans || plans.length === 0) {
      console.error('❌ No se encontró el plan "GRATIS"');
      return;
    }

    const gratisPlan = plans[0];
    console.log(`✅ Plan "GRATIS" encontrado: ${gratisPlan.id}`);
    console.log(`💰 Créditos: ${gratisPlan.credits_per_month}`);
    console.log('');

    // Check if user already exists in the users table
    console.log('🔍 Verificando si el usuario ya existe en la tabla users...');
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('*')
      .eq('id', signInData.user.id)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('❌ Error verificando usuario:', checkError.message);
      return;
    }

    if (existingUser) {
      console.log('✅ El usuario ya existe en la tabla users');
      console.log(`📊 Plan ID: ${existingUser.plan_id}`);
      console.log(`💰 Créditos: ${existingUser.credits}`);
      console.log('');
      console.log('🎉 ¡El usuario ya está configurado correctamente!');
      return;
    }

    // Insert user into the users table
    console.log('📝 Insertando usuario en la tabla users...');
    const { data: insertedUser, error: insertError } = await supabase
      .from('users')
      .insert({
        id: signInData.user.id,
        email: signInData.user.email,
        plan_id: gratisPlan.id,
        credits: gratisPlan.credits_per_month
      })
      .select()
      .single();

    if (insertError) {
      console.error('❌ Error insertando usuario:', insertError.message);
      console.log('🔍 Código de error:', insertError.code);
      return;
    }

    console.log('✅ Usuario insertado exitosamente!');
    console.log(`📊 Plan asignado: ${gratisPlan.name}`);
    console.log(`💰 Créditos asignados: ${insertedUser.credits}`);
    console.log('');

    console.log('🎯 PRÓXIMOS PASOS:');
    console.log('==================');
    console.log('1. Ve a http://localhost:3000/iniciar-sesion');
    console.log('2. Ingresa tus credenciales:');
    console.log('   📧 Email: camiloalegriabarra@gmail.com');
    console.log('   🔑 Contraseña: Antonito26$');
    console.log('3. Deberías poder acceder al panel sin problemas');
    console.log('');

    console.log('✨ ¡Problema solucionado!');

  } catch (error) {
    console.error('❌ Error general:', error.message);
  }
}

fixExistingUser();
