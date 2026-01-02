import React from 'react';
import { useNavigate } from 'react-router-dom';

export const PrivacyPage: React.FC = () => {
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
          POLÍTICA DE PRIVACIDAD
        </h1>
        
        <p className="text-white/60 mb-8">
          Última actualización: 8 de noviembre de 2025
        </p>

        <div className="prose prose-invert prose-lg max-w-none space-y-8">
          <p>
            En Estudio 56, accesible desde https://estudio56.cl, una de nuestras principales prioridades es la privacidad de nuestros visitantes. Este documento de Política de Privacidad contiene los tipos de información que recopilamos y cómo la usamos.
          </p>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">Archivos de Registro</h2>
          <p>
            Estudio 56 sigue un procedimiento estándar de uso de archivos de registro. Estos archivos registran a los visitantes cuando visitan sitios web. La información recopilada por los archivos de registro incluye direcciones de protocolo de Internet (IP), tipo de navegador, proveedor de servicios de Internet (ISP), marca de fecha y hora, páginas de referencia/salida y posiblemente el número de clics. Estos datos no están vinculados a información que identifique personalmente. El propósito de la información es analizar tendencias, administrar el sitio, rastrear el movimiento de los usuarios en el sitio y recopilar información demográfica.
          </p>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">Cookies y Web Beacons</h2>
          <p>
            Como cualquier otro sitio web, Estudio 56 utiliza "cookies". Estas cookies se utilizan para almacenar información, incluidas las preferencias de los visitantes y las páginas del sitio web a las que el visitante accedió o visitó. La información se utiliza para optimizar la experiencia de los usuarios personalizando el contenido de nuestra página web según el tipo de navegador de los visitantes y/u otra información.
          </p>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">Google DoubleClick DART Cookie</h2>
          <p>
            Google es uno de los proveedores externos en nuestro sitio. También utiliza cookies, conocidas como DART cookies, para mostrar anuncios a los visitantes de nuestro sitio en función de su visita a www.website.com y otros sitios de Internet. Sin embargo, los visitantes pueden optar por rechazar el uso de cookies de DART visitando la Política de privacidad de la red de contenido y anuncios de Google en la siguiente URL: https://policies.google.com/technologies/ads
          </p>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">Políticas de Privacidad de Terceros</h2>
          <p>
            La política de privacidad de Estudio 56 no se aplica a otros anunciantes o sitios web. Por lo tanto, le aconsejamos que consulte las Políticas de Privacidad respectivas de estos servidores de anuncios de terceros para obtener información más detallada. Puede incluir sus prácticas e instrucciones sobre cómo optar por no participar en ciertas opciones.
          </p>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">Consentimiento</h2>
          <p>
            Al utilizar nuestro sitio web, usted acepta por la presente nuestra Política de Privacidad y está de acuerdo con sus Términos y Condiciones.
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

export default PrivacyPage;