// Versión simplificada del CanvasEditor para debugging
import { useEffect, useRef } from 'react';

interface CanvasEditorSimpleProps {
  aspectRatio: string;
}

const CanvasEditorSimple = ({ aspectRatio }: CanvasEditorSimpleProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    console.log('🎨 [CanvasEditorSimple] Montado correctamente');
    console.log('🎨 [CanvasEditorSimple] aspectRatio:', aspectRatio);
    
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        // Dibujar algo simple para verificar que funciona
        ctx.fillStyle = '#1f2937';
        ctx.fillRect(0, 0, 600, 600);
        
        ctx.fillStyle = '#10b981';
        ctx.font = '24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('✅ Canvas Editor Funcionando', 300, 280);
        ctx.fillText('Versión Simplificada', 300, 320);
      }
    }
  }, [aspectRatio]);

  return (
    <div className="w-full h-full bg-gray-900 flex flex-col items-center justify-center p-8">
      <div className="bg-gray-800 p-6 rounded-xl border-2 border-green-500">
        <h2 className="text-white text-2xl font-bold mb-4 text-center">
          ✅ Editor Canva Cargado
        </h2>
        <p className="text-white/60 text-sm mb-4 text-center">
          Versión simplificada para debugging
        </p>
        <canvas
          ref={canvasRef}
          width={600}
          height={600}
          className="border-2 border-white/20 rounded-lg"
        />
        <div className="mt-4 text-white/40 text-xs text-center">
          Aspect Ratio: {aspectRatio}
        </div>
      </div>
    </div>
  );
};

export default CanvasEditorSimple;
