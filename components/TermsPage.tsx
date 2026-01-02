import React from 'react';
import { useNavigate } from 'react-router-dom';

export const TermsPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans overflow-x-hidden">
      {/* NAV */}
      <nav className="flex justify-between items-center p-6 border-b border-white/10 bg-black/50 backdrop-blur sticky top-0 z-50">
        <div 
          onClick={() => navigate('/')} 
          className="text-xl font-black tracking-tighter flex items-center gap-2 cursor-pointer"
        >
          <span className="text-green-400">Estudio 56</span>
        </div>
        <button 
          onClick={() => navigate('/iniciar-sesion')} 
          className="bg-white text-black font-bold px-4 py-2 rounded-full hover:scale-105 transition-transform text-sm"
        >
          Entrar a la Matrix
        </button>
      </nav>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-4xl md:text-5xl font-black mb-8 tracking-tight">
          TÉRMINOS Y CONDICIONES
        </h1>
        
        <p className="text-white/60 mb-8">
          Última actualización: 8 de noviembre de 2025
        </p>

        <div className="prose prose-invert prose-lg max-w-none space-y-8">
          <p>
            Al acceder a este sitio web, asumimos que acepta estos términos y condiciones. No continúe usando Estudio 56 si no está de acuerdo con todos los términos y condiciones establecidos en esta página.
          </p>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">Licencia</h2>
          <p>
            A menos que se indique lo contrario, Estudio 56 y/o sus licenciantes poseen los derechos de propiedad intelectual de todo el material en Estudio 56. Todos los derechos de propiedad intelectual están reservados. Puede acceder a este material desde Estudio 56 para su uso personal, sujeto a las restricciones establecidas en estos términos y condiciones.
          </p>
          <p className="font-bold mt-4">No debe:</p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>Republicar material de Estudio 56</li>
            <li>Vender, alquilar o sublicenciar material de Estudio 56</li>
            <li>Reproducir, duplicar o copiar material de Estudio 56</li>
            <li>Redistribuir contenido de Estudio 56</li>
          </ul>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">Descargo de Responsabilidad</h2>
          <p>
            Todo el material que se proporciona en Estudio 56 se proporciona "tal cual". Estudio 56 no ofrece garantías, expresas o implícitas, y por la presente rechaza y niega todas las demás garantías, incluyendo, sin limitación, garantías implícitas o condiciones de comercialización, adecuación para un propósito particular o no infracción de propiedad intelectual u otros derechos.
          </p>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">Limitaciones</h2>
          <p>
            En ningún caso Estudio 56 o sus proveedores serán responsables de ningún daño (incluyendo, sin limitación, daños por pérdida de datos o ganancias, o debido a interrupción del negocio) que surjan del uso o la imposibilidad de usar los materiales en Estudio 56, incluso si Estudio 56 o un representante autorizado de Estudio 56 ha sido notificado oralmente o por escrito de la posibilidad de tales daños.
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-12 text-center text-white/20 text-sm bg-black border-t border-white/10">
        <p>© 2026 Estudio 56. Hecho con paciencia y mucha cafeína.</p>
      </footer>
    </div>
  );
};

export default TermsPage;