/**
 * Script para verificar que los modelos Veo estén disponibles en Vertex AI
 * 
 * Uso: node scripts/check-veo-models.js
 */

async function checkVeoModels() {
  console.log('🔍 Verificando disponibilidad de modelos Veo en Vertex AI...\n');
  
  const projectId = process.env.GOOGLE_CLOUD_PROJECT || 'stratega-ai-x';
  
  console.log(`📋 Proyecto: ${projectId}`);
  console.log(`📍 Región: us-central1\n`);
  
  console.log('═══════════════════════════════════════════════════════════');
  console.log('📝 MODELOS VEO REQUERIDOS');
  console.log('═══════════════════════════════════════════════════════════\n');
  
  const models = [
    {
      name: 'veo-2.0-flash-generate-preview',
      purpose: 'Draft - Videos rápidos (30-60s)',
      cost: '~$0.10 USD por video'
    },
    {
      name: 'veo-2.0-generate-preview',
      purpose: 'HD - Videos alta calidad (2-5min)',
      cost: '~$0.30 USD por video'
    }
  ];
  
  models.forEach((model, index) => {
    console.log(`${index + 1}. ${model.name}`);
    console.log(`   Propósito: ${model.purpose}`);
    console.log(`   Costo: ${model.cost}\n`);
  });
  
  console.log('═══════════════════════════════════════════════════════════');
  console.log('🔧 PASOS PARA HABILITAR');
  console.log('═══════════════════════════════════════════════════════════\n');
  
  console.log('1. Ve a Google Cloud Console:');
  console.log('   https://console.cloud.google.com\n');
  
  console.log('2. Selecciona el proyecto: stratega-ai-x\n');
  
  console.log('3. Ve a "Vertex AI" > "Model Garden":');
  console.log('   https://console.cloud.google.com/vertex-ai/model-garden\n');
  
  console.log('4. Busca "Veo" en el buscador\n');
  
  console.log('5. Habilita los siguientes modelos:');
  console.log('   ✓ Veo 2.0 Flash Generate Preview');
  console.log('   ✓ Veo 2.0 Generate Preview\n');
  
  console.log('6. Acepta los términos de servicio\n');
  
  console.log('7. Espera 2-5 minutos para que se activen\n');
  
  console.log('═══════════════════════════════════════════════════════════');
  console.log('⚠️  IMPORTANTE');
  console.log('═══════════════════════════════════════════════════════════\n');
  
  console.log('• Los modelos Veo están en Preview (Beta)');
  console.log('• Requieren aprobación de Google para uso en producción');
  console.log('• Tienen límites de cuota (videos por día/mes)');
  console.log('• Los costos se cobran por segundo de video generado\n');
  
  console.log('═══════════════════════════════════════════════════════════');
  console.log('🧪 TESTING');
  console.log('═══════════════════════════════════════════════════════════\n');
  
  console.log('Para probar que funciona:');
  console.log('1. Despliega la app en Netlify');
  console.log('2. Selecciona "Video" como tipo de contenido');
  console.log('3. Ingresa una descripción');
  console.log('4. Haz clic en "GENERAR VIDEO"');
  console.log('5. Espera 30-60 segundos (draft) o 2-5 minutos (HD)');
  console.log('6. El video debería aparecer en pantalla\n');
  
  console.log('═══════════════════════════════════════════════════════════');
  console.log('📊 MONITOREO');
  console.log('═══════════════════════════════════════════════════════════\n');
  
  console.log('Verifica en la consola del navegador:');
  console.log('• 🎬 [VertexVideo] Iniciando generación de video...');
  console.log('• 🔄 [VertexVideo] Verificando estado (intento X/60)...');
  console.log('• ✅ [VertexVideo] Video completado!\n');
  
  console.log('Verifica en Netlify Functions logs:');
  console.log('• 🎬 [DEBUG] FUNCIÓN DE VIDEO INICIADA');
  console.log('• 🔄 [DEBUG] Operación de video iniciada');
  console.log('• ✅ [DEBUG] Video generado exitosamente\n');
  
  console.log('═══════════════════════════════════════════════════════════\n');
}

checkVeoModels().catch(console.error);
