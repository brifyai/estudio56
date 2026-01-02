import React from 'react';
import { useNavigate } from 'react-router-dom';

export const CookiesPage: React.FC = () => {
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
          POLÍTICA DE COOKIES
        </h1>
        
        <p className="text-white/60 mb-8">
          Última actualización: 8 de noviembre de 2025
        </p>

        <div className="prose prose-invert prose-lg max-w-none space-y-8">
          <p>
            Esta Política de Cookies explica qué son las Cookies y cómo las usamos. Debe leer esta política para comprender qué tipo de cookies utilizamos, o la información que recopilamos mediante Cookies y cómo se usa esa información.
          </p>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">¿Qué son las cookies?</h2>
          <p>
            Las cookies son pequeños archivos de texto que se almacenan en su computadora cuando visita sitios web. Las cookies son ampliamente utilizadas para hacer que los sitios web funcionen de manera más eficiente y proporcionar información a los propietarios del sitio.
          </p>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">Cómo utilizamos las cookies</h2>
          <p>
            Cuando accede y utiliza nuestro Servicio, podemos colocar varios archivos de cookies en su navegador web. Utilizamos cookies para los siguientes propósitos:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>Para habilitar ciertas funciones del Servicio</li>
            <li>Para proporcionar análisis</li>
            <li>Para almacenar sus preferencias</li>
            <li>Para personalizar el contenido y los anuncios</li>
          </ul>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">Tipos de cookies que utilizamos</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Cookies esenciales:</strong> Necesarias para el funcionamiento del sitio web.</li>
            <li><strong>Cookies de preferencias:</strong> Permiten recordar sus preferencias y personalización.</li>
            <li><strong>Cookies de análisis:</strong> Nos ayudan a entender cómo los visitantes usan el sitio.</li>
            <li><strong>Cookies de marketing:</strong> Utilizadas para rastrear a los visitantes en los sitios web.</li>
          </ul>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">Su consentimiento</h2>
          <p>
            Al utilizar nuestro sitio web, usted acepta por la presente nuestra Política de Cookies y está de acuerdo con sus Términos y Condiciones.
          </p>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">Cómo controlar las cookies</h2>
          <p>
            Puede configurar su navegador para rechazar todas las cookies o para indicar cuándo se envía una cookie. Sin embargo, si no acepta las cookies, es posible que no pueda utilizar algunas partes de nuestro Servicio.
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

export default CookiesPage;