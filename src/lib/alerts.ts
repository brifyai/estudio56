import Swal from 'sweetalert2';

// Colores de marca Estudio 56
const colors = {
  primary: '#3b82f6',    // Azul Gemini
  success: '#10b981',    // Esmeralda
  danger: '#ef4444',     // Rojo
  warning: '#f59e0b',    // Ambar
  darkBg: '#111827',     // Gris muy oscuro (Tailwind gray-900)
  surface: '#1f2937',    // Gris superficie (Tailwind gray-800)
  border: '#374151',     // Borde (Tailwind gray-700)
};

const commonConfig = {
  background: colors.darkBg,
  color: '#ffffff',
  confirmButtonColor: colors.primary,
  borderRadius: '16px',
  customClass: {
    popup: 'border border-gray-700 shadow-2xl rounded-3xl font-sans',
    title: 'text-2xl font-bold text-white tracking-tight',
    htmlContainer: 'text-gray-400 text-sm',
    confirmButton: 'rounded-xl px-6 py-2.5 text-sm font-semibold transition-all hover:scale-105 active:scale-95',
    cancelButton: 'rounded-xl px-6 py-2.5 text-sm font-semibold transition-all hover:bg-gray-700',
  },
  buttonsStyling: true,
};

export const estudioAlerts = {
  // Alerta de progreso con porcentaje
  progress: (initialMessage: string = 'Iniciando...') => {
    let percent = 0;
    let message = initialMessage;
    let lastUpdate = Date.now();
    let isAutoAdvancing = true;
    
    const updateProgress = (newPercent: number, newMessage: string) => {
      percent = newPercent;
      message = newMessage;
      lastUpdate = Date.now();
      
      // Actualizar elementos del DOM si el modal está abierto
      const progressBar = document.querySelector('#progress-bar') as HTMLElement;
      const progressText = document.querySelector('#progress-text') as HTMLElement;
      const progressPercent = document.querySelector('#progress-percent') as HTMLElement;
      
      if (progressBar) progressBar.style.width = `${percent}%`;
      if (progressText) progressText.textContent = message;
      if (progressPercent) progressPercent.textContent = `${Math.round(percent)}%`;
    };
    
    Swal.fire({
      ...commonConfig,
      title: `🎨 ${message}`,
      html: `
        <div style="text-align: left; margin-top: 20px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
            <span id="progress-text" style="color: #9ca3af;">${message}</span>
            <span id="progress-percent" style="color: #ffffff; font-weight: bold;">0%</span>
          </div>
          <div style="width: 100%; height: 8px; background: #374151; border-radius: 4px; overflow: hidden;">
            <div id="progress-bar" style="width: 0%; height: 100%; background: linear-gradient(90deg, #3b82f6, #8b5cf6); transition: width 0.3s ease;"></div>
          </div>
        </div>
      `,
      icon: undefined,
      showConfirmButton: false,
      allowOutsideClick: false,
      didOpen: () => {
        // Iniciar intervalo de actualización sincronizada
        const intervalId = setInterval(() => {
          const now = Date.now();
          const timeSinceUpdate = now - lastUpdate;
          
          // Solo avanzar automáticamente si han pasado más de 3 segundos sin actualización manual
          // y si hay llamadas manuales esperadas (percent < 70)
          if (percent >= 100) {
            clearInterval(intervalId);
            Swal.close();
            return;
          }
          
          // Si no hay actualización manual reciente y estamos en rango de progreso automático
          if (timeSinceUpdate > 3000 && percent < 70 && isAutoAdvancing) {
            percent = Math.min(percent + 5, 70);
            updateProgress(percent, message || 'Generando imagen...');
          }
        }, 500);
      }
    });
    
    return {
      updateProgress,
      close: () => Swal.close(),
      setLoading: () => Swal.showLoading(),
      isVisible: () => Swal.isVisible()
    };
  },

  // Alerta de éxito
  success: (title: string, text: string) => {
    return Swal.fire({
      ...commonConfig,
      icon: 'success',
      iconColor: colors.success,
      title,
      text,
      timer: 3000,
      showConfirmButton: false,
    });
  },

  // Alerta de error
  error: (message: string) => {
    return Swal.fire({
      ...commonConfig,
      toast: true,
      position: 'top-end',
      icon: 'error',
      iconColor: colors.danger,
      title: message,
      showConfirmButton: false,
      timer: 4000,
      background: colors.surface,
      timerProgressBar: true,
    });
  },

  // Cargando (Loading State)
  loading: (title: string = 'Procesando con IA...') => {
    Swal.fire({
      ...commonConfig,
      title,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
  },

  // Cerrar cualquier alerta
  close: () => Swal.close(),
  
  // Verificar si hay una alerta visible
  isVisible: () => Swal.isVisible(),
};