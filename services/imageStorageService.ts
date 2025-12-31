import { supabase } from './supabaseService';

/**
 * Subir imagen a Supabase Storage y retornar la URL pública
 * NOTA: El bucket debe ser público (creado desde Dashboard)
 */
export const uploadImageToStorage = async (
  imageDataUrl: string,
  userId: string,
  generationId: string,
  type: 'draft' | 'hd'
): Promise<string | null> => {
  try {
    // Convertir data URL a Blob
    const base64Data = imageDataUrl.split(',')[1];
    const binaryData = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
    
    // Crear nombre de archivo único
    const fileName = `${type}_${generationId}_${Date.now()}.jpg`;
    const filePath = `${userId}/${fileName}`;
    
    console.log(`📤 Subiendo imagen ${type} a Storage:`, filePath);
    
    // Subir a Storage (el bucket debe ser público)
    const { data, error } = await supabase.storage
      .from('flyer-images')
      .upload(filePath, binaryData, {
        contentType: 'image/jpeg',
        upsert: false
      });
    
    if (error) {
      console.error('❌ Error subiendo imagen a Storage:', error);
      return null;
    }
    
    // Obtener URL pública
    const { data: urlData } = supabase.storage
      .from('flyer-images')
      .getPublicUrl(filePath);
    
    console.log(`✅ Imagen ${type} subida exitosamente:`, urlData.publicUrl);
    return urlData.publicUrl;
  } catch (error) {
    console.error('❌ Excepción subiendo imagen:', error);
    return null;
  }
};

/**
 * Eliminar imagen de Storage
 */
export const deleteImageFromStorage = async (imageUrl: string): Promise<boolean> => {
  try {
    // Extraer path de la URL
    const urlParts = imageUrl.split('/');
    const fileName = urlParts[urlParts.length - 1];
    const folderName = urlParts[urlParts.length - 2];
    const filePath = `${folderName}/${fileName}`;
    
    const { error } = await supabase.storage
      .from('flyer-images')
      .remove([filePath]);
    
    if (error) {
      console.error('❌ Error eliminando imagen:', error);
      return false;
    }
    
    console.log('✅ Imagen eliminada:', filePath);
    return true;
  } catch (error) {
    console.error('❌ Excepción eliminando imagen:', error);
    return false;
  }
};

/**
 * Obtener URL de imagen por path
 */
export const getImageUrl = async (userId: string, fileName: string): Promise<string | null> => {
  try {
    const { data } = supabase.storage
      .from('flyer-images')
      .getPublicUrl(`${userId}/${fileName}`);
    
    return data.publicUrl;
  } catch (error) {
    console.error('❌ Error obteniendo URL de imagen:', error);
    return null;
  }
};