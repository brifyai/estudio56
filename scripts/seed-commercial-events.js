import { createClient } from '@supabase/supabase-js';

// Configuración de Supabase - REEMPLAZA CON TUS CREDENCIALES
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://tu-proyecto.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY || 'tu-service-role-key';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// 180 eventos comerciales de Chile 2026
const events = [
  // ENERO 2026
  { id: 'jan_01', name: 'Día de Año Nuevo', date: '2026-01-01', days_advance: 7, category: 'festivo', description: 'Celebración de año nuevo' },
  { id: 'jan_04', name: 'Día Mundial del Braille', date: '2026-01-04', days_advance: 3, category: 'especial', description: 'Concientización sobre accesibilidad' },
  { id: 'jan_06', name: 'Día de Reyes', date: '2026-01-06', days_advance: 7, category: 'festivo', description: 'Regalos y celebraciones' },
  { id: 'jan_13_1', name: 'Día Mundial de la Lucha contra la Depresión', date: '2026-01-13', days_advance: 3, category: 'especial', description: 'Salud mental' },
  { id: 'jan_13_2', name: 'Día del Sticker', date: '2026-01-13', days_advance: 3, category: 'marketing', description: 'Stickers y pegatinas' },
  { id: 'jan_13_3', name: 'Día Mundial del Chicle', date: '2026-01-13', days_advance: 3, category: 'consumo', description: 'Productos de confitería' },
  { id: 'jan_16', name: 'Día Internacional de la Croqueta', date: '2026-01-16', days_advance: 3, category: 'consumo', description: 'Gastronomía' },
  { id: 'jan_18', name: 'Día Mundial de la Nieve', date: '2026-01-18', days_advance: 3, category: 'festivo', description: 'Invierno y nieve' },
  { id: 'jan_19_1', name: 'Blue Monday', date: '2026-01-19', days_advance: 3, category: 'especial', description: 'Día más triste del año' },
  { id: 'jan_19_2', name: 'Día de las Palomitas de Maíz', date: '2026-01-19', days_advance: 3, category: 'consumo', description: 'Cine y snacks' },
  { id: 'jan_21', name: 'Día Internacional del Abrazo', date: '2026-01-21', days_advance: 3, category: 'especial', description: 'Conexión emocional' },
  { id: 'jan_24_1', name: 'Día Mundial de la Cultura Africana', date: '2026-01-24', days_advance: 3, category: 'especial', description: 'Cultura africana' },
  { id: 'jan_24_2', name: 'Día Internacional de la Educación', date: '2026-01-24', days_advance: 3, category: 'especial', description: 'Educación y aprendizaje' },
  { id: 'jan_26_1', name: 'Día Mundial de la Educación Ambiental', date: '2026-01-26', days_advance: 3, category: 'especial', description: 'Medio ambiente' },
  { id: 'jan_26_2', name: 'Día Internacional del Community Manager', date: '2026-01-26', days_advance: 3, category: 'marketing', description: 'Redes sociales' },
  { id: 'jan_27_1', name: 'Día Mundial de la Tarta de Chocolate', date: '2026-01-27', days_advance: 3, category: 'consumo', description: 'Postres y dulces' },
  { id: 'jan_27_2', name: 'Día Internacional del Conservador Restaurador', date: '2026-01-27', days_advance: 3, category: 'especial', description: 'Arte y patrimonio' },
  { id: 'jan_28_1', name: 'Día Internacional de la Protección de Datos', date: '2026-01-28', days_advance: 3, category: 'especial', description: 'Privacidad digital' },
  { id: 'jan_28_2', name: 'Día Internacional del LEGO', date: '2026-01-28', days_advance: 3, category: 'consumo', description: 'Juguetes y juegos' },
  { id: 'jan_28_3', name: 'Día Mundial por la Reducción de Emisiones', date: '2026-01-28', days_advance: 3, category: 'especial', description: 'Medio ambiente' },
  { id: 'jan_30_1', name: 'Día Escolar de la No Violencia y la Paz', date: '2026-01-30', days_advance: 3, category: 'especial', description: 'Paz y no violencia' },
  { id: 'jan_30_2', name: 'Día Internacional del Croissant', date: '2026-01-30', days_advance: 3, category: 'consumo', description: 'Panadería y pastelería' },
  { id: 'jan_31', name: 'Día Internacional del Mago', date: '2026-01-31', days_advance: 3, category: 'especial', description: 'Ilusionismo y magia' },

  // FEBRERO 2026
  { id: 'feb_02_1', name: 'Día de la Marmota', date: '2026-02-02', days_advance: 7, category: 'especial', description: 'Predicción del clima' },
  { id: 'feb_02_2', name: 'Día Mundial de los Humedales', date: '2026-02-02', days_advance: 3, category: 'especial', description: 'Medio ambiente' },
  { id: 'feb_04_1', name: 'Día Mundial contra el Cáncer', date: '2026-02-04', days_advance: 7, category: 'especial', description: 'Concientización oncológica' },
  { id: 'feb_04_2', name: 'Día del Orgullo Zombie', date: '2026-02-04', days_advance: 3, category: 'marketing', description: 'Entretención Halloween' },
  { id: 'feb_04_3', name: 'Aniversario de Facebook', date: '2026-02-04', days_advance: 3, category: 'marketing', description: 'Redes sociales' },
  { id: 'feb_05', name: 'Día Mundial de la Nutella', date: '2026-02-05', days_advance: 3, category: 'consumo', description: 'Dulces y untables' },
  { id: 'feb_08_1', name: 'Super Bowl', date: '2026-02-08', days_advance: 14, category: 'consumo', description: 'Deporte y comida' },
  { id: 'feb_08_2', name: 'Día de la Piscola', date: '2026-02-08', days_advance: 3, category: 'consumo', description: 'Bebida nacional chilena' },
  { id: 'feb_09', name: 'Día Mundial de la Pizza', date: '2026-02-09', days_advance: 3, category: 'consumo', description: 'Gastronomía italiana' },
  { id: 'feb_11_1', name: 'Día Internacional de la Mujer y la Niña en la Ciencia', date: '2026-02-11', days_advance: 3, category: 'especial', description: 'Ciencia y género' },
  { id: 'feb_11_2', name: 'Día Mundial de la Mujer Médica', date: '2026-02-11', days_advance: 3, category: 'especial', description: 'Salud y género' },
  { id: 'feb_13_1', name: 'Día Mundial de la Radio', date: '2026-02-13', days_advance: 3, category: 'especial', description: 'Medios de comunicación' },
  { id: 'feb_13_2', name: 'Día Mundial del Soltero', date: '2026-02-13', days_advance: 3, category: 'marketing', description: 'Compras para solteros' },
  { id: 'feb_14', name: 'Día de San Valentín', date: '2026-02-14', days_advance: 14, category: 'consumo', description: 'Regalos románticos' },
  { id: 'feb_15', name: 'Día contra el Cáncer Infantil', date: '2026-02-15', days_advance: 7, category: 'especial', description: 'Concientización infantil' },
  { id: 'feb_17', name: 'Año Nuevo Chino', date: '2026-02-17', days_advance: 14, category: 'festivo', description: 'Celebración china' },
  { id: 'feb_19', name: 'Día contra la Homofobia en el Deporte', date: '2026-02-19', days_advance: 3, category: 'especial', description: 'Deporte e inclusión' },
  { id: 'feb_20_1', name: 'Día Mundial de Amar a tu Mascota', date: '2026-02-20', days_advance: 3, category: 'consumo', description: 'Mascotas y accesorios' },
  { id: 'feb_20_2', name: 'Día Mundial de la Justicia Social', date: '2026-02-20', days_advance: 3, category: 'especial', description: 'Justicia social' },
  { id: 'feb_26', name: 'Día Mundial del Pistacho', date: '2026-02-26', days_advance: 3, category: 'consumo', description: 'Frutos secos' },
  { id: 'feb_27', name: 'Día Mundial de las ONG', date: '2026-02-27', days_advance: 3, category: 'especial', description: 'Organizaciones' },
  { id: 'feb_28', name: 'Día Mundial de las Enfermedades Raras', date: '2026-02-28', days_advance: 3, category: 'especial', description: 'Salud' },

  // MARZO 2026
  { id: 'mar_01', name: 'Día de la Cero Discriminación', date: '2026-03-01', days_advance: 3, category: 'especial', description: 'Inclusión' },
  { id: 'mar_03', name: 'Día Mundial de la Vida Silvestre', date: '2026-03-03', days_advance: 3, category: 'especial', description: 'Naturaleza' },
  { id: 'mar_05', name: 'Día de la Abstinencia Digital', date: '2026-03-05', days_advance: 3, category: 'especial', description: 'Desconexión digital' },
  { id: 'mar_08', name: 'Día Internacional de la Mujer', date: '2026-03-08', days_advance: 14, category: 'especial', description: 'Mujer y equidad' },
  { id: 'mar_09', name: 'Día Internacional del DJ', date: '2026-03-09', days_advance: 3, category: 'marketing', description: 'Música electrónica' },
  { id: 'mar_10', name: 'Día de Mario Bros', date: '2026-03-10', days_advance: 3, category: 'consumo', description: 'Videojuegos' },
  { id: 'mar_12', name: 'Día Internacional de los Tuiteros', date: '2026-03-12', days_advance: 3, category: 'marketing', description: 'Redes sociales' },
  { id: 'mar_15', name: 'Día Mundial de los Derechos del Consumidor', date: '2026-03-15', days_advance: 7, category: 'consumo', description: 'Derechos del consumidor' },
  { id: 'mar_17', name: 'Día de San Patricio', date: '2026-03-17', days_advance: 7, category: 'festivo', description: 'Celebración irlandesa' },
  { id: 'mar_20_1', name: 'Día Internacional de la Felicidad', date: '2026-03-20', days_advance: 3, category: 'especial', description: 'Bienestar' },
  { id: 'mar_20_2', name: 'Equinoccio de otoño', date: '2026-03-20', days_advance: 7, category: 'especial', description: 'Cambio de estación' },
  { id: 'mar_21_1', name: 'Día Mundial de la Poesía', date: '2026-03-21', days_advance: 3, category: 'especial', description: 'Poesía y literatura' },
  { id: 'mar_21_2', name: 'Día Mundial del Síndrome de Down', date: '2026-03-21', days_advance: 3, category: 'especial', description: 'Inclusión' },
  { id: 'mar_21_3', name: 'Aniversario de X (Twitter)', date: '2026-03-21', days_advance: 3, category: 'marketing', description: 'Redes sociales' },
  { id: 'mar_21_4', name: 'Día del Tiramisú', date: '2026-03-21', days_advance: 3, category: 'consumo', description: 'Postres italianos' },
  { id: 'mar_21_5', name: 'Día Internacional de los Bosques', date: '2026-03-21', days_advance: 3, category: 'especial', description: 'Medio ambiente' },
  { id: 'mar_22', name: 'Día Mundial del Agua', date: '2026-03-22', days_advance: 7, category: 'especial', description: 'Recursos hídricos' },
  { id: 'mar_23', name: 'Día Meteorológico Mundial', date: '2026-03-23', days_advance: 3, category: 'especial', description: 'Clima' },
  { id: 'mar_26', name: 'Día Mundial del Clima', date: '2026-03-26', days_advance: 3, category: 'especial', description: 'Cambio climático' },
  { id: 'mar_27_1', name: 'Día Mundial del Teatro', date: '2026-03-27', days_advance: 7, category: 'especial', description: 'Artes escénicas' },
  { id: 'mar_27_2', name: 'Día Internacional del Queso', date: '2026-03-27', days_advance: 3, category: 'consumo', description: 'Lácteos' },
  { id: 'mar_28', name: 'La Hora del Planeta', date: '2026-03-28', days_advance: 7, category: 'especial', description: 'Sostenibilidad' },

  // ABRIL 2026
  { id: 'apr_02_1', name: 'Día Mundial de Concienciación sobre el Autismo', date: '2026-04-02', days_advance: 7, category: 'especial', description: 'Inclusión' },
  { id: 'apr_02_2', name: 'Día Mundial de la Gelatina', date: '2026-04-02', days_advance: 3, category: 'consumo', description: 'Postres' },
  { id: 'apr_03', name: 'Día Mundial del Arcoíris', date: '2026-04-03', days_advance: 3, category: 'especial', description: 'Diversidad' },
  { id: 'apr_06', name: 'Día Mundial de la Actividad Física', date: '2026-04-06', days_advance: 7, category: 'especial', description: 'Deporte y salud' },
  { id: 'apr_07', name: 'Día Mundial de la Salud', date: '2026-04-07', days_advance: 7, category: 'especial', description: 'Salud mundial' },
  { id: 'apr_11', name: 'Día Mundial del Parkinson', date: '2026-04-11', days_advance: 3, category: 'especial', description: 'Salud' },
  { id: 'apr_13_1', name: 'Día Internacional del Beso', date: '2026-04-13', days_advance: 3, category: 'marketing', description: 'Amor y relaciones' },
  { id: 'apr_13_2', name: 'Día Mundial del Scrabble', date: '2026-04-13', days_advance: 3, category: 'consumo', description: 'Juegos de mesa' },
  { id: 'apr_14', name: 'Día de las Américas', date: '2026-04-14', days_advance: 7, category: 'festivo', description: 'Unidad americana' },
  { id: 'apr_15', name: 'Día Mundial del Arte', date: '2026-04-15', days_advance: 7, category: 'especial', description: 'Arte y cultura' },
  { id: 'apr_16', name: 'Día Mundial del Emprendimiento', date: '2026-04-16', days_advance: 7, category: 'marketing', description: 'Emprendedores' },
  { id: 'apr_18', name: 'Día Internacional de los Monumentos y Sitios', date: '2026-04-18', days_advance: 3, category: 'especial', description: 'Patrimonio' },
  { id: 'apr_19', name: 'Día Mundial de los Simpson', date: '2026-04-19', days_advance: 3, category: 'marketing', description: 'Entretención' },
  { id: 'apr_21', name: 'Día Mundial de la Creatividad', date: '2026-04-21', days_advance: 3, category: 'especial', description: 'Innovación' },
  { id: 'apr_22', name: 'Día Mundial de la Tierra', date: '2026-04-22', days_advance: 14, category: 'especial', description: 'Medio ambiente' },
  { id: 'apr_23', name: 'Día Internacional del Libro', date: '2026-04-23', days_advance: 7, category: 'consumo', description: 'Literatura' },
  { id: 'apr_25', name: 'Aniversario de Metricool', date: '2026-04-25', days_advance: 3, category: 'marketing', description: 'Redes sociales' },
  { id: 'apr_26', name: 'Día Mundial de la Propiedad Intelectual', date: '2026-04-26', days_advance: 3, category: 'especial', description: 'Innovación' },
  { id: 'apr_27', name: 'Día Mundial del Diseño Gráfico', date: '2026-04-27', days_advance: 7, category: 'marketing', description: 'Diseño' },
  { id: 'apr_28', name: 'Día Mundial de la Seguridad y Salud en el Trabajo', date: '2026-04-28', days_advance: 3, category: 'especial', description: 'Trabajo seguro' },
  { id: 'apr_29', name: 'Día Internacional de la Danza', date: '2026-04-29', days_advance: 7, category: 'especial', description: 'Artes escénicas' },
  { id: 'apr_30', name: 'Día Internacional del Jazz', date: '2026-04-30', days_advance: 7, category: 'especial', description: 'Música' },

  // MAYO 2026
  { id: 'may_01', name: 'Día del Trabajo', date: '2026-05-01', days_advance: 7, category: 'festivo', description: 'Trabajo y derechos' },
  { id: 'may_02', name: 'Día Internacional Contra el Acoso Escolar', date: '2026-05-02', days_advance: 3, category: 'especial', description: 'Educación segura' },
  { id: 'may_03_1', name: 'Día Mundial de la Libertad de Prensa', date: '2026-05-03', days_advance: 3, category: 'especial', description: 'Periodismo' },
  { id: 'may_03_2', name: 'Día Mundial de la Risa', date: '2026-05-03', days_advance: 3, category: 'especial', description: 'Bienestar' },
  { id: 'may_04', name: 'Día de Star Wars', date: '2026-05-04', days_advance: 7, category: 'marketing', description: 'Entretención' },
  { id: 'may_05', name: 'Aniversario de LinkedIn', date: '2026-05-05', days_advance: 3, category: 'marketing', description: 'Profesional' },
  { id: 'may_08', name: 'Día Mundial de la Cruz Roja', date: '2026-05-08', days_advance: 7, category: 'especial', description: 'Solidaridad' },
  { id: 'may_10', name: 'Día de la Madre', date: '2026-05-10', days_advance: 14, category: 'consumo', description: 'Regalos para mamá' },
  { id: 'may_13', name: 'Día Internacional del Hummus', date: '2026-05-13', days_advance: 3, category: 'consumo', description: 'Gastronomía' },
  { id: 'may_15_1', name: 'Día Nacional del Pisco', date: '2026-05-15', days_advance: 7, category: 'consumo', description: 'Bebida nacional' },
  { id: 'may_15_2', name: 'Día Internacional de las Familias', date: '2026-05-15', days_advance: 3, category: 'especial', description: 'Familia' },
  { id: 'may_16_1', name: 'Día Internacional de la Luz', date: '2026-05-16', days_advance: 3, category: 'especial', description: 'Ciencia' },
  { id: 'may_16_2', name: 'Día Mundial del Heavy Metal', date: '2026-05-16', days_advance: 3, category: 'marketing', description: 'Música' },
  { id: 'may_17_1', name: 'Día Mundial de Internet', date: '2026-05-17', days_advance: 7, category: 'marketing', description: 'Digital' },
  { id: 'may_17_2', name: 'Día contra la Homofobia', date: '2026-05-17', days_advance: 3, category: 'especial', description: 'Inclusión' },
  { id: 'may_17_3', name: 'Día Mundial del Reciclaje', date: '2026-05-17', days_advance: 3, category: 'especial', description: 'Medio ambiente' },
  { id: 'may_17_4', name: 'Día Mundial de la Repostería', date: '2026-05-17', days_advance: 3, category: 'consumo', description: 'Postres' },
  { id: 'may_18', name: 'Día Internacional de los Museos', date: '2026-05-18', days_advance: 7, category: 'especial', description: 'Cultura' },
  { id: 'may_21_1', name: 'Día Mundial de la Diversidad Cultural', date: '2026-05-21', days_advance: 3, category: 'especial', description: 'Cultura' },
  { id: 'may_21_2', name: 'Día Internacional del Té', date: '2026-05-21', days_advance: 3, category: 'consumo', description: 'Bebidas' },
  { id: 'may_22', name: 'Día Mundial del Pac-Man', date: '2026-05-22', days_advance: 3, category: 'consumo', description: 'Videojuegos' },
  { id: 'may_25', name: 'Día del Orgullo Friki', date: '2026-05-25', days_advance: 7, category: 'marketing', description: 'Cultura geek' },
  { id: 'may_28', name: 'Día Mundial de la Hamburguesa', date: '2026-05-28', days_advance: 7, category: 'consumo', description: 'Comida rápida' },
  { id: 'may_31', name: 'Día Mundial sin Tabaco', date: '2026-05-31', days_advance: 7, category: 'especial', description: 'Salud' },

  // JUNIO 2026
  { id: 'jun_01_1', name: 'Día Mundial de las Madres y los Padres', date: '2026-06-01', days_advance: 3, category: 'especial', description: 'Familia' },
  { id: 'jun_01_2', name: 'Día Mundial de los Arrecifes', date: '2026-06-01', days_advance: 3, category: 'especial', description: 'Medio ambiente' },
  { id: 'jun_03_1', name: 'Día Mundial de la Bicicleta', date: '2026-06-03', days_advance: 7, category: 'especial', description: 'Deporte' },
  { id: 'jun_03_2', name: 'Día Mundial del Running', date: '2026-06-03', days_advance: 3, category: 'consumo', description: 'Deporte' },
  { id: 'jun_05', name: 'Día Mundial del Medio Ambiente', date: '2026-06-05', days_advance: 14, category: 'especial', description: 'Medio ambiente' },
  { id: 'jun_08', name: 'Día Mundial de los Océanos', date: '2026-06-08', days_advance: 7, category: 'especial', description: 'Medio ambiente' },
  { id: 'jun_14', name: 'Día Mundial del Donante de Sangre', date: '2026-06-14', days_advance: 7, category: 'especial', description: 'Salud' },
  { id: 'jun_18', name: 'Día Internacional del Sushi', date: '2026-06-18', days_advance: 3, category: 'consumo', description: 'Gastronomía japonesa' },
  { id: 'jun_20_1', name: 'Yellow Day', date: '2026-06-20', days_advance: 7, category: 'marketing', description: 'Día más feliz' },
  { id: 'jun_20_2', name: 'Día Internacional del Surf', date: '2026-06-20', days_advance: 3, category: 'consumo', description: 'Deportes náuticos' },
  { id: 'jun_20_3', name: 'Día Mundial del Refugiado', date: '2026-06-20', days_advance: 3, category: 'especial', description: 'Solidaridad' },
  { id: 'jun_21_1', name: 'Día del Padre', date: '2026-06-21', days_advance: 14, category: 'consumo', description: 'Regalos para papá' },
  { id: 'jun_21_2', name: 'Solsticio de invierno', date: '2026-06-21', days_advance: 7, category: 'especial', description: 'Cambio de estación' },
  { id: 'jun_21_3', name: 'Día Mundial del Selfie', date: '2026-06-21', days_advance: 3, category: 'marketing', description: 'Redes sociales' },
  { id: 'jun_21_4', name: 'Día Internacional del Yoga', date: '2026-06-21', days_advance: 7, category: 'consumo', description: 'Bienestar' },
  { id: 'jun_21_5', name: 'Día Nacional de los Pueblos Indígenas', date: '2026-06-21', days_advance: 3, category: 'especial', description: 'Cultura' },
  { id: 'jun_26', name: 'Día de la Preservación de Bosques Tropicales', date: '2026-06-26', days_advance: 3, category: 'especial', description: 'Medio ambiente' },
  { id: 'jun_28_1', name: 'Día del Árbol', date: '2026-06-28', days_advance: 3, category: 'especial', description: 'Medio ambiente' },
  { id: 'jun_28_2', name: 'Día Internacional del Orgullo LGBTQIA+', date: '2026-06-28', days_advance: 14, category: 'especial', description: 'Diversidad' },
  { id: 'jun_30', name: 'Día de las Redes Sociales', date: '2026-06-30', days_advance: 7, category: 'marketing', description: 'Digital' },

  // JULIO 2026
  { id: 'jul_01_1', name: 'Día Internacional del Chiste', date: '2026-07-01', days_advance: 3, category: 'especial', description: 'Humor' },
  { id: 'jul_01_2', name: 'Día Internacional del Reggae', date: '2026-07-01', days_advance: 3, category: 'marketing', description: 'Música' },
  { id: 'jul_02', name: 'Día Internacional del OVNI', date: '2026-07-02', days_advance: 3, category: 'marketing', description: 'Misterio' },
  { id: 'jul_03', name: 'Día Internacional Libre de Bolsas de Plástico', date: '2026-07-03', days_advance: 3, category: 'especial', description: 'Medio ambiente' },
  { id: 'jul_04', name: 'Día Mundial del eBook', date: '2026-07-04', days_advance: 3, category: 'consumo', description: 'Lectura digital' },
  { id: 'jul_07', name: 'Día Mundial del Cacao', date: '2026-07-07', days_advance: 3, category: 'consumo', description: 'Chocolate' },
  { id: 'jul_09', name: 'Día de la Bandera', date: '2026-07-09', days_advance: 7, category: 'festivo', description: 'Patriotismo' },
  { id: 'jul_11', name: 'Día Mundial de la Población', date: '2026-07-11', days_advance: 3, category: 'especial', description: 'Demografía' },
  { id: 'jul_13', name: 'Día Mundial del Rock', date: '2026-07-13', days_advance: 7, category: 'marketing', description: 'Música' },
  { id: 'jul_17', name: 'Día Mundial del Emoji', date: '2026-07-17', days_advance: 3, category: 'marketing', description: 'Comunicación' },
  { id: 'jul_18', name: 'Día Internacional de Nelson Mandela', date: '2026-07-18', days_advance: 3, category: 'especial', description: 'Liderazgo' },
  { id: 'jul_20', name: 'Día Internacional de la Luna', date: '2026-07-20', days_advance: 3, category: 'especial', description: 'Espacio' },
  { id: 'jul_21', name: 'Día Mundial del Perro', date: '2026-07-21', days_advance: 7, category: 'consumo', description: 'Mascotas' },
  { id: 'jul_22', name: 'Día Mundial del Cerebro', date: '2026-07-22', days_advance: 3, category: 'especial', description: 'Salud' },
  { id: 'jul_26', name: 'Día de los Abuelos', date: '2026-07-26', days_advance: 7, category: 'consumo', description: 'Familia' },
  { id: 'jul_30_1', name: 'Día Internacional de la Amistad', date: '2026-07-30', days_advance: 7, category: 'marketing', description: 'Relaciones' },
  { id: 'jul_30_2', name: 'Día Mundial contra la Trata de Personas', date: '2026-07-30', days_advance: 3, category: 'especial', description: 'Derechos humanos' },

  // AGOSTO 2026
  { id: 'aug_01', name: 'Día de la Pachamama', date: '2026-08-01', days_advance: 3, category: 'especial', description: 'Naturaleza' },
  { id: 'aug_06', name: 'Día Nacional de la Miel', date: '2026-08-06', days_advance: 3, category: 'consumo', description: 'Productos naturales' },
  { id: 'aug_07', name: 'Día Internacional de la Cerveza', date: '2026-08-07', days_advance: 7, category: 'consumo', description: 'Bebidas' },
  { id: 'aug_08', name: 'Día Internacional del Gato', date: '2026-08-08', days_advance: 7, category: 'consumo', description: 'Mascotas' },
  { id: 'aug_09', name: 'Día Internacional del Coworking', date: '2026-08-09', days_advance: 3, category: 'marketing', description: 'Trabajo' },
  { id: 'aug_10', name: 'Día Mundial del León', date: '2026-08-10', days_advance: 3, category: 'especial', description: 'Fauna' },
  { id: 'aug_12_1', name: 'Día Internacional de la Juventud', date: '2026-08-12', days_advance: 7, category: 'especial', description: 'Juventud' },
  { id: 'aug_12_2', name: 'Día Internacional del Disco de Vinilo', date: '2026-08-12', days_advance: 3, category: 'consumo', description: 'Música' },
  { id: 'aug_13', name: 'Día Internacional de los Zurdos', date: '2026-08-13', days_advance: 3, category: 'especial', description: 'Lateralidad' },
  { id: 'aug_15', name: 'Día Mundial de la Relajación', date: '2026-08-15', days_advance: 3, category: 'especial', description: 'Bienestar' },
  { id: 'aug_17', name: 'Día Mundial del Peatón', date: '2026-08-17', days_advance: 3, category: 'especial', description: 'Seguridad vial' },
  { id: 'aug_19_1', name: 'Día Mundial de la Fotografía', date: '2026-08-19', days_advance: 7, category: 'marketing', description: 'Imagen' },
  { id: 'aug_19_2', name: 'Día Mundial de la Asistencia Humanitaria', date: '2026-08-19', days_advance: 3, category: 'especial', description: 'Solidaridad' },
  { id: 'aug_22', name: 'Día Mundial del Folclore', date: '2026-08-22', days_advance: 3, category: 'especial', description: 'Cultura' },
  { id: 'aug_23_1', name: 'Día Mundial del Hashtag', date: '2026-08-23', days_advance: 3, category: 'marketing', description: 'Redes sociales' },
  { id: 'aug_23_2', name: 'Día del Internauta', date: '2026-08-23', days_advance: 3, category: 'marketing', description: 'Internet' },
  { id: 'aug_26', name: 'Día Internacional de la Actriz y del Actor', date: '2026-08-26', days_advance: 3, category: 'marketing', description: 'Cine' },
  { id: 'aug_29', name: 'Día Mundial del Gamer', date: '2026-08-29', days_advance: 7, category: 'consumo', description: 'Videojuegos' },

  // SEPTIEMBRE 2026
  { id: 'sep_05', name: 'Día Mundial del Hermano', date: '2026-09-05', days_advance: 3, category: 'especial', description: 'Familia' },
  { id: 'sep_13_1', name: 'Día de los Programadores', date: '2026-09-13', days_advance: 7, category: 'marketing', description: 'Tecnología' },
  { id: 'sep_13_2', name: 'Día Internacional del Chocolate', date: '2026-09-13', days_advance: 7, category: 'consumo', description: 'Dulces' },
  { id: 'sep_17', name: 'Día del Huaso y de la Chilenidad', date: '2026-09-17', days_advance: 7, category: 'festivo', description: 'Cultura chilena' },
  { id: 'sep_18_1', name: 'Día de la Igualdad Salarial', date: '2026-09-18', days_advance: 3, category: 'especial', description: 'Equidad' },
  { id: 'sep_18_2', name: 'Día de la Independencia y Fiestas Patrias', date: '2026-09-18', days_advance: 30, category: 'festivo', description: 'Fiesta nacional' },
  { id: 'sep_19', name: 'Día Mundial de las Playas', date: '2026-09-19', days_advance: 3, category: 'especial', description: 'Medio ambiente' },
  { id: 'sep_21', name: 'Día Mundial del Alzheimer', date: '2026-09-21', days_advance: 7, category: 'especial', description: 'Salud' },
  { id: 'sep_22_1', name: 'Equinoccio de primavera', date: '2026-09-22', days_advance: 7, category: 'especial', description: 'Cambio de estación' },
  { id: 'sep_22_2', name: 'Día Mundial Sin Coche', date: '2026-09-22', days_advance: 3, category: 'especial', description: 'Medio ambiente' },
  { id: 'sep_23', name: 'Día Nacional de la Lengua de Señas', date: '2026-09-23', days_advance: 3, category: 'especial', description: 'Inclusión' },
  { id: 'sep_24', name: 'Día Mundial de Investigación contra el Cáncer', date: '2026-09-24', days_advance: 3, category: 'especial', description: 'Salud' },
  { id: 'sep_27_1', name: 'Aniversario de Google', date: '2026-09-27', days_advance: 3, category: 'marketing', description: 'Tecnología' },
  { id: 'sep_27_2', name: 'Día Mundial del Turismo', date: '2026-09-27', days_advance: 14, category: 'consumo', description: 'Viajes' },
  { id: 'sep_27_3', name: 'Día Internacional de las Personas Sordas', date: '2026-09-27', days_advance: 3, category: 'especial', description: 'Inclusión' },
  { id: 'sep_29', name: 'Día Mundial del Corazón', date: '2026-09-29', days_advance: 7, category: 'especial', description: 'Salud' },
  { id: 'sep_30', name: 'Día Internacional del Pódcast', date: '2026-09-30', days_advance: 3, category: 'marketing', description: 'Audio' },

  // OCTUBRE 2026
  { id: 'oct_01_1', name: 'Día Internacional del Café', date: '2026-10-01', days_advance: 7, category: 'consumo', description: 'Bebidas' },
  { id: 'oct_01_2', name: 'Día Internacional de las Personas de Edad', date: '2026-10-01', days_advance: 3, category: 'especial', description: 'Adultos mayores' },
  { id: 'oct_02_1', name: 'Día Mundial de la No Violencia', date: '2026-10-02', days_advance: 3, category: 'especial', description: 'Paz' },
  { id: 'oct_02_2', name: 'Día Mundial de la Sonrisa', date: '2026-10-02', days_advance: 3, category: 'marketing', description: 'Bienestar' },
  { id: 'oct_04', name: 'Día Mundial de los Animales', date: '2026-10-04', days_advance: 7, category: 'especial', description: 'Fauna' },
  { id: 'oct_05', name: 'Día Mundial de los Docentes', date: '2026-10-05', days_advance: 7, category: 'especial', description: 'Educación' },
  { id: 'oct_06', name: 'Aniversario de Instagram', date: '2026-10-06', days_advance: 7, category: 'marketing', description: 'Redes sociales' },
  { id: 'oct_09', name: 'Día Mundial del Huevo', date: '2026-10-09', days_advance: 3, category: 'consumo', description: 'Alimentación' },
  { id: 'oct_10', name: 'Día Mundial de la Salud Mental', date: '2026-10-10', days_advance: 7, category: 'especial', description: 'Salud mental' },
  { id: 'oct_11', name: 'Día Internacional de la Niña', date: '2026-10-11', days_advance: 3, category: 'especial', description: 'Infancia' },
  { id: 'oct_17', name: 'Día Internacional para la Erradicación de la Pobreza', date: '2026-10-17', days_advance: 3, category: 'especial', description: 'Solidaridad' },
  { id: 'oct_19', name: 'Día Mundial de la Lucha contra el Cáncer de Mama', date: '2026-10-19', days_advance: 14, category: 'especial', description: 'Salud' },
  { id: 'oct_20', name: 'Día Internacional del Chef', date: '2026-10-20', days_advance: 7, category: 'consumo', description: 'Gastronomía' },
  { id: 'oct_21', name: 'Día Mundial del Ahorro de Energía', date: '2026-10-21', days_advance: 3, category: 'especial', description: 'Energía' },
  { id: 'oct_24', name: 'Día Internacional contra el Cambio Climático', date: '2026-10-24', days_advance: 7, category: 'especial', description: 'Medio ambiente' },
  { id: 'oct_25', name: 'Día Mundial de la Pasta', date: '2026-10-25', days_advance: 3, category: 'consumo', description: 'Gastronomía' },
  { id: 'oct_28', name: 'Día Mundial de la Animación', date: '2026-10-28', days_advance: 7, category: 'marketing', description: 'Animación' },
  { id: 'oct_31_1', name: 'Halloween', date: '2026-10-31', days_advance: 30, category: 'festivo', description: 'Disfraces y terror' },
  { id: 'oct_31_2', name: 'Día Mundial de las Ciudades', date: '2026-10-31', days_advance: 3, category: 'especial', description: 'Urbanismo' },

  // NOVIEMBRE 2026
  { id: 'nov_01_1', name: 'Día de Todos los Santos', date: '2026-11-01', days_advance: 3, category: 'festivo', description: 'Conmemoración' },
  { id: 'nov_01_2', name: 'Día Mundial del Veganismo', date: '2026-11-01', days_advance: 7, category: 'consumo', description: 'Alimentación' },
  { id: 'nov_03', name: 'Día Mundial del Sándwich', date: '2026-11-03', days_advance: 3, category: 'consumo', description: 'Comida' },
  { id: 'nov_04_1', name: 'Día Internacional del Marketing', date: '2026-11-04', days_advance: 7, category: 'marketing', description: 'Mercadeo' },
  { id: 'nov_04_2', name: 'Día de la UNESCO', date: '2026-11-04', days_advance: 3, category: 'especial', description: 'Cultura' },
  { id: 'nov_06', name: 'Día de la Antártica Chilena', date: '2026-11-06', days_advance: 3, category: 'especial', description: 'Patrimonio' },
  { id: 'nov_10', name: 'Día Mundial de la Ciencia', date: '2026-11-10', days_advance: 3, category: 'especial', description: 'Ciencia' },
  { id: 'nov_13', name: 'Día Mundial de la Amabilidad', date: '2026-11-13', days_advance: 3, category: 'especial', description: 'Solidaridad' },
  { id: 'nov_19', name: 'Día Internacional de la Mujer Emprendedora', date: '2026-11-19', days_advance: 7, category: 'marketing', description: 'Emprendimiento' },
  { id: 'nov_21_1', name: 'Día Mundial de la Televisión', date: '2026-11-21', days_advance: 3, category: 'consumo', description: 'Entretención' },
  { id: 'nov_21_2', name: 'Día Mundial de la Pesca', date: '2026-11-21', days_advance: 3, category: 'especial', description: 'Pesca' },
  { id: 'nov_27', name: 'Black Friday', date: '2026-11-27', days_advance: 30, category: 'consumo', description: 'Grandes ofertas' },
  { id: 'nov_30_1', name: 'Día del Influencer', date: '2026-11-30', days_advance: 7, category: 'marketing', description: 'Redes sociales' },
  { id: 'nov_30_2', name: 'Cyber Monday', date: '2026-11-30', days_advance: 30, category: 'consumo', description: 'Ofertas online' },

  // DICIEMBRE 2026
  { id: 'dec_01', name: 'Día Mundial de la Lucha contra el Sida', date: '2026-12-01', days_advance: 7, category: 'especial', description: 'Salud' },
  { id: 'dec_02', name: 'Día Internacional para la Abolición de la Esclavitud', date: '2026-12-02', days_advance: 3, category: 'especial', description: 'Derechos humanos' },
  { id: 'dec_03_1', name: 'Día Internacional del Cine 3D', date: '2026-12-03', days_advance: 3, category: 'consumo', description: 'Cine' },
  { id: 'dec_03_2', name: 'Día del Médico', date: '2026-12-03', days_advance: 3, category: 'especial', description: 'Salud' },
  { id: 'dec_03_3', name: 'Día Internacional de las Personas con Discapacidad', date: '2026-12-03', days_advance: 7, category: 'especial', description: 'Inclusión' },
  { id: 'dec_04', name: 'Día de la Publicidad', date: '2026-12-04', days_advance: 7, category: 'marketing', description: 'Anuncios' },
  { id: 'dec_05', name: 'Día Mundial del Voluntariado', date: '2026-12-05', days_advance: 3, category: 'especial', description: 'Solidaridad' },
  { id: 'dec_07', name: 'Día Mundial del Algodón de Azúcar', date: '2026-12-07', days_advance: 3, category: 'consumo', description: 'Dulces' },
  { id: 'dec_09_1', name: 'Día Mundial de la Informática', date: '2026-12-09', days_advance: 7, category: 'marketing', description: 'Tecnología' },
  { id: 'dec_09_2', name: 'Día Internacional contra la Corrupción', date: '2026-12-09', days_advance: 3, category: 'especial', description: 'Transparencia' },
  { id: 'dec_10_1', name: 'Día Mundial de los Derechos Humanos', date: '2026-12-10', days_advance: 14, category: 'especial', description: 'Derechos' },
  { id: 'dec_10_2', name: 'Día Internacional de los Derechos de los Animales', date: '2026-12-10', days_advance: 3, category: 'especial', description: 'Fauna' },
  { id: 'dec_18', name: 'Día Internacional del Migrante', date: '2026-12-18', days_advance: 7, category: 'especial', description: 'Migración' },
  { id: 'dec_20', name: 'Día Internacional de la Solidaridad Humana', date: '2026-12-20', days_advance: 3, category: 'especial', description: 'Solidaridad' },
  { id: 'dec_21', name: 'Solsticio de verano', date: '2026-12-21', days_advance: 7, category: 'especial', description: 'Cambio de estación' },
  { id: 'dec_25', name: 'Día de Navidad', date: '2026-12-25', days_advance: 30, category: 'festivo', description: 'Celebración familiar' },
  { id: 'dec_28', name: 'Día de los Inocentes', date: '2026-12-28', days_advance: 3, category: 'marketing', description: 'Humor' },
  { id: 'dec_31', name: 'Fin de año', date: '2026-12-31', days_advance: 30, category: 'festivo', description: 'Celebración año nuevo' },
];

// Colores por categoría
const getCategoryColor = (category) => {
  const colors = {
    festivo: '#F59E0B',
    consumo: '#10B981',
    comercio: '#3B82F6',
    marketing: '#8B5CF6',
    especial: '#EC4899'
  };
  return colors[category] || '#6B7280';
};

async function seedEvents() {
  console.log('🚀 Insertando eventos comerciales en Supabase...');
  
  try {
    // Insertar eventos con upsert
    const eventsWithColors = events.map(event => ({
      ...event,
      color: getCategoryColor(event.category)
    }));

    const { data, error } = await supabase
      .from('commercial_events')
      .upsert(eventsWithColors, { onConflict: 'id' });

    if (error) {
      console.error('❌ Error insertando eventos:', error);
      process.exit(1);
    }

    console.log('✅ ¡180 eventos comerciales insertados exitosamente!');
    console.log(`📅 Eventos del 1 de enero al 31 de diciembre de 2026`);
    
  } catch (error) {
    console.error('❌ Error general:', error);
    process.exit(1);
  }
}

seedEvents();