import { supabase } from './supabaseService';
import { CreditEquivalence, DEFAULT_EQUIVALENCES } from '../types';

/**
 * Obtiene las equivalencias de créditos desde la base de datos
 * Si falla, usa las constantes por defecto
 */
export const getCreditEquivalences = async (): Promise<Record<string, number>> => {
  try {
    const { data, error } = await supabase
      .from('credit_equivalences')
      .select('media_type, credits_required')
      .eq('is_active', true);

    if (error || !data || data.length === 0) {
      console.warn('No se pudieron cargar equivalencias, usando valores por defecto');
      return DEFAULT_EQUIVALENCES;
    }

    // Convertir a objeto { photo_hd: 1, video_hd: 10, ... }
    const equivalences: Record<string, number> = {};
    data.forEach((item) => {
      equivalences[item.media_type] = item.credits_required;
    });

    return equivalences;
  } catch (error) {
    console.error('Error al obtener equivalencias:', error);
    return DEFAULT_EQUIVALENCES;
  }
};

/**
 * Obtiene una equivalencia específica por tipo de medio
 */
export const getCreditsForMediaType = async (mediaType: string): Promise<number> => {
  const equivalences = await getCreditEquivalences();
  return equivalences[mediaType] || DEFAULT_EQUIVALENCES[mediaType] || 1;
};

/**
 * Calcula los créditos necesarios para generar un medio
 */
export const calculateCreditsNeeded = async (
  mediaType: 'photo_hd' | 'video_hd' | string
): Promise<number> => {
  return getCreditsForMediaType(mediaType);
};

/**
 * Obtiene todas las equivalencias con descripción (para UI)
 */
export const getEquivalencesWithDescription = async (): Promise<CreditEquivalence[]> => {
  try {
    const { data, error } = await supabase
      .from('credit_equivalences')
      .select('*')
      .eq('is_active', true)
      .order('credits_required', { ascending: true });

    if (error || !data || data.length === 0) {
      // Retornar equivalencias por defecto con formato
      return [
        {
          id: 'default-photo',
          media_type: 'photo_hd',
          credits_required: 1,
          description: '1 Foto HD = 1 Crédito',
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'default-video',
          media_type: 'video_hd',
          credits_required: 10,
          description: '1 Video HD = 10 Créditos',
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
    }

    return data;
  } catch (error) {
    console.error('Error al obtener equivalencias:', error);
    return [];
  }
};