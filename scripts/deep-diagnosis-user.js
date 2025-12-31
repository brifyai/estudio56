import { createClient } from '@supabase/supabase-js';

// Configuración de Supabase
const supabaseUrl = 'https://zskunemvffyqyxtfqyzm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpza3VuZW12ZmZ5cXl4dGZxeXptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY5ODI0MjcsImV4cCI6MjA4MjU1ODQyN30.fnBdIUv--_UhIg_843aSAKEHSdVtRCcAKdLGawRGTaw';

const supabase = createClient(supabaseUrl, supabaseKey);

async function deepDiagnosisUser() {
    console.log('🔍 DIAGNÓSTICO PROFUNDO DEL USUARIO');
    console.log('=' .repeat(60));
    
    const userEmail = 'camiloalegriabarra@gmail.com';
    
    try {
        // 1. Verificar planes disponibles primero
        console.log('\n1️⃣ VERIFICANDO PLANES DISPONIBLES...');
        const { data: plans, error: plansError } = await supabase
            .from('user_plans')
            .select('*');
            
        if (plansError) {
            console.log('❌ Error consultando planes:', plansError.message);
            return;
        } else {
            console.log(`✅ Planes disponibles: ${plans.length}`);
            plans.forEach((plan, index) => {
                console.log(`${index + 1}. ${plan.name} - $${plan.price}/mes - ${plan.credits_per_month} créditos`);
            });
        }

        // 2. Intentar login directo para verificar credenciales
        console.log('\n2️⃣ PROBANDO LOGIN DIRECTO...');
        try {
            const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
                email: userEmail,
                password: 'Antonito26$'
            });
            
            if (loginError) {
                console.log('❌ Error en login directo:', loginError.message);
                console.log('   - Esto indica que las credenciales son incorrectas');
                console.log('   - O que el usuario no existe');
                
                // Intentar crear el usuario
                console.log('\n3️⃣ INTENTANDO CREAR USUARIO...');
                try {
                    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
                        email: userEmail,
                        password: 'Antonito26$',
                        options: {
                            data: {
                                name: 'Camilo',
                                business_name: 'Estudio 56'
                            }
                        }
                    });
                    
                    if (signUpError) {
                        console.log('❌ Error creando usuario:', signUpError.message);
                    } else if (signUpData.user) {
                        console.log('✅ Usuario creado exitosamente:');
                        console.log(`   - ID: ${signUpData.user.id}`);
                        console.log(`   - Email: ${signUpData.user.email}`);
                        console.log(`   - Confirmado: ${signUpData.user.email_confirmed_at ? 'SÍ' : 'NO'}`);
                        
                        // Crear usuario en tabla personalizada
                        try {
                            const plan = plans.find(p => p.name === 'AGENCIA') || plans.find(p => p.name === 'GRATIS');
                            
                            if (plan) {
                                const { error: insertError } = await supabase
                                    .from('users')
                                    .insert({
                                        id: signUpData.user.id,
                                        email: userEmail,
                                        plan_id: plan.id,
                                        credits: plan.credits_per_month
                                    });
                                
                                if (insertError) {
                                    console.log('❌ Error creando usuario en tabla personalizada:', insertError.message);
                                } else {
                                    console.log('✅ Usuario creado en tabla personalizada');
                                    console.log(`   - Plan: ${plan.name}`);
                                    console.log(`   - Créditos: ${plan.credits_per_month}`);
                                }
                            }
                        } catch (tableCreateError) {
                            console.log('❌ Error creando en tabla personalizada:', tableCreateError.message);
                        }
                    }
                } catch (signUpException) {
                    console.log('❌ Excepción creando usuario:', signUpException.message);
                }
                
            } else if (loginData.user) {
                console.log('✅ Login directo exitoso:');
                console.log(`   - Usuario ID: ${loginData.user.id}`);
                console.log(`   - Email confirmado: ${loginData.user.email_confirmed_at ? 'SÍ' : 'NO'}`);
                console.log(`   - Sesión creada: ${loginData.session ? 'SÍ' : 'NO'}`);
                
                // Verificar si puede cargar datos después del login
                try {
                    const { data: user } = await supabase
                        .from('users')
                        .select('*, user_plans(*)')
                        .eq('id', loginData.user.id)
                        .single();
                    
                    if (user) {
                        console.log('   ✅ Datos de usuario cargados después del login');
                        console.log(`   - Plan: ${user.user_plans?.name}`);
                        console.log(`   - Créditos: ${user.credits}`);
                    } else {
                        console.log('   ❌ No se pudieron cargar datos de usuario');
                        console.log('   - Creando usuario en tabla personalizada...');
                        
                        const plan = plans.find(p => p.name === 'AGENCIA') || plans.find(p => p.name === 'GRATIS');
                        
                        if (plan) {
                            const { error: insertError } = await supabase
                                .from('users')
                                .insert({
                                    id: loginData.user.id,
                                    email: userEmail,
                                    plan_id: plan.id,
                                    credits: plan.credits_per_month
                                });
                            
                            if (insertError) {
                                console.log('   ❌ Error creando usuario en tabla personalizada:', insertError.message);
                            } else {
                                console.log('   ✅ Usuario creado en tabla personalizada');
                                console.log(`   - Plan: ${plan.name}`);
                            }
                        }
                    }
                } catch (userLoadError) {
                    console.log('   ❌ Error cargando datos de usuario:', userLoadError.message);
                }
            }
        } catch (loginException) {
            console.log('❌ Excepción en login directo:', loginException.message);
        }

        // 3. Verificar logs de autenticación
        console.log('\n4️⃣ VERIFICANDO LOGS DE AUTENTICACIÓN...');
        console.log('ℹ️  Para ver logs detallados:');
        console.log('   - Ve a: https://supabase.com/dashboard/project/zskunemvffyqyxtfqyzm/auth/logs');
        console.log('   - Busca eventos relacionados con:', userEmail);

        // 4. Resumen y acciones
        console.log('\n' + '=' .repeat(60));
        console.log('📋 RESUMEN Y ACCIONES RECOMENDADAS:');
        console.log('=' .repeat(60));
        
        console.log('\n🔄 INSTRUCCIONES PARA ACCEDER:');
        console.log('1. Ve a: http://localhost:3000/iniciar-sesion');
        console.log('2. Email: camiloalegriabarra@gmail.com');
        console.log('3. Contraseña: Antonito26$');
        console.log('4. Si el login es exitoso, ve a: http://localhost:3000/panel');
        
        console.log('\n🧪 COMANDOS ADICIONALES:');
        console.log('- Verificar estado: node scripts/deep-diagnosis-user.js');
        console.log('- Limpiar sesión: node scripts/fix-auth-session.js');
        
        console.log('\n🚨 SI SIGUE SIN FUNCIONAR:');
        console.log('1. Abre consola del navegador (F12)');
        console.log('2. Ve a http://localhost:3000/panel');
        console.log('3. Revisa los errores en la consola');
        console.log('4. Reporta los errores específicos');

    } catch (error) {
        console.error('❌ Error en diagnóstico profundo:', error);
    }
}

// Ejecutar diagnóstico
deepDiagnosisUser();