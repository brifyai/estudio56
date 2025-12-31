import { createClient } from '@supabase/supabase-js';

// Configuración de Supabase
const supabaseUrl = 'https://zskunemvffyqyxtfqyzm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpza3VuZW12ZmZ5cXl4dGZxeXptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY5ODI0MjcsImV4cCI6MjA4MjU1ODQyN30.fnBdIUv--_UhIg_843aSAKEHSdVtRCcAKdLGawRGTaw';

const supabase = createClient(supabaseUrl, supabaseKey);

async function diagnoseDashboardIssue() {
    console.log('🔍 DIAGNÓSTICO DEL PROBLEMA "ENTRA Y SALE INMEDIATAMENTE"');
    console.log('=' .repeat(70));
    
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
            console.log(`   - Creado: ${new Date(session.user.created_at).toLocaleString()}`);
            console.log(`   - Última actualización: ${new Date(session.user.updated_at).toLocaleString()}`);
            console.log(`   - Email confirmado: ${session.user.email_confirmed_at ? 'SÍ' : 'NO'}`);
        } else {
            console.log('❌ No hay sesión activa');
        }

        // 2. Verificar usuario en tabla personalizada
        if (session?.user) {
            console.log('\n2️⃣ VERIFICANDO USUARIO EN TABLA PERSONALIZADA...');
            const { data: userData, error: userError } = await supabase
                .from('users')
                .select('*, user_plans(*)')
                .eq('id', session.user.id)
                .single();
                
            if (userError) {
                console.log('❌ Error consultando usuario:', userError.message);
                console.log('   Esto puede causar que el Dashboard falle al cargar');
            } else {
                console.log('✅ Usuario encontrado en tabla personalizada:');
                console.log(`   - Email: ${userData.email}`);
                console.log(`   - Plan: ${userData.user_plans?.name || 'NO ENCONTRADO'}`);
                console.log(`   - Créditos: ${userData.credits}`);
            }
        }

        // 3. Verificar planes disponibles
        console.log('\n3️⃣ VERIFICANDO PLANES DISPONIBLES...');
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

        // 4. Simular verificación de autenticación del Dashboard
        console.log('\n4️⃣ SIMULANDO VERIFICACIÓN DE AUTENTICACIÓN DEL DASHBOARD...');
        try {
            const { data: { session: currentSession } } = await supabase.auth.getSession();
            
            if (currentSession?.user) {
                console.log('✅ Dashboard permitiría acceso');
                console.log('   - Usuario autenticado:', currentSession.user.email);
                
                // Verificar si puede cargar datos del usuario
                try {
                    const { data: user } = await supabase
                        .from('users')
                        .select('*, user_plans(*)')
                        .eq('id', currentSession.user.id)
                        .single();
                    
                    if (user) {
                        console.log('   - Datos de usuario cargados correctamente');
                        console.log('   - Plan:', user.user_plans?.name);
                    } else {
                        console.log('   ⚠️ Usuario no encontrado en tabla personalizada');
                    }
                } catch (userLoadError) {
                    console.log('   ❌ Error cargando datos de usuario:', userLoadError.message);
                }
            } else {
                console.log('❌ Dashboard redirigiría al login');
                console.log('   - Razón: No hay sesión activa');
            }
        } catch (authCheckError) {
            console.log('❌ Error en verificación de autenticación:', authCheckError.message);
        }

        // 5. Identificar posibles problemas
        console.log('\n' + '=' .repeat(70));
        console.log('🚨 POSIBLES CAUSAS DEL PROBLEMA "ENTRA Y SALE":');
        console.log('=' .repeat(70));
        
        if (!session) {
            console.log('\n❌ CAUSA PRINCIPAL: No hay sesión activa');
            console.log('   - El usuario no está autenticado');
            console.log('   - La sesión puede haber expirado');
            console.log('   - Puede haber un problema con el login');
        } else if (session && !session.user.email_confirmed_at) {
            console.log('\n⚠️ CAUSA: Email no confirmado');
            console.log('   - El usuario existe pero el email no está confirmado');
            console.log('   - Supabase puede estar bloqueando el acceso');
        } else {
            console.log('\n⚠️ CAUSA: Problema con datos de usuario');
            console.log('   - El usuario está autenticado');
            console.log('   - Pero puede haber un problema con la tabla users');
        }

        // 6. Soluciones recomendadas
        console.log('\n💡 SOLUCIONES RECOMENDADAS:');
        console.log('=' .repeat(40));
        
        console.log('\n🔧 OPCIÓN 1: Verificar y corregir sesión');
        console.log('1. Ir a: http://localhost:3000/iniciar-sesion');
        console.log('2. Hacer logout y login nuevamente');
        console.log('3. Verificar que el email esté confirmado');
        
        console.log('\n🔧 OPCIÓN 2: Verificar datos de usuario');
        console.log('1. Revisar si el usuario existe en tabla users');
        console.log('2. Si no existe, crearlo manualmente');
        
        console.log('\n🔧 OPCIÓN 3: Debugging temporal');
        console.log('1. Abrir consola del navegador (F12)');
        console.log('2. Ir a /panel y ver los logs');
        console.log('3. Buscar errores de autenticación');

    } catch (error) {
        console.error('❌ Error en diagnóstico:', error);
    }
}

// Ejecutar diagnóstico
diagnoseDashboardIssue();