import React from 'react';
import Swal, { SweetAlertResult } from 'sweetalert2';
import { CONSISTENCY_CONFLICTS } from '../constants';
import { checkConsistency, ConflictCheckResult } from '../services/consistencyCheckService';

interface ConsistencyWarningDialogProps {
  description: string;
  selectedStyle: string;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * Componente que gestiona las advertencias de consistencia
 * Usa SweetAlert2 para mostrar diálogos "Chileno Premium"
 */
export const ConsistencyWarningDialog: React.FC<ConsistencyWarningDialogProps> = ({
  description,
  selectedStyle,
  onConfirm,
  onCancel
}) => {
  
  /**
   * Verifica y muestra advertencia si hay conflicto
   */
  const checkAndShowWarning = async (): Promise<boolean> => {
    const result = checkConsistency({
      description,
      selectedStyle
    });

    if (result.hasConflict && result.conflictData) {
      const swalResult = await Swal.fire({
        title: result.conflictData.title,
        text: result.conflictData.message,
        icon: result.conflictData.icon,
        showCancelButton: true,
        confirmButtonText: result.conflictData.confirmButtonText,
        cancelButtonText: result.conflictData.cancelButtonText,
        confirmButtonColor: '#f39c12', // Naranja para warning
        cancelButtonColor: '#3085d6',  // Azul para corregir
        background: '#1a1a2e',
        color: '#ffffff',
        customClass: {
          title: 'swal-title-chilean',
          htmlContainer: 'swal-text-chilean'
        }
      });

      if (swalResult.isConfirmed) {
        // Usuario eligió generar igual
        onConfirm();
        return true;
      } else {
        // Usuario eligió corregir
        onCancel();
        return true;
      }
    }

    // No hay conflicto, continuar normalmente
    return false;
  };

  // El componente no renderiza nada visible, solo gestiona el diálogo
  return null;
};

/**
 * Función utilitaria para mostrar advertencia desde cualquier parte de la app
 */
export async function showConsistencyWarning(
  description: string,
  selectedStyle: string
): Promise<'confirmed' | 'cancelled' | 'no-conflict'> {
  const result = checkConsistency({ description, selectedStyle });

  if (!result.hasConflict || !result.conflictData) {
    return 'no-conflict';
  }

  const swalResult: SweetAlertResult = await Swal.fire({
    title: result.conflictData.title,
    text: result.conflictData.message,
    icon: result.conflictData.icon,
    showCancelButton: true,
    confirmButtonText: result.conflictData.confirmButtonText,
    cancelButtonText: result.conflictData.cancelButtonText,
    confirmButtonColor: '#f39c12',
    cancelButtonColor: '#3085d6',
    background: '#1a1a2e',
    color: '#ffffff'
  });

  return swalResult.isConfirmed ? 'confirmed' : 'cancelled';
}

/**
 * Hook personalizado para usar advertencias de consistencia
 */
export function useConsistencyCheck() {
  const checkConsistencyWarning = React.useCallback(async (
    description: string,
    selectedStyle: string,
    onConfirm?: () => void,
    onCancel?: () => void
  ): Promise<boolean> => {
    const result = checkConsistency({ description, selectedStyle });

    if (result.hasConflict && result.conflictData) {
      const swalResult = await Swal.fire({
        title: result.conflictData.title,
        text: result.conflictData.message,
        icon: result.conflictData.icon,
        showCancelButton: true,
        confirmButtonText: result.conflictData.confirmButtonText,
        cancelButtonText: result.conflictData.cancelButtonText,
        confirmButtonColor: '#f39c12',
        cancelButtonColor: '#3085d6',
        background: '#1a1a2e',
        color: '#ffffff'
      });

      if (swalResult.isConfirmed) {
        onConfirm?.();
        return true;
      } else {
        onCancel?.();
        return false;
      }
    }

    // No hay conflicto
    onConfirm?.();
    return true;
  }, []);

  return { checkConsistencyWarning };
}

export default ConsistencyWarningDialog;