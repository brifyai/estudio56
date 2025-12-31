import { createClient } from '@supabase/supabase-js';

// Configuración de Supabase
const supabaseUrl = 'https://zskunemvffyqyxtfqyzm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpza3VuZW12ZmZ5cXl4dGZxeXptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY5ODI0MjcsImV4cCI6MjA4MjU1ODQyN30.fnBdIUv--_UhIg_843aSAKEHSdVtRCcAKdLGawRGTaw';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testEmailRegistration() {
    console.log('🧪 PRUEBA DE REGISTRO CON EMAIL');
    console.log('=' .repeat(50));
    
    // Generar email único para la prueba
    const timestamp = Date.now();
    const testEmail = `test_${timestamp}@gmail.com`; // Cambiar a gmail.com para que sea válido
    const testPassword = 'test123456';
    const testName = 'Usuario Test';
    const testBusiness = 'Test Business';
    
    console.log(`📧 Email de prueba: ${testEmail}`);
    console.log(`🔐 Contraseña: ${testPassword}`);
    console.log(`👤 Nombre: ${testName}`);
    console.log(`🏢 Empresa: ${testBusiness}`);
    console.log('');
    
    try {
        // 1. Intentar registro
        console.log('1️⃣ INTENTANDO REGISTRO...');
        const { data, error } = await supabase.auth.signUp({
            email: testEmail,
            password: testPassword,
            options: {
                data: {
                    name: testName,
                    business_name: testBusiness
                },
                emailRedirectTo: 'http://localhost:3000/auth/callback'
            }
        });
        
        if (error) {
            console.log('❌ Error en registro:', error.message);
            return;
        }
        
        console.log('✅ Registro exitoso');
        console.log(`   - Usuario ID: ${data.user?.id}`);
        console.log(`   - Email confirmado: ${data.user?.email_confirmed_at ? 'SÍ' : 'NO'}`);
        console.log(`   - Sesión creada: ${data.session ? 'SÍ' : 'NO'}`);
        
        // 2. Verificar si se creó el usuario en la tabla personalizada
        if (data.user) {
            console.log('\n2️⃣ VERIFICANDO TABLA USERS PERSONALIZADA...');
            
            try {
                // Obtener plan GRATIS
                const { data: plan } = await supabase
                    .from('user_plans')
                    .select('*')
                    .eq('name', 'GRATIS')
                    .single();
                
                if (plan) {
                    // Insertar usuario en tabla personalizada
                    const { error: insertError } = await supabase
                        .from('users')
                        .insert({
                            id: data.user.id,
                            email: testEmail,
                            plan_id: plan.id,
                            credits: plan.credits_per_month
                        });
                    
                    if (insertError) {
                        console.log('⚠️ Error insertando en tabla users:', insertError.message);
                    } else {
                        console.log('✅ Usuario insertado en tabla personalizada');
                    }
                }
            } catch (tableError) {
                console.log('⚠️ Error verificando tabla users:', tableError.message);
            }
        }
        
        // 3. Instrucciones para verificar email
        console.log('\n3️⃣ VERIFICACIÓN DE EMAIL:');
        console.log('=' .repeat(30));
        console.log('📧 Revisa el email:', testEmail);
        console.log('📂 Revisa también la carpeta de SPAM');
        console.log('⏰ Espera hasta 5 minutos');
        console.log('🔗 Haz clic en el enlace de confirmación');
        console.log('');
        console.log('📋 PASOS PARA VERIFICAR:');
        console.log('1. Ve a tu email');
        console.log('2. Busca emails de "noreply@supabase.io"');
        console.log('3. Si no está, revisa SPAM/PROMOCIONES');
        console.log('4. Haz clic en "Confirm your signup"');
        console.log('5. Debería redirigir a http://localhost:3000/auth/callback');
        
        // 4. Limpiar usuario de prueba después de 10 minutos
        console.log('\n4️⃣ LIMPIEZA AUTOMÁTICA:');
        console.log('🧹 El usuario de prueba se eliminará automáticamente en 10 minutos');
        
        setTimeout(async () => {
            try {
                await supabase.auth.admin.deleteUser(data.user.id);
                console.log('🧹 Usuario de prueba eliminado');
            } catch (cleanupError) {
                console.log('⚠️ Error eliminando usuario de prueba:', cleanupError.message);
            }
        }, 10 * 60 * 1000); // 10 minutos
        
    } catch (error) {
        console.error('❌ Error general:', error.message);
    }
}

// Ejecutar prueba
testEmailRegistration();