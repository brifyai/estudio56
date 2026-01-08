import { supabase } from './supabaseService';
import { GoogleGenAI } from '@google/genai';

// Helper para obtener cliente de Gemini
const getAiClient = () => new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY
});

export interface Brand {
  id: string;
  user_id: string;
  name: string;
  is_default: boolean;
  website_url: string | null;
  instagram: string | null;
  tiktok: string | null;
  facebook: string | null;
  primary_color: string | null;
  secondary_color: string | null;
  industry: string | null;
  notification_settings: {
    enabled: boolean;
    daysBeforeEvent: number[];
  } | null;
  created_at: string;
  updated_at: string;
}

export interface CreateBrandInput {
  name: string;
  website_url?: string;
  instagram?: string;
  tiktok?: string;
  facebook?: string;
  primary_color?: string;
  secondary_color?: string;
  industry?: string;
  is_default?: boolean;
}

export interface UpdateBrandInput extends Partial<CreateBrandInput> {
  id: string;
}

// Obtener todas las marcas del usuario
export const getUserBrands = async (): Promise<Brand[]> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      console.warn('⚠️ No hay sesión activa');
      return [];
    }

    const { data, error } = await supabase
      .from('brands')
      .select('*')
      .eq('user_id', session.user.id)
      .order('is_default', { ascending: false })
      .order('created_at', { ascending: true });

    if (error) {
      // Si la tabla no existe, devolver array vacío silenciosamente
      if (error.code === 'PGRST205' || error.message.includes('Could not find the table')) {
        console.log('ℹ️ Tabla brands no existe aún, creando marca por defecto...');
        // Crear una marca por defecto para el usuario
        const defaultBrand = await createBrand({
          name: 'Mi Negocio',
          is_default: true
        });
        return defaultBrand ? [defaultBrand] : [];
      }
      console.warn('⚠️ Error obteniendo marcas:', error.message);
      return [];
    }

    // Si no hay marcas, crear una por defecto
    if (!data || data.length === 0) {
      console.log('ℹ️ Usuario sin marcas, creando marca por defecto...');
      const defaultBrand = await createBrand({
        name: 'Mi Negocio',
        is_default: true
      });
      return defaultBrand ? [defaultBrand] : [];
    }

    return data;
  } catch (error) {
    console.error('❌ Excepción obteniendo marcas:', error);
    return [];
  }
};

// Obtener marca por ID
export const getBrandById = async (brandId: string): Promise<Brand | null> => {
  try {
    const { data, error } = await supabase
      .from('brands')
      .select('*')
      .eq('id', brandId)
      .single();

    if (error) {
      console.error('❌ Error obteniendo marca:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('❌ Excepción obteniendo marca:', error);
    return null;
  }
};

// Obtener marca por defecto
export const getDefaultBrand = async (): Promise<Brand | null> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      return null;
    }

    const { data, error } = await supabase
      .from('brands')
      .select('*')
      .eq('user_id', session.user.id)
      .eq('is_default', true)
      .single();

    if (error) {
      // Si no hay marca por defecto, devolver la primera
      const { data: firstData } = await supabase
        .from('brands')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: true })
        .limit(1)
        .single();
      
      return firstData || null;
    }

    return data;
  } catch (error) {
    console.error('❌ Excepción obteniendo marca por defecto:', error);
    return null;
  }
};

// Crear nueva marca
export const createBrand = async (input: CreateBrandInput): Promise<Brand | null> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      console.warn('⚠️ No hay sesión activa');
      return null;
    }

    // Si es la primera marca o is_default=true, quitar default a las demás
    if (input.is_default) {
      await supabase
        .from('brands')
        .update({ is_default: false })
        .eq('user_id', session.user.id);
    }

    const { data, error } = await supabase
      .from('brands')
      .insert({
        user_id: session.user.id,
        name: input.name,
        website_url: input.website_url || null,
        instagram: input.instagram || null,
        tiktok: input.tiktok || null,
        facebook: input.facebook || null,
        primary_color: input.primary_color || '#000000',
        secondary_color: input.secondary_color || '#FFFFFF',
        industry: input.industry || null,
        is_default: input.is_default || false
      })
      .select()
      .single();

    if (error) {
      console.error('❌ Error creando marca:', error);
      return null;
    }

    console.log('✅ Marca creada:', data.name);
    return data;
  } catch (error) {
    console.error('❌ Excepción creando marca:', error);
    return null;
  }
};

// Actualizar marca
export const updateBrand = async (input: UpdateBrandInput): Promise<Brand | null> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      return null;
    }

    const { id, is_default, ...updateData } = input;

    // Si se marca como default, quitar default a las demás
    if (is_default) {
      await supabase
        .from('brands')
        .update({ is_default: false })
        .eq('user_id', session.user.id);
    }

    const { data, error } = await supabase
      .from('brands')
      .update({
        ...updateData,
        is_default,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('user_id', session.user.id)
      .select()
      .single();

    if (error) {
      console.error('❌ Error actualizando marca:', error);
      return null;
    }

    console.log('✅ Marca actualizada:', data.name);
    return data;
  } catch (error) {
    console.error('❌ Excepción actualizando marca:', error);
    return null;
  }
};

// Eliminar marca
export const deleteBrand = async (brandId: string): Promise<boolean> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      return false;
    }

    const { error } = await supabase
      .from('brands')
      .delete()
      .eq('id', brandId)
      .eq('user_id', session.user.id);

    if (error) {
      console.error('❌ Error eliminando marca:', error);
      return false;
    }

    console.log('✅ Marca eliminada:', brandId);
    return true;
  } catch (error) {
    console.error('❌ Excepción eliminando marca:', error);
    return false;
  }
};

// Establecer marca como predeterminada
export const setDefaultBrand = async (brandId: string): Promise<boolean> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      return false;
    }

    // Quitar default a todas
    await supabase
      .from('brands')
      .update({ is_default: false })
      .eq('user_id', session.user.id);

    // Poner default a la seleccionada
    const { error } = await supabase
      .from('brands')
      .update({ is_default: true })
      .eq('id', brandId)
      .eq('user_id', session.user.id);

    if (error) {
      console.error('❌ Error estableciendo marca por defecto:', error);
      return false;
    }

    console.log('✅ Marca por defecto establecida:', brandId);
    return true;
  } catch (error) {
    console.error('❌ Excepción estableciendo marca por defecto:', error);
    return false;
  }
};

// Generar prompt contextual para un evento comercial usando Gemini
export const generateEventPrompt = async (
  brand: Brand,
  eventName: string,
  eventDate: string
): Promise<string> => {
  // Construir contexto base con información de la marca
  const brandInfo = [];
  if (brand.name) brandInfo.push(`Nombre del negocio: ${brand.name}`);
  if (brand.industry) brandInfo.push(`Industria: ${brand.industry}`);
  if (brand.website_url) brandInfo.push(`Sitio web: ${brand.website_url}`);
  
  const socials: string[] = [];
  if (brand.instagram) socials.push(`Instagram: @${brand.instagram}`);
  if (brand.tiktok) socials.push(`TikTok: @${brand.tiktok}`);
  if (brand.facebook) socials.push(`Facebook: ${brand.facebook}`);
  
  const context = [
    ...brandInfo,
    socials.length > 0 ? `Redes sociales: ${socials.join(', ')}` : '',
    `Evento comercial: ${eventName}`,
    `Fecha del evento: ${eventDate}`
  ].filter(Boolean).join('\n');

  try {
    const ai = getAiClient();
    const model = "gemini-3-flash-preview";

    // Timeout de 10 segundos
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Timeout')), 10000);
    });

    const apiPromise = ai.models.generateContent({
      model,
      contents: `Genera un prompt para crear un flyer publicitario en español.

INFORMACIÓN DEL NEGOCIO:
${context}

INSTRUCCIONES:
- Genera un prompt DESCRIPTIVO y VISUAL que describa la ESCENA FOTOGRÁFICA que se debe generar
- NO incluyas texto para el flyer, solo la descripción visual
- Incluye: tipo de establecimiento, productos/servicios, ambiente, iluminación natural
- Sé específico sobre la estética visual (colores, estilo, ambiente)
- El prompt debe ser rico en detalles visuales para la IA generadora de imágenes
- Máximo 150 palabras

Ejemplo de prompt visual:
"Interior de un local de café acogedor con iluminación cálida de tarde, mesas de madera con clientes disfrutando sus bebidas, mostrador con pasteles expuestos, luz natural entrando por ventanas grandes, ambiente relajado de cafetería de barrio en Santiago"

Genera el prompt visual para este negocio y evento:`,
      config: {
        systemInstruction: `Eres un experto en crear prompts visuales para IA generadora de imágenes.
Tu tarea es crear descripciones fotográficas ricas en detalles visuales.
Enfócate en: ambiente, iluminación, composición, colores, textura, ambiente.
NO incluyas texto superpuesto ni elementos gráficos.`
      }
    });

    const response = await Promise.race([apiPromise, timeoutPromise]) as any;
    const generatedPrompt = response.text?.trim();

    if (generatedPrompt && generatedPrompt.length > 20) {
      console.log('✅ Prompt generado con Gemini para evento:', eventName);
      return generatedPrompt;
    }

    throw new Error('Prompt generado muy corto');
    
  } catch (error) {
    console.warn('⚠️ Error con Gemini, usando fallback local:', error);
    
    // Fallback local si Gemini falla
    let prompt = `Flyer para ${brand.name || 'negocio'}`;
    
    if (brand.industry) {
      prompt += ` - ${brand.industry}`;
    }
    
    prompt += ` - ${eventName} (${eventDate})`;
    
    if (brand.website_url) {
      prompt += ` | Visítanos: ${brand.website_url}`;
    }
    
    const socials: string[] = [];
    if (brand.instagram) socials.push(`@${brand.instagram}`);
    if (brand.tiktok) socials.push(`@${brand.tiktok}`);
    
    if (socials.length > 0) {
      prompt += ` | Síguenos: ${socials.join(', ')}`;
    }
    
    return prompt;
  }
};