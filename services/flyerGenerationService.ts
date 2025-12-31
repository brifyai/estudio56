import { supabase } from './supabaseService';
import { FlyerStyleKey, AspectRatio } from '../types';
import { uploadImageToStorage } from './imageStorageService';

export interface FlyerGeneration {
  id: string;
  user_id: string;
  draft_image_url: string;
  hd_image_url?: string;
  prompt: string;
  style_key: FlyerStyleKey;
  aspect_ratio: AspectRatio;
  seed: number;
  status: 'draft' | 'hd' | 'failed';
  created_at: string;
  updated_at: string;
}

export interface CreateGenerationParams {
  userId: string;
  draftImageUrl: string; // Puede ser data URL o URL de Storage
  prompt: string;
  styleKey: FlyerStyleKey;
  aspectRatio: AspectRatio;
  seed: number;
}

/**
 * Crear una nueva generación de flyer
 */
export const createGeneration = async (params: CreateGenerationParams): Promise<FlyerGeneration | null> => {
  try {
    // Primero crear el registro para obtener el ID
    const { data: generationData, error: insertError } = await supabase
      .from('flyer_generations')
      .insert({
        user_id: params.userId,
        draft_image_url: params.draftImageUrl, // Temporalmente guardar data URL
        prompt: params.prompt,
        style_key: params.styleKey,
        aspect_ratio: params.aspectRatio,
        seed: params.seed,
        status: 'draft'
      })
      .select()
      .single();

    if (insertError) {
      console.error('❌ Error creando generación:', insertError);
      return null;
    }

    // Si es un data URL, subir a Storage y actualizar
    if (params.draftImageUrl.startsWith('data:')) {
      console.log('📤 Subiendo borrador a Storage...');
      const storageUrl = await uploadImageToStorage(
        params.draftImageUrl,
        params.userId,
        generationData.id,
        'draft'
      );
      
      if (storageUrl) {
        // Actualizar con la URL de Storage
        await supabase
          .from('flyer_generations')
          .update({ draft_image_url: storageUrl })
          .eq('id', generationData.id);
        
        generationData.draft_image_url = storageUrl;
      }
    }

    console.log('✅ Generación creada con ID:', generationData.id);
    return generationData as FlyerGeneration;
  } catch (error) {
    console.error('❌ Excepción creando generación:', error);
    return null;
  }
};

/**
 * Actualizar generación a HD
 */
export const updateGenerationToHD = async (
  generationId: string,
  hdImageUrl: string,
  userId: string
): Promise<boolean> => {
  try {
    let finalHdUrl = hdImageUrl;
    
    // Si es un data URL, subir a Storage
    if (hdImageUrl.startsWith('data:')) {
      console.log('📤 Subiendo imagen HD a Storage...');
      const storageUrl = await uploadImageToStorage(
        hdImageUrl,
        userId,
        generationId,
        'hd'
      );
      
      if (storageUrl) {
        finalHdUrl = storageUrl;
      }
    }

    const { error } = await supabase
      .from('flyer_generations')
      .update({
        hd_image_url: finalHdUrl,
        status: 'hd',
        updated_at: new Date().toISOString()
      })
      .eq('id', generationId);

    if (error) {
      console.error('❌ Error actualizando a HD:', error);
      return false;
    }

    console.log('✅ Generación HD actualizada:', generationId);
    return true;
  } catch (error) {
    console.error('❌ Excepción actualizando a HD:', error);
    return false;
  }
};

/**
 * Obtener generación por ID
 */
export const getGenerationById = async (generationId: string): Promise<FlyerGeneration | null> => {
  try {
    const { data, error } = await supabase
      .from('flyer_generations')
      .select('*')
      .eq('id', generationId)
      .single();

    if (error) {
      console.error('❌ Error obteniendo generación:', error);
      return null;
    }

    return data as FlyerGeneration;
  } catch (error) {
    console.error('❌ Excepción obteniendo generación:', error);
    return null;
  }
};

/**
 * Obtener todas las generaciones de un usuario
 */
export const getUserGenerations = async (userId: string): Promise<FlyerGeneration[]> => {
  try {
    const { data, error } = await supabase
      .from('flyer_generations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Error obteniendo generaciones:', error);
      return [];
    }

    return (data as FlyerGeneration[]) || [];
  } catch (error) {
    console.error('❌ Excepción obteniendo generaciones:', error);
    return [];
  }
};

/**
 * Obtener generaciones draft de un usuario
 */
export const getUserDraftGenerations = async (userId: string): Promise<FlyerGeneration[]> => {
  try {
    const { data, error } = await supabase
      .from('flyer_generations')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'draft')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Error obteniendo borradores:', error);
      return [];
    }

    return (data as FlyerGeneration[]) || [];
  } catch (error) {
    console.error('❌ Excepción obteniendo borradores:', error);
    return [];
  }
};

/**
 * Obtener generaciones HD de un usuario
 */
export const getUserHDGenerations = async (userId: string): Promise<FlyerGeneration[]> => {
  try {
    const { data, error } = await supabase
      .from('flyer_generations')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'hd')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Error obteniendo generaciones HD:', error);
      return [];
    }

    return (data as FlyerGeneration[]) || [];
  } catch (error) {
    console.error('❌ Excepción obteniendo generaciones HD:', error);
    return [];
  }
};

/**
 * Eliminar una generación
 */
export const deleteGeneration = async (generationId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('flyer_generations')
      .delete()
      .eq('id', generationId);

    if (error) {
      console.error('❌ Error eliminando generación:', error);
      return false;
    }

    console.log('✅ Generación eliminada:', generationId);
    return true;
  } catch (error) {
    console.error('❌ Excepción eliminando generación:', error);
    return false;
  }
};

/**
 * Obtener última generación draft de un usuario (para continuar HD)
 */
export const getLatestDraftGeneration = async (userId: string): Promise<FlyerGeneration | null> => {
  try {
    const { data, error } = await supabase
      .from('flyer_generations')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'draft')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      console.error('❌ Error obteniendo último borrador:', error);
      return null;
    }

    return data as FlyerGeneration;
  } catch (error) {
    console.error('❌ Excepción obteniendo último borrador:', error);
    return null;
  }
};