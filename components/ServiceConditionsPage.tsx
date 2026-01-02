import React from 'react';
import { useNavigate } from 'react-router-dom';

export const ServiceConditionsPage: React.FC = () => {
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
          CONDICIONES DE SERVICIO
        </h1>
        
        <p className="text-white/60 mb-8">
          Última actualización: 8 de noviembre de 2025
        </p>

        <div className="prose prose-invert prose-lg max-w-none space-y-8">
          <p>
            Bienvenido a Estudio 56 ("nosotros", "nuestro" o "la Compañía"). Estas Condiciones de Servicio ("Términos") rigen su acceso y uso de nuestro sitio web https://estudio56.cl y nuestros servicios (colectivamente, el "Servicio").
          </p>

          <p>
            Al acceder o utilizar el Servicio, usted acepta estar sujeto a estos Términos. Si no está de acuerdo con alguna parte de los términos, no podrá acceder al Servicio.
          </p>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">1. Cuentas</h2>
          <p>
            Usted es responsable de mantener la confidencialidad de su cuenta y contraseña. Acepta notificarnos inmediatamente sobre cualquier uso no autorizado de su cuenta.
          </p>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">2. Licencia de Uso</h2>
          <p>
            Le otorgamos una licencia limitada, no exclusiva e intransferible para usar el Servicio para la generación de contenido asistido por IA para sus fines comerciales y personales, sujeto a estos Términos.
          </p>
          <p className="font-bold mt-4">Usted acepta no utilizar el Servicio para:</p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>Actividades ilegales o que infrinjan los derechos de terceros.</li>
            <li>Generar material que promueva el odio, la discriminación o la violencia.</li>
            <li>Intentar realizar ingeniería inversa, descompilar o descubrir el código fuente de nuestro Servicio.</li>
            <li>Revender o sublicenciar el Servicio sin nuestro permiso explícito.</li>
          </ul>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">3. Pagos y Suscripciones</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Facturación:</strong> Los planes pagados se facturan de forma mensual o anual por adelantado.</li>
            <li><strong>Renovación Automática:</strong> Su suscripción se renovará automáticamente al final de cada ciclo de facturación, a menos que usted la cancele.</li>
            <li><strong>Cancelación:</strong> Puede cancelar su suscripción en cualquier momento. La cancelación será efectiva al final del período de facturación actual.</li>
            <li><strong>Reembolsos:</strong> Salvo que la ley aplicable exija lo contrario, todos los pagos son finales y no reembolsables.</li>
          </ul>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">4. Propiedad del Contenido</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Contenido del Usuario:</strong> Usted retiene la propiedad de todos los datos e información que carga en el Servicio ("Contenido del Usuario").</li>
            <li><strong>Contenido Generado:</strong> Usted retiene todos los derechos y la propiedad del contenido que genera utilizando el Servicio ("Contenido Generado"). Usted es libre de usar el Contenido Generado para cualquier propósito, incluido el comercial.</li>
            <li><strong>Responsabilidad:</strong> La IA puede cometer errores. Usted es el único responsable de revisar, validar y asegurar que el Contenido Generado sea preciso y apropiado para su uso. No garantizamos la precisión del Contenido Generado.</li>
          </ul>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">5. Propiedad Intelectual</h2>
          <p>
            El Servicio y todo su contenido original, características y funcionalidades (excluyendo el Contenido del Usuario y el Contenido Generado) son y seguirán siendo propiedad exclusiva de Estudio 56 y sus licenciantes.
          </p>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">6. Política de Privacidad</h2>
          <p>
            El uso que hacemos de su información personal se rige por nuestra Política de Privacidad, disponible en <a href="/privacidad" className="text-green-400 hover:underline">https://estudio56.cl/privacidad</a>. Al usar el Servicio, usted acepta los términos de nuestra Política de Privacidad.
          </p>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">7. Terminación</h2>
          <p>
            Podemos suspender o terminar su acceso al Servicio de inmediato, sin previo aviso, si usted incumple estos Términos.
          </p>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">8. Exclusión de Garantías</h2>
          <p>
            El Servicio se proporciona "TAL CUAL" y "SEGÚN DISPONIBILIDAD". No garantizamos que el Servicio será ininterrumpido, seguro o libre de errores.
          </p>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">9. Limitación de Responsabilidad</h2>
          <p>
            En la máxima medida permitida por la ley, Estudio 56 no será responsable de ningún daño indirecto, incidental o consecuente que resulte del uso del Servicio.
          </p>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">10. Modificaciones a los Términos</h2>
          <p>
            Nos reservamos el derecho de modificar estos Términos en cualquier momento. Le notificaremos publicando los nuevos términos en esta página.
          </p>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">11. Ley Aplicable</h2>
          <p>
            Estos Términos se regirán e interpretarán de acuerdo con las leyes de Chile, sin tener en cuenta sus disposiciones sobre conflicto de leyes.
          </p>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">12. Contacto</h2>
          <p>
            Si tiene alguna pregunta sobre estos Términos, contáctenos en soporte@estudio56.cl.
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

export default ServiceConditionsPage;