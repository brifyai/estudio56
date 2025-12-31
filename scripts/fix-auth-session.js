import { createClient } from '@supabase/supabase-js';

// Configuración de Supabase
const supabaseUrl = 'https://zskunemvffyqyxtfqyzm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpza3VuZW12ZmZ5cXl4dGZxeXptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY5ODI0MjcsImV4cCI6MjA4MjU1ODQyN30.fnBdIUv--_UhIg_843aSAKEHSdVtRCcAKdLGawRGTaw';

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixAuthSession() {
    console.log('🔧 SOLUCIONANDO PROBLEMA DE SESIÓN DE AUTENTICACIÓN');
    console.log('=' .repeat(60));
    
    try {
        // 1. Verificar sesión actual
        console.log('\n1️⃣ VERIFICANDO SESIÓN ACTUAL...');
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
            console.log('❌ Error obteniendo sesión:', sessionError.message);
        } else if (session) {
            console.log('✅ Sesión activa encontrada:');
            console.log(`   - Usuario ID: ${session.user.id}`);
            console.log(`   - Email: ${session.user.email}`);
            console.log(`   - Email confirmado: ${session.user.email_confirmed_at ? 'SÍ' : 'NO'}`);
            
            // Verificar si el usuario existe en tabla personalizada
            console.log('\n2️⃣ VERIFICANDO USUARIO EN TABLA PERSONALIZADA...');
            const { data: userData, error: userError } = await supabase
                .from('users')
                .select('*, user_plans(*)')
                .eq('id', session.user.id)
                .single();
                
            if (userError) {
                console.log('❌ Usuario NO existe en tabla personalizada');
                console.log('   - Error:', userError.message);
                console.log('   - Creando usuario...');
                
                // Crear usuario en tabla personalizada
                try {
                    const { data: plan } = await supabase
                        .from('user_plans')
                        .select('*')
                        .eq('name', 'GRATIS')
                        .single();
                    
                    if (plan) {
                        const { error: insertError } = await supabase
                            .from('users')
                            .insert({
                                id: session.user.id,
                                email: session.user.email,
                                plan_id: plan.id,
                                credits: plan.credits_per_month
                            });
                        
                        if (insertError) {
                            console.log('❌ Error creando usuario:', insertError.message);
                        } else {
                            console.log('✅ Usuario creado en tabla personalizada');
                        }
                    }
                } catch (createError) {
                    console.log('❌ Error creando usuario:', createError.message);
                }
            } else {
                console.log('✅ Usuario existe en tabla personalizada:');
                console.log(`   - Plan: ${userData.user_plans?.name}`);
                console.log(`   - Créditos: ${userData.credits}`);
            }
            
        } else {
            console.log('❌ No hay sesión activa');
            console.log('\n💡 INSTRUCCIONES PARA SOLUCIONAR:');
            console.log('1. Ve a: http://localhost:3000/iniciar-sesion');
            console.log('2. Inicia sesión con tus credenciales');
            console.log('3. Verifica que el email esté confirmado');
            console.log('4. Vuelve a ejecutar este script para verificar');
        }

        // 2. Limpiar sesión si es necesario
        console.log('\n3️⃣ LIMPIANDO SESIÓN (SI ES NECESARIO)...');
        const { error: signOutError } = await supabase.auth.signOut();
        if (signOutError) {
            console.log('⚠️ Error cerrando sesión:', signOutError.message);
        } else {
            console.log('✅ Sesión cerrada correctamente');
        }

        // 3. Verificar que la limpieza funcionó
        console.log('\n4️⃣ VERIFICANDO LIMPIEZA...');
        const { data: { session: newSession } } = await supabase.auth.getSession();
        if (newSession) {
            console.log('⚠️ Aún hay sesión activa');
        } else {
            console.log('✅ Sesión limpiada correctamente');
        }

        // 4. Resumen final
        console.log('\n' + '=' .repeat(60));
        console.log('📋 RESUMEN Y PRÓXIMOS PASOS:');
        console.log('=' .repeat(60));
        
        if (session) {
            console.log('\n✅ SESIÓN ENCONTRADA Y PROCESADA');
            console.log('🔄 Para probar el dashboard:');
            console.log('1. Ve a: http://localhost:3000/panel');
            console.log('2. Debería cargar sin redirigir al login');
        } else {
            console.log('\n❌ NO HAY SESIÓN ACTIVA');
            console.log('🔑 Para acceder al dashboard:');
            console.log('1. Ve a: http://localhost:3000/iniciar-sesion');
            console.log('2. Inicia sesión con: camiloalegriabarra@gmail.com');
            console.log('3. Contraseña: Antonito26$');
            console.log('4. Verifica confirmación de email');
            console.log('5. Ve a: http://localhost:3000/panel');
        }

        console.log('\n🧪 COMANDOS ÚTILES:');
        console.log('- Verificar estado: node scripts/diagnose-dashboard-issue.js');
        console.log('- Limpiar sesión: node scripts/fix-auth-session.js');
        console.log('- Probar registro: node scripts/test-email-registration.js');

    } catch (error) {
        console.error('❌ Error en solución de sesión:', error);
    }
}

// Ejecutar solución
fixAuthSession();