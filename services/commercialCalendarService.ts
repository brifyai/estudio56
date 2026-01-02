import { supabase } from './supabaseService';

export interface CommercialEvent {
  id: string;
  name: string;
  date: string;
  days_advance: number;
  category: 'festivo' | 'consumo' | 'comercio' | 'marketing' | 'especial';
  description?: string;
  color?: string;
}

// Todos los eventos comerciales de Chile 2026 (del PDF proporcionado)
const DEFAULT_EVENTS: Omit<CommercialEvent, 'id'>[] = [
  // ENERO 2026
  { name: 'Día de Año Nuevo', date: '2026-01-01', days_advance: 7, category: 'festivo', description: 'Celebración de año nuevo' },
  { name: 'Día Mundial del Braille', date: '2026-01-04', days_advance: 3, category: 'especial', description: 'Concientización sobre accesibilidad' },
  { name: 'Día de Reyes', date: '2026-01-06', days_advance: 7, category: 'festivo', description: 'Regalos y celebraciones' },
  { name: 'Día Mundial de la Lucha contra la Depresión', date: '2026-01-13', days_advance: 3, category: 'especial', description: 'Salud mental' },
  { name: 'Día del Sticker', date: '2026-01-13', days_advance: 3, category: 'marketing', description: 'Stickers y pegatinas' },
  { name: 'Día Mundial del Chicle', date: '2026-01-13', days_advance: 3, category: 'consumo', description: 'Productos de confitería' },
  { name: 'Día Internacional de la Croqueta', date: '2026-01-16', days_advance: 3, category: 'consumo', description: 'Gastronomía' },
  { name: 'Día Mundial de la Nieve', date: '2026-01-18', days_advance: 3, category: 'festivo', description: 'Invierno y nieve' },
  { name: 'Blue Monday', date: '2026-01-19', days_advance: 3, category: 'especial', description: 'Día más triste del año' },
  { name: 'Día de las Palomitas de Maíz', date: '2026-01-19', days_advance: 3, category: 'consumo', description: 'Cine y snacks' },
  { name: 'Día Internacional del Abrazo', date: '2026-01-21', days_advance: 3, category: 'especial', description: 'Conexión emocional' },
  { name: 'Día Mundial de la Cultura Africana', date: '2026-01-24', days_advance: 3, category: 'especial', description: 'Cultura africana' },
  { name: 'Día Internacional de la Educación', date: '2026-01-24', days_advance: 3, category: 'especial', description: 'Educación y aprendizaje' },
  { name: 'Día Mundial de la Educación Ambiental', date: '2026-01-26', days_advance: 3, category: 'especial', description: 'Medio ambiente' },
  { name: 'Día Internacional del Community Manager', date: '2026-01-26', days_advance: 3, category: 'marketing', description: 'Redes sociales' },
  { name: 'Día Mundial de la Tarta de Chocolate', date: '2026-01-27', days_advance: 3, category: 'consumo', description: 'Postres y dulces' },
  { name: 'Día Internacional del Conservador Restaurador', date: '2026-01-27', days_advance: 3, category: 'especial', description: 'Arte y patrimonio' },
  { name: 'Día Internacional de la Protección de Datos', date: '2026-01-28', days_advance: 3, category: 'especial', description: 'Privacidad digital' },
  { name: 'Día Internacional del LEGO', date: '2026-01-28', days_advance: 3, category: 'consumo', description: 'Juguetes y juegos' },
  { name: 'Día Mundial por la Reducción de Emisiones', date: '2026-01-28', days_advance: 3, category: 'especial', description: 'Medio ambiente' },
  { name: 'Día Escolar de la No Violencia y la Paz', date: '2026-01-30', days_advance: 3, category: 'especial', description: 'Paz y no violencia' },
  { name: 'Día Internacional del Croissant', date: '2026-01-30', days_advance: 3, category: 'consumo', description: 'Panadería y pastelería' },
  { name: 'Día Internacional del Mago', date: '2026-01-31', days_advance: 3, category: 'especial', description: 'Ilusionismo y magia' },

  // FEBRERO 2026
  { name: 'Día de la Marmota', date: '2026-02-02', days_advance: 7, category: 'especial', description: 'Predicción del clima' },
  { name: 'Día Mundial de los Humedales', date: '2026-02-02', days_advance: 3, category: 'especial', description: 'Medio ambiente' },
  { name: 'Día Mundial contra el Cáncer', date: '2026-02-04', days_advance: 7, category: 'especial', description: 'Concientización oncológica' },
  { name: 'Día del Orgullo Zombie', date: '2026-02-04', days_advance: 3, category: 'marketing', description: 'Entretención Halloween' },
  { name: 'Aniversario de Facebook', date: '2026-02-04', days_advance: 3, category: 'marketing', description: 'Redes sociales' },
  { name: 'Día Mundial de la Nutella', date: '2026-02-05', days_advance: 3, category: 'consumo', description: 'Dulces y untables' },
  { name: 'Super Bowl', date: '2026-02-08', days_advance: 14, category: 'consumo', description: 'Deporte y comida' },
  { name: 'Día de la Piscola', date: '2026-02-08', days_advance: 3, category: 'consumo', description: 'Bebida nacional chilena' },
  { name: 'Día Mundial de la Pizza', date: '2026-02-09', days_advance: 3, category: 'consumo', description: 'Gastronomía italiana' },
  { name: 'Día Internacional de la Mujer y la Niña en la Ciencia', date: '2026-02-11', days_advance: 3, category: 'especial', description: 'Ciencia y género' },
  { name: 'Día Mundial de la Mujer Médica', date: '2026-02-11', days_advance: 3, category: 'especial', description: 'Salud y género' },
  { name: 'Día Mundial de la Radio', date: '2026-02-13', days_advance: 3, category: 'especial', description: 'Medios de comunicación' },
  { name: 'Día Mundial del Soltero', date: '2026-02-13', days_advance: 3, category: 'marketing', description: 'Compras para solteros' },
  { name: 'Día de San Valentín', date: '2026-02-14', days_advance: 14, category: 'consumo', description: 'Regalos románticos' },
  { name: 'Aniversario de YouTube', date: '2026-02-14', days_advance: 3, category: 'marketing', description: 'Video y contenido' },
  { name: 'Día Mundial del Cine', date: '2026-02-14', days_advance: 3, category: 'consumo', description: 'Entretención' },
  { name: 'Día contra el Cáncer Infantil', date: '2026-02-15', days_advance: 7, category: 'especial', description: 'Concientización infantil' },
  { name: 'Año Nuevo Chino', date: '2026-02-17', days_advance: 14, category: 'festivo', description: 'Celebración china' },
  { name: 'Día Internacional del Juego Responsable', date: '2026-02-17', days_advance: 3, category: 'especial', description: 'Juego responsable' },
  { name: 'Día contra la Homofobia en el Deporte', date: '2026-02-19', days_advance: 3, category: 'especial', description: 'Deporte e inclusión' },
  { name: 'Día Mundial de Amar a tu Mascota', date: '2026-02-20', days_advance: 3, category: 'consumo', description: 'Mascotas y accesorios' },
  { name: 'Día Mundial de la Justicia Social', date: '2026-02-20', days_advance: 3, category: 'especial', description: 'Justicia social' },
  { name: 'Día Mundial del Pistacho', date: '2026-02-26', days_advance: 3, category: 'consumo', description: 'Frutos secos' },
  { name: 'Día Mundial de las ONG', date: '2026-02-27', days_advance: 3, category: 'especial', description: 'Organizaciones' },
  { name: 'Día Mundial de las Enfermedades Raras', date: '2026-02-28', days_advance: 3, category: 'especial', description: 'Salud' },

  // MARZO 2026
  { name: 'Día de la Cero Discriminación', date: '2026-03-01', days_advance: 3, category: 'especial', description: 'Inclusión' },
  { name: 'Día Mundial de la Vida Silvestre', date: '2026-03-03', days_advance: 3, category: 'especial', description: 'Naturaleza' },
  { name: 'Día de la Abstinencia Digital', date: '2026-03-05', days_advance: 3, category: 'especial', description: 'Desconexión digital' },
  { name: 'Día Internacional de la Mujer', date: '2026-03-08', days_advance: 14, category: 'especial', description: 'Mujer y equidad' },
  { name: 'Día Internacional del DJ', date: '2026-03-09', days_advance: 3, category: 'marketing', description: 'Música electrónica' },
  { name: 'Día de Mario Bros', date: '2026-03-10', days_advance: 3, category: 'consumo', description: 'Videojuegos' },
  { name: 'Día Internacional de los Tuiteros', date: '2026-03-12', days_advance: 3, category: 'marketing', description: 'Redes sociales' },
  { name: 'Día Mundial de los Derechos del Consumidor', date: '2026-03-15', days_advance: 7, category: 'consumo', description: 'Derechos del consumidor' },
  { name: 'Día de San Patricio', date: '2026-03-17', days_advance: 7, category: 'festivo', description: 'Celebración irlandesa' },
  { name: 'Día Internacional de la Felicidad', date: '2026-03-20', days_advance: 3, category: 'especial', description: 'Bienestar' },
  { name: 'Equinoccio de otoño', date: '2026-03-20', days_advance: 7, category: 'especial', description: 'Cambio de estación' },
  { name: 'Día Mundial de la Poesía', date: '2026-03-21', days_advance: 3, category: 'especial', description: 'Poesía y literatura' },
  { name: 'Día Mundial del Síndrome de Down', date: '2026-03-21', days_advance: 3, category: 'especial', description: 'Inclusión' },
  { name: 'Aniversario de X (Twitter)', date: '2026-03-21', days_advance: 3, category: 'marketing', description: 'Redes sociales' },
  { name: 'Día del Tiramisú', date: '2026-03-21', days_advance: 3, category: 'consumo', description: 'Postres italianos' },
  { name: 'Día Internacional de los Bosques', date: '2026-03-21', days_advance: 3, category: 'especial', description: 'Medio ambiente' },
  { name: 'Día Mundial del Agua', date: '2026-03-22', days_advance: 7, category: 'especial', description: 'Recursos hídricos' },
  { name: 'Día Meteorológico Mundial', date: '2026-03-23', days_advance: 3, category: 'especial', description: 'Clima' },
  { name: 'Día Mundial del Clima', date: '2026-03-26', days_advance: 3, category: 'especial', description: 'Cambio climático' },
  { name: 'Día Mundial del Teatro', date: '2026-03-27', days_advance: 7, category: 'especial', description: 'Artes escénicas' },
  { name: 'Día Internacional del Queso', date: '2026-03-27', days_advance: 3, category: 'consumo', description: 'Lácteos' },
  { name: 'La Hora del Planeta', date: '2026-03-28', days_advance: 7, category: 'especial', description: 'Sostenibilidad' },

  // ABRIL 2026
  { name: 'Día Mundial de Concienciación sobre el Autismo', date: '2026-04-02', days_advance: 7, category: 'especial', description: 'Inclusión' },
  { name: 'Día Mundial de la Gelatina', date: '2026-04-02', days_advance: 3, category: 'consumo', description: 'Postres' },
  { name: 'Día Mundial del Arcoíris', date: '2026-04-03', days_advance: 3, category: 'especial', description: 'Diversidad' },
  { name: 'Día Mundial de la Actividad Física', date: '2026-04-06', days_advance: 7, category: 'especial', description: 'Deporte y salud' },
  { name: 'Día Mundial de la Salud', date: '2026-04-07', days_advance: 7, category: 'especial', description: 'Salud mundial' },
  { name: 'Día Mundial del Parkinson', date: '2026-04-11', days_advance: 3, category: 'especial', description: 'Salud' },
  { name: 'Día Internacional del Beso', date: '2026-04-13', days_advance: 3, category: 'marketing', description: 'Amor y relaciones' },
  { name: 'Día Mundial del Scrabble', date: '2026-04-13', days_advance: 3, category: 'consumo', description: 'Juegos de mesa' },
  { name: 'Día de las Américas', date: '2026-04-14', days_advance: 7, category: 'festivo', description: 'Unidad americana' },
  { name: 'Día Mundial del Arte', date: '2026-04-15', days_advance: 7, category: 'especial', description: 'Arte y cultura' },
  { name: 'Día Mundial del Emprendimiento', date: '2026-04-16', days_advance: 7, category: 'marketing', description: 'Emprendedores' },
  { name: 'Día Internacional de los Monumentos y Sitios', date: '2026-04-18', days_advance: 3, category: 'especial', description: 'Patrimonio' },
  { name: 'Día Mundial de los Simpson', date: '2026-04-19', days_advance: 3, category: 'marketing', description: 'Entretención' },
  { name: 'Día Mundial de la Creatividad', date: '2026-04-21', days_advance: 3, category: 'especial', description: 'Innovación' },
  { name: 'Día Mundial de la Tierra', date: '2026-04-22', days_advance: 14, category: 'especial', description: 'Medio ambiente' },
  { name: 'Día Internacional del Libro', date: '2026-04-23', days_advance: 7, category: 'consumo', description: 'Literatura' },
  { name: 'Aniversario de Metricool', date: '2026-04-25', days_advance: 3, category: 'marketing', description: 'Redes sociales' },
  { name: 'Día Mundial de la Propiedad Intelectual', date: '2026-04-26', days_advance: 3, category: 'especial', description: 'Innovación' },
  { name: 'Día Mundial del Diseño Gráfico', date: '2026-04-27', days_advance: 7, category: 'marketing', description: 'Diseño' },
  { name: 'Día Mundial de la Seguridad y Salud en el Trabajo', date: '2026-04-28', days_advance: 3, category: 'especial', description: 'Trabajo seguro' },
  { name: 'Día Internacional de la Danza', date: '2026-04-29', days_advance: 7, category: 'especial', description: 'Artes escénicas' },
  { name: 'Día Internacional del Jazz', date: '2026-04-30', days_advance: 7, category: 'especial', description: 'Música' },

  // MAYO 2026
  { name: 'Día del Trabajo', date: '2026-05-01', days_advance: 7, category: 'festivo', description: 'Trabajo y derechos' },
  { name: 'Día Internacional Contra el Acoso Escolar', date: '2026-05-02', days_advance: 3, category: 'especial', description: 'Educación segura' },
  { name: 'Día Mundial de la Libertad de Prensa', date: '2026-05-03', days_advance: 3, category: 'especial', description: 'Periodismo' },
  { name: 'Día Mundial de la Risa', date: '2026-05-03', days_advance: 3, category: 'especial', description: 'Bienestar' },
  { name: 'Día de Star Wars', date: '2026-05-04', days_advance: 7, category: 'marketing', description: 'Entretención' },
  { name: 'Aniversario de LinkedIn', date: '2026-05-05', days_advance: 3, category: 'marketing', description: 'Profesional' },
  { name: 'Día Mundial de la Cruz Roja', date: '2026-05-08', days_advance: 7, category: 'especial', description: 'Solidaridad' },
  { name: 'Día de la Madre', date: '2026-05-10', days_advance: 14, category: 'consumo', description: 'Regalos para mamá' },
  { name: 'Día Internacional del Hummus', date: '2026-05-13', days_advance: 3, category: 'consumo', description: 'Gastronomía' },
  { name: 'Día Nacional del Pisco', date: '2026-05-15', days_advance: 7, category: 'consumo', description: 'Bebida nacional' },
  { name: 'Día Internacional de las Familias', date: '2026-05-15', days_advance: 3, category: 'especial', description: 'Familia' },
  { name: 'Día Internacional de la Luz', date: '2026-05-16', days_advance: 3, category: 'especial', description: 'Ciencia' },
  { name: 'Día Mundial del Heavy Metal', date: '2026-05-16', days_advance: 3, category: 'marketing', description: 'Música' },
  { name: 'Día Mundial de Internet', date: '2026-05-17', days_advance: 7, category: 'marketing', description: 'Digital' },
  { name: 'Día contra la Homofobia', date: '2026-05-17', days_advance: 3, category: 'especial', description: 'Inclusión' },
  { name: 'Día Mundial del Reciclaje', date: '2026-05-17', days_advance: 3, category: 'especial', description: 'Medio ambiente' },
  { name: 'Día Mundial de la Repostería', date: '2026-05-17', days_advance: 3, category: 'consumo', description: 'Postres' },
  { name: 'Día Internacional de los Museos', date: '2026-05-18', days_advance: 7, category: 'especial', description: 'Cultura' },
  { name: 'Día Mundial de la Diversidad Cultural', date: '2026-05-21', days_advance: 3, category: 'especial', description: 'Cultura' },
  { name: 'Día Internacional del Té', date: '2026-05-21', days_advance: 3, category: 'consumo', description: 'Bebidas' },
  { name: 'Día Mundial del Pac-Man', date: '2026-05-22', days_advance: 3, category: 'consumo', description: 'Videojuegos' },
  { name: 'Día del Orgullo Friki', date: '2026-05-25', days_advance: 7, category: 'marketing', description: 'Cultura geek' },
  { name: 'Día Mundial de la Hamburguesa', date: '2026-05-28', days_advance: 7, category: 'consumo', description: 'Comida rápida' },
  { name: 'Día Mundial sin Tabaco', date: '2026-05-31', days_advance: 7, category: 'especial', description: 'Salud' },

  // JUNIO 2026
  { name: 'Día Mundial de las Madres y los Padres', date: '2026-06-01', days_advance: 3, category: 'especial', description: 'Familia' },
  { name: 'Día Mundial de los Arrecifes', date: '2026-06-01', days_advance: 3, category: 'especial', description: 'Medio ambiente' },
  { name: 'Día Mundial de la Bicicleta', date: '2026-06-03', days_advance: 7, category: 'especial', description: 'Deporte' },
  { name: 'Día Mundial del Running', date: '2026-06-03', days_advance: 3, category: 'consumo', description: 'Deporte' },
  { name: 'Día Mundial del Medio Ambiente', date: '2026-06-05', days_advance: 14, category: 'especial', description: 'Medio ambiente' },
  { name: 'Día Mundial de los Océanos', date: '2026-06-08', days_advance: 7, category: 'especial', description: 'Medio ambiente' },
  { name: 'Día Mundial del Donante de Sangre', date: '2026-06-14', days_advance: 7, category: 'especial', description: 'Salud' },
  { name: 'Día Internacional del Sushi', date: '2026-06-18', days_advance: 3, category: 'consumo', description: 'Gastronomía japonesa' },
  { name: 'Yellow Day', date: '2026-06-20', days_advance: 7, category: 'marketing', description: 'Día más feliz' },
  { name: 'Día Internacional del Surf', date: '2026-06-20', days_advance: 3, category: 'consumo', description: 'Deportes náuticos' },
  { name: 'Día Mundial del Refugiado', date: '2026-06-20', days_advance: 3, category: 'especial', description: 'Solidaridad' },
  { name: 'Día del Padre', date: '2026-06-21', days_advance: 14, category: 'consumo', description: 'Regalos para papá' },
  { name: 'Solsticio de invierno', date: '2026-06-21', days_advance: 7, category: 'especial', description: 'Cambio de estación' },
  { name: 'Día Mundial del Selfie', date: '2026-06-21', days_advance: 3, category: 'marketing', description: 'Redes sociales' },
  { name: 'Día Internacional del Yoga', date: '2026-06-21', days_advance: 7, category: 'consumo', description: 'Bienestar' },
  { name: 'Día Nacional de los Pueblos Indígenas', date: '2026-06-21', days_advance: 3, category: 'especial', description: 'Cultura' },
  { name: 'Día de la Preservación de Bosques Tropicales', date: '2026-06-26', days_advance: 3, category: 'especial', description: 'Medio ambiente' },
  { name: 'Día del Árbol', date: '2026-06-28', days_advance: 3, category: 'especial', description: 'Medio ambiente' },
  { name: 'Día Internacional del Orgullo LGBTQIA+', date: '2026-06-28', days_advance: 14, category: 'especial', description: 'Diversidad' },
  { name: 'Día de las Redes Sociales', date: '2026-06-30', days_advance: 7, category: 'marketing', description: 'Digital' },

  // JULIO 2026
  { name: 'Día Internacional del Chiste', date: '2026-07-01', days_advance: 3, category: 'especial', description: 'Humor' },
  { name: 'Día Internacional del Reggae', date: '2026-07-01', days_advance: 3, category: 'marketing', description: 'Música' },
  { name: 'Día Internacional del OVNI', date: '2026-07-02', days_advance: 3, category: 'marketing', description: 'Misterio' },
  { name: 'Día Internacional Libre de Bolsas de Plástico', date: '2026-07-03', days_advance: 3, category: 'especial', description: 'Medio ambiente' },
  { name: 'Día Mundial del eBook', date: '2026-07-04', days_advance: 3, category: 'consumo', description: 'Lectura digital' },
  { name: 'Día Mundial del Cacao', date: '2026-07-07', days_advance: 3, category: 'consumo', description: 'Chocolate' },
  { name: 'Día de la Bandera', date: '2026-07-09', days_advance: 7, category: 'festivo', description: 'Patriotismo' },
  { name: 'Día Mundial de la Población', date: '2026-07-11', days_advance: 3, category: 'especial', description: 'Demografía' },
  { name: 'Día Mundial del Rock', date: '2026-07-13', days_advance: 7, category: 'marketing', description: 'Música' },
  { name: 'Día Mundial del Emoji', date: '2026-07-17', days_advance: 3, category: 'marketing', description: 'Comunicación' },
  { name: 'Día Internacional de Nelson Mandela', date: '2026-07-18', days_advance: 3, category: 'especial', description: 'Liderazgo' },
  { name: 'Día Internacional de la Luna', date: '2026-07-20', days_advance: 3, category: 'especial', description: 'Espacio' },
  { name: 'Día Mundial del Perro', date: '2026-07-21', days_advance: 7, category: 'consumo', description: 'Mascotas' },
  { name: 'Día Mundial del Cerebro', date: '2026-07-22', days_advance: 3, category: 'especial', description: 'Salud' },
  { name: 'Día de los Abuelos', date: '2026-07-26', days_advance: 7, category: 'consumo', description: 'Familia' },
  { name: 'Día Internacional de la Amistad', date: '2026-07-30', days_advance: 7, category: 'marketing', description: 'Relaciones' },
  { name: 'Día Mundial contra la Trata de Personas', date: '2026-07-30', days_advance: 3, category: 'especial', description: 'Derechos humanos' },

  // AGOSTO 2026
  { name: 'Día de la Pachamama', date: '2026-08-01', days_advance: 3, category: 'especial', description: 'Naturaleza' },
  { name: 'Día Nacional de la Miel', date: '2026-08-06', days_advance: 3, category: 'consumo', description: 'Productos naturales' },
  { name: 'Día Internacional de la Cerveza', date: '2026-08-07', days_advance: 7, category: 'consumo', description: 'Bebidas' },
  { name: 'Día Internacional del Gato', date: '2026-08-08', days_advance: 7, category: 'consumo', description: 'Mascotas' },
  { name: 'Día Internacional del Coworking', date: '2026-08-09', days_advance: 3, category: 'marketing', description: 'Trabajo' },
  { name: 'Día Mundial del León', date: '2026-08-10', days_advance: 3, category: 'especial', description: 'Fauna' },
  { name: 'Día Internacional de la Juventud', date: '2026-08-12', days_advance: 7, category: 'especial', description: 'Juventud' },
  { name: 'Día Internacional del Disco de Vinilo', date: '2026-08-12', days_advance: 3, category: 'consumo', description: 'Música' },
  { name: 'Día Internacional de los Zurdos', date: '2026-08-13', days_advance: 3, category: 'especial', description: 'Lateralidad' },
  { name: 'Día Mundial de la Relajación', date: '2026-08-15', days_advance: 3, category: 'especial', description: 'Bienestar' },
  { name: 'Día Mundial del Peatón', date: '2026-08-17', days_advance: 3, category: 'especial', description: 'Seguridad vial' },
  { name: 'Día Mundial de la Fotografía', date: '2026-08-19', days_advance: 7, category: 'marketing', description: 'Imagen' },
  { name: 'Día Mundial de la Asistencia Humanitaria', date: '2026-08-19', days_advance: 3, category: 'especial', description: 'Solidaridad' },
  { name: 'Día Mundial del Folclore', date: '2026-08-22', days_advance: 3, category: 'especial', description: 'Cultura' },
  { name: 'Día Mundial del Hashtag', date: '2026-08-23', days_advance: 3, category: 'marketing', description: 'Redes sociales' },
  { name: 'Día del Internauta', date: '2026-08-23', days_advance: 3, category: 'marketing', description: 'Internet' },
  { name: 'Día Internacional de la Actriz y del Actor', date: '2026-08-26', days_advance: 3, category: 'marketing', description: 'Cine' },
  { name: 'Día Mundial del Gamer', date: '2026-08-29', days_advance: 7, category: 'consumo', description: 'Videojuegos' },

  // SEPTIEMBRE 2026
  { name: 'Día Mundial del Hermano', date: '2026-09-05', days_advance: 3, category: 'especial', description: 'Familia' },
  { name: 'Día de los Programadores', date: '2026-09-13', days_advance: 7, category: 'marketing', description: 'Tecnología' },
  { name: 'Día Internacional del Chocolate', date: '2026-09-13', days_advance: 7, category: 'consumo', description: 'Dulces' },
  { name: 'Día del Huaso y de la Chilenidad', date: '2026-09-17', days_advance: 7, category: 'festivo', description: 'Cultura chilena' },
  { name: 'Día de la Igualdad Salarial', date: '2026-09-18', days_advance: 3, category: 'especial', description: 'Equidad' },
  { name: 'Día de la Independencia y Fiestas Patrias', date: '2026-09-18', days_advance: 30, category: 'festivo', description: 'Fiesta nacional' },
  { name: 'Día Mundial de las Playas', date: '2026-09-19', days_advance: 3, category: 'especial', description: 'Medio ambiente' },
  { name: 'Día Mundial del Alzheimer', date: '2026-09-21', days_advance: 7, category: 'especial', description: 'Salud' },
  { name: 'Equinoccio de primavera', date: '2026-09-22', days_advance: 7, category: 'especial', description: 'Cambio de estación' },
  { name: 'Día Mundial Sin Coche', date: '2026-09-22', days_advance: 3, category: 'especial', description: 'Medio ambiente' },
  { name: 'Día Nacional de la Lengua de Señas', date: '2026-09-23', days_advance: 3, category: 'especial', description: 'Inclusión' },
  { name: 'Día Mundial de Investigación contra el Cáncer', date: '2026-09-24', days_advance: 3, category: 'especial', description: 'Salud' },
  { name: 'Aniversario de Google', date: '2026-09-27', days_advance: 3, category: 'marketing', description: 'Tecnología' },
  { name: 'Día Mundial del Turismo', date: '2026-09-27', days_advance: 14, category: 'consumo', description: 'Viajes' },
  { name: 'Día Internacional de las Personas Sordas', date: '2026-09-27', days_advance: 3, category: 'especial', description: 'Inclusión' },
  { name: 'Día Mundial del Corazón', date: '2026-09-29', days_advance: 7, category: 'especial', description: 'Salud' },
  { name: 'Día Internacional del Pódcast', date: '2026-09-30', days_advance: 3, category: 'marketing', description: 'Audio' },

  // OCTUBRE 2026
  { name: 'Día Internacional del Café', date: '2026-10-01', days_advance: 7, category: 'consumo', description: 'Bebidas' },
  { name: 'Día Internacional de las Personas de Edad', date: '2026-10-01', days_advance: 3, category: 'especial', description: 'Adultos mayores' },
  { name: 'Día Mundial de la No Violencia', date: '2026-10-02', days_advance: 3, category: 'especial', description: 'Paz' },
  { name: 'Día Mundial de la Sonrisa', date: '2026-10-02', days_advance: 3, category: 'marketing', description: 'Bienestar' },
  { name: 'Día Mundial de los Animales', date: '2026-10-04', days_advance: 7, category: 'especial', description: 'Fauna' },
  { name: 'Día Mundial de los Docentes', date: '2026-10-05', days_advance: 7, category: 'especial', description: 'Educación' },
  { name: 'Aniversario de Instagram', date: '2026-10-06', days_advance: 7, category: 'marketing', description: 'Redes sociales' },
  { name: 'Día Mundial del Huevo', date: '2026-10-09', days_advance: 3, category: 'consumo', description: 'Alimentación' },
  { name: 'Día Mundial de la Salud Mental', date: '2026-10-10', days_advance: 7, category: 'especial', description: 'Salud mental' },
  { name: 'Día Internacional de la Niña', date: '2026-10-11', days_advance: 3, category: 'especial', description: 'Infancia' },
  { name: 'Día Internacional para la Erradicación de la Pobreza', date: '2026-10-17', days_advance: 3, category: 'especial', description: 'Solidaridad' },
  { name: 'Día Mundial de la Lucha contra el Cáncer de Mama', date: '2026-10-19', days_advance: 14, category: 'especial', description: 'Salud' },
  { name: 'Día Internacional del Chef', date: '2026-10-20', days_advance: 7, category: 'consumo', description: 'Gastronomía' },
  { name: 'Día Mundial del Ahorro de Energía', date: '2026-10-21', days_advance: 3, category: 'especial', description: 'Energía' },
  { name: 'Día Internacional contra el Cambio Climático', date: '2026-10-24', days_advance: 7, category: 'especial', description: 'Medio ambiente' },
  { name: 'Día Mundial de la Pasta', date: '2026-10-25', days_advance: 3, category: 'consumo', description: 'Gastronomía' },
  { name: 'Día Mundial de la Animación', date: '2026-10-28', days_advance: 7, category: 'marketing', description: 'Animación' },
  { name: 'Halloween', date: '2026-10-31', days_advance: 30, category: 'festivo', description: 'Disfraces y terror' },
  { name: 'Día Mundial de las Ciudades', date: '2026-10-31', days_advance: 3, category: 'especial', description: 'Urbanismo' },

  // NOVIEMBRE 2026
  { name: 'Día de Todos los Santos', date: '2026-11-01', days_advance: 3, category: 'festivo', description: 'Conmemoración' },
  { name: 'Día Mundial del Veganismo', date: '2026-11-01', days_advance: 7, category: 'consumo', description: 'Alimentación' },
  { name: 'Día Mundial del Sándwich', date: '2026-11-03', days_advance: 3, category: 'consumo', description: 'Comida' },
  { name: 'Día Internacional del Marketing', date: '2026-11-04', days_advance: 7, category: 'marketing', description: 'Mercadeo' },
  { name: 'Día de la UNESCO', date: '2026-11-04', days_advance: 3, category: 'especial', description: 'Cultura' },
  { name: 'Día de la Antártica Chilena', date: '2026-11-06', days_advance: 3, category: 'especial', description: 'Patrimonio' },
  { name: 'Día Mundial de la Ciencia', date: '2026-11-10', days_advance: 3, category: 'especial', description: 'Ciencia' },
  { name: 'Día Mundial de la Amabilidad', date: '2026-11-13', days_advance: 3, category: 'especial', description: 'Solidaridad' },
  { name: 'Día Internacional de la Mujer Emprendedora', date: '2026-11-19', days_advance: 7, category: 'marketing', description: 'Emprendimiento' },
  { name: 'Día Mundial de la Televisión', date: '2026-11-21', days_advance: 3, category: 'consumo', description: 'Entretención' },
  { name: 'Día Mundial de la Pesca', date: '2026-11-21', days_advance: 3, category: 'especial', description: 'Pesca' },
  { name: 'Black Friday', date: '2026-11-27', days_advance: 30, category: 'consumo', description: 'Grandes ofertas' },
  { name: 'Día del Influencer', date: '2026-11-30', days_advance: 7, category: 'marketing', description: 'Redes sociales' },
  { name: 'Cyber Monday', date: '2026-11-30', days_advance: 30, category: 'consumo', description: 'Ofertas online' },

  // DICIEMBRE 2026
  { name: 'Día Mundial de la Lucha contra el Sida', date: '2026-12-01', days_advance: 7, category: 'especial', description: 'Salud' },
  { name: 'Día Internacional para la Abolición de la Esclavitud', date: '2026-12-02', days_advance: 3, category: 'especial', description: 'Derechos humanos' },
  { name: 'Día Internacional del Cine 3D', date: '2026-12-03', days_advance: 3, category: 'consumo', description: 'Cine' },
  { name: 'Día del Médico', date: '2026-12-03', days_advance: 3, category: 'especial', description: 'Salud' },
  { name: 'Día Internacional de las Personas con Discapacidad', date: '2026-12-03', days_advance: 7, category: 'especial', description: 'Inclusión' },
  { name: 'Día de la Publicidad', date: '2026-12-04', days_advance: 7, category: 'marketing', description: 'Anuncios' },
  { name: 'Día Mundial del Voluntariado', date: '2026-12-05', days_advance: 3, category: 'especial', description: 'Solidaridad' },
  { name: 'Día Mundial del Algodón de Azúcar', date: '2026-12-07', days_advance: 3, category: 'consumo', description: 'Dulces' },
  { name: 'Día Mundial de la Informática', date: '2026-12-09', days_advance: 7, category: 'marketing', description: 'Tecnología' },
  { name: 'Día Internacional contra la Corrupción', date: '2026-12-09', days_advance: 3, category: 'especial', description: 'Transparencia' },
  { name: 'Día Mundial de los Derechos Humanos', date: '2026-12-10', days_advance: 14, category: 'especial', description: 'Derechos' },
  { name: 'Día Internacional de los Derechos de los Animales', date: '2026-12-10', days_advance: 3, category: 'especial', description: 'Fauna' },
  { name: 'Día Internacional del Migrante', date: '2026-12-18', days_advance: 7, category: 'especial', description: 'Migración' },
  { name: 'Día Internacional de la Solidaridad Humana', date: '2026-12-20', days_advance: 3, category: 'especial', description: 'Solidaridad' },
  { name: 'Solsticio de verano', date: '2026-12-21', days_advance: 7, category: 'especial', description: 'Cambio de estación' },
  { name: 'Día de Navidad', date: '2026-12-25', days_advance: 30, category: 'festivo', description: 'Celebración familiar' },
  { name: 'Día de los Inocentes', date: '2026-12-28', days_advance: 3, category: 'marketing', description: 'Humor' },
  { name: 'Fin de año', date: '2026-12-31', days_advance: 30, category: 'festivo', description: 'Celebración año nuevo' },
];

// Obtener eventos desde Supabase o usar defaults
export const getCommercialEvents = async (): Promise<CommercialEvent[]> => {
  try {
    const { data, error } = await supabase
      .from('commercial_events')
      .select('*')
      .order('date', { ascending: true });

    if (error) {
      console.log('⚠️ Error cargando eventos de Supabase, usando defaults:', error.message);
      return getDefaultEvents();
    }

    if (data && data.length > 0) {
      console.log('✅ Eventos cargados desde Supabase:', data.length);
      return data as CommercialEvent[];
    }

    return getDefaultEvents();
  } catch (error) {
    console.log('⚠️ Excepción cargando eventos, usando defaults:', error);
    return getDefaultEvents();
  }
};

// Convertir defaults a eventos con IDs
const getDefaultEvents = (): CommercialEvent[] => {
  return DEFAULT_EVENTS.map((event, index) => ({
    ...event,
    id: `default_${index}`,
    color: getCategoryColor(event.category)
  }));
};

const getCategoryColor = (category: string): string => {
  const colors: Record<string, string> = {
    festivo: '#F59E0B',
    consumo: '#10B981',
    comercio: '#3B82F6',
    marketing: '#8B5CF6',
    especial: '#EC4899'
  };
  return colors[category] || '#6B7280';
};

// Obtener eventos próximos (próximos N días)
export const getUpcomingEvents = (events: CommercialEvent[], days: number): CommercialEvent[] => {
  const today = new Date();
  const futureDate = new Date(today.getTime() + days * 24 * 60 * 60 * 1000);
  
  return events.filter(event => {
    const eventDate = new Date(event.date);
    return eventDate >= today && eventDate <= futureDate;
  }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

// Obtener eventos activos (dentro del período de alerta)
export const getActiveAlertEvents = (events: CommercialEvent[]): CommercialEvent[] => {
  const today = new Date();
  
  return events.filter(event => {
    const eventDate = new Date(event.date);
    const alertDate = new Date(eventDate.getTime() - event.days_advance * 24 * 60 * 60 * 1000);
    return today >= alertDate && today <= eventDate;
  });
};

// Obtener días restantes para un evento
export const getDaysUntilEvent = (eventDate: string): number => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const event = new Date(eventDate);
  event.setHours(0, 0, 0, 0);
  
  const diffTime = event.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Insertar eventos por defecto en Supabase
export const seedDefaultEvents = async (): Promise<void> => {
  try {
    const { error } = await supabase
      .from('commercial_events')
      .upsert(
        DEFAULT_EVENTS.map((event, index) => ({
          ...event,
          id: `default_${index}`,
          color: getCategoryColor(event.category)
        })),
        { onConflict: 'id' }
      );

    if (error) {
      console.error('❌ Error insertando eventos por defecto:', error);
    } else {
      console.log('✅ Eventos por defecto insertados');
    }
  } catch (error) {
    console.error('❌ Excepción insertando eventos:', error);
  }
};