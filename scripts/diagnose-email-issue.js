import { createClient } from '@supabase/supabase-js';

// Configuración de Supabase
const supabaseUrl = 'https://zskunemvffyqyxtfqyzm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpza3VuZW12ZmZ5cXl4dGZxeXptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY5ODI0MjcsImV4cCI6MjA4MjU1ODQyN30.fnBdIUv--_UhIg_843aSAKEHSdVtRCcAKdLGawRGTaw';

const supabase = createClient(supabaseUrl, supabaseKey);

async function diagnoseEmailIssue() {
    console.log('🔍 DIAGNÓSTICO DE PROBLEMA DE EMAILS DE CONFIRMACIÓN');
    console.log('=' .repeat(60));
    
    try {
        // 1. Verificar conexión básica
        console.log('\n1️⃣ VERIFICANDO CONEXIÓN A SUPABASE...');
        const { data, error } = await supabase.from('user_plans').select('count').limit(1);
        if (error) {
            console.log('❌ Error conectando a Supabase:', error.message);
            return;
        } else {
            console.log('✅ Conexión a Supabase exitosa');
        }

        // 2. Verificar tabla users personalizada
        console.log('\n2️⃣ VERIFICANDO TABLA USERS PERSONALIZADA...');
        const { data: customUsers, error: customError } = await supabase
            .from('users')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(5);
            
        if (customError) {
            console.log('❌ Error consultando tabla users:', customError.message);
        } else {
            console.log(`✅ Usuarios en tabla personalizada: ${customUsers.length}`);
            customUsers.forEach((user, index) => {
                console.log(`${index + 1}. ${user.email}`);
                console.log(`   - Plan: ${user.plan_id || user.plan}`);
                console.log(`   - Créditos: ${user.credits}`);
                console.log('');
            });
        }

        // 3. Verificar planes disponibles
        console.log('3️⃣ VERIFICANDO PLANES DISPONIBLES...');
        const { data: plans, error: plansError } = await supabase
            .from('user_plans')
            .select('*');
            
        if (plansError) {
            console.log('❌ Error consultando planes:', plansError.message);
        } else {
            console.log(`✅ Planes disponibles: ${plans.length}`);
            plans.forEach((plan, index) => {
                console.log(`${index + 1}. ${plan.name} - $${plan.price}/mes - ${plan.credits_per_month} créditos`);
            });
        }

        // 4. Verificar configuración de Auth (manual)
        console.log('\n4️⃣ VERIFICACIÓN MANUAL DE CONFIGURACIÓN...');
        console.log('⚠️  Para verificar la configuración de emails necesitas ir manualmente a:');
        console.log('   https://supabase.com/dashboard/project/zskunemvffyqyxtfqyzm/auth/settings');
        
        // 5. Resumen y recomendaciones
        console.log('\n' + '=' .repeat(60));
        console.log('📋 RESUMEN Y RECOMENDACIONES:');
        console.log('=' .repeat(60));
        
        console.log('\n🔧 CONFIGURACIÓN NECESARIA EN SUPABASE:');
        console.log('1. Ve a: https://supabase.com/dashboard/project/zskunemvffyqyxtfqyzm/auth/settings');
        console.log('2. En la sección "Email" configura:');
        console.log('   - Site URL: http://localhost:3000');
        console.log('   - Redirect URLs: http://localhost:3000/**');
        console.log('   - Enable email confirmations: ✅ ACTIVADO');
        console.log('   - Auto confirm users: ❌ DESACTIVADO');
        
        console.log('\n📧 VERIFICACIÓN DE EMAILS:');
        console.log('1. Revisa la carpeta de SPAM/CORREO NO DESEADO');
        console.log('2. Verifica que el email esté bien escrito');
        console.log('3. Espera unos minutos (puede tardar hasta 5 minutos)');
        console.log('4. Revisa logs en: Dashboard > Authentication > Logs');
        
        console.log('\n🧪 PRUEBA DE REGISTRO:');
        console.log('1. Ve a: http://localhost:3000/registrarse');
        console.log('2. Registra un usuario de prueba');
        console.log('3. Revisa el email (incluyendo spam)');
        console.log('4. Si no llega, revisa los logs en Supabase');

        console.log('\n💡 POSIBLES CAUSAS DEL PROBLEMA:');
        console.log('1. ❌ Site URL no configurado correctamente');
        console.log('2. ❌ Redirect URLs no configuradas');
        console.log('3. ❌ Email confirmations deshabilitado');
        console.log('4. ❌ Auto confirm habilitado (confirma sin email)');
        console.log('5. ❌ Problemas con el proveedor de email de Supabase');
        console.log('6. ❌ Email en carpeta de spam');

    } catch (error) {
        console.error('❌ Error en diagnóstico:', error);
    }
}

// Ejecutar diagnóstico
diagnoseEmailIssue();