export interface HolidayMetadata {
  description: string;
  image: string;
  facts: string[];
  activities: string[];
}

export const HOLIDAY_METADATA: Record<string, HolidayMetadata> = {
  'Año Nuevo': {
    description:
      'Celebración del inicio del calendario gregoriano. En Colombia se acostumbra celebrar con cenas familiares, uvas y quema de muñecos de "Año Viejo".',
    image: 'assets/banners/andres-gomez-h9nFGYFUiAo-unsplash.avif',
    facts: [
      'Es un día festivo oficial en casi todo el mundo.',
      'En Colombia, muchas familias realizan "agüeros" como correr con una maleta para viajar.',
    ],
    activities: ['Cena familiar', 'Quema del Año Viejo', 'Espectáculos de fuegos artificiales'],
  },
  'Epifanía (Reyes Magos)': {
    description:
      'Conmemora la visita de los Reyes Magos al niño Jesús. Es el cierre tradicional de las festividades navideñas.',
    image: 'assets/banners/reyes.avif',
    facts: [
      'En Colombia, si cae en otro día, se traslada al lunes siguiente (Ley Emiliani).',
      'Es tradicional regalar dulces o pequeños detalles.',
    ],
    activities: ['Reuniones familiares', 'Consumo de platos típicos navideños restantes'],
  },
  'Día de San José': {
    description:
      'Homenaje a San José, esposo de la Virgen María. También se celebra el Día del Hombre en Colombia.',
    image: 'assets/banners/san_jose.avif',
    facts: [
      'San José es considerado el patrono de los trabajadores.',
      'Es un día para reconocer el papel de los padres y figuras masculinas.',
    ],
    activities: ['Celebraciones religiosas', 'Homenajes en colegios y empresas'],
  },
  'Jueves Santo': {
    description: 'Conmemora la Última Cena de Jesús con sus apóstoles y el lavatorio de los pies.',
    image: 'assets/banners/jueves_santo.avif',
    facts: [
      'Es parte fundamental de la Semana Santa.',
      'Muchos colombianos visitan los siete templos.',
    ],
    activities: ['Visita a monumentos', 'Procesiones religiosas'],
  },
  'Viernes Santo': {
    description: 'Día de reflexión y respeto que conmemora la pasión y muerte de Jesús en la cruz.',
    image: 'assets/banners/viernes_santo.avif',
    facts: [
      'Se guarda abstinencia de carnes rojas.',
      'Es el día de mayor recogimiento en la Semana Santa colombiana.',
    ],
    activities: ['Viacrucis', 'Participación en el Sermón de las Siete Palabras'],
  },
  'Día del trabajo': {
    description:
      'Homenaje a los movimientos obreros que lucharon por mejores condiciones laborales.',
    image: 'assets/banners/trabajo.avif',
    facts: [
      'Se celebra internacionalmente el 1 de mayo.',
      'Es un día de descanso remunerado para todos los sectores.',
    ],
    activities: ['Marchas y concentraciones sindicales', 'Descanso y recreación'],
  },
  'Ascención de Jesús': {
    description: 'Celebra la ascensión de Jesucristo al cielo, 40 días después de su resurrección.',
    image: 'assets/banners/ascension.avif',
    facts: [
      'En Colombia se traslada al lunes siguiente.',
      'Es una de las festividades cristianas más antiguas.',
    ],
    activities: ['Misas solemnes', 'Paseos familiares'],
  },
  'Corpus Christi': {
    description: 'Festividad destinada a celebrar la presencia de Cristo en la Eucaristía.',
    image: 'assets/banners/corpus.avif',
    facts: [
      'Se celebra 60 días después del Domingo de Resurrección.',
      'En Anolaima (Cundinamarca) se celebra con grandes arreglos de frutas.',
    ],
    activities: ['Celebraciones eucarísticas', 'Festivales regionales'],
  },
  'Sagrado corazón de Jesús': {
    description:
      'Devoción referida al corazón físico de Jesús de Nazaret como símbolo de amor divino.',
    image: 'assets/banners/ricardo-gomez-angel-L6T_6Rp2iEk-unsplash.avif',
    facts: [
      'Colombia fue consagrada al Sagrado Corazón en 1902.',
      'Es una devoción muy arraigada en la cultura paisa y del centro del país.',
    ],
    activities: ['Actos litúrgicos', 'Renovación de la consagración familiar'],
  },
  'San Pedro y San Pablo': {
    description: 'Homenaje a los dos apóstoles pilares de la Iglesia Católica.',
    image: 'assets/banners/ricardo-gomez-angel-L6T_6Rp2iEk-unsplash.avif',
    facts: [
      'Coincide con las famosas fiestas del San Pedro en el Huila y Tolima.',
      'Es uno de los puentes festivos más importantes del año.',
    ],
    activities: ['Festivales folclóricos', 'Reinados y cabalgatas'],
  },
  'Día de la Virgen de Chiquinquirá': {
    description:
      'Celebra la devoción a Nuestra Señora del Rosario de Chiquinquirá, patrona de Colombia. La imagen original reposa en la Basílica de Chiquinquirá (Boyacá) y es centro de peregrinación nacional.',
    image: 'assets/banners/chiquinquira.avif',
    facts: [
      'Declarada patrona de Colombia por el Papa Benedicto XV en 1919.',
      'El milagro de la renovación de la imagen ocurrió el 26 de diciembre de 1586.',
    ],
    activities: [
      'Peregrinación a la Basílica de Chiquinquirá',
      'Misas y celebraciones religiosas',
      'Feria artesanal y cultural en Boyacá',
    ],
  },
  'Día de la independencia': {
    description: 'Conmemora el grito de independencia de Colombia del Imperio Español en 1810.',
    image: 'assets/banners/independencia.avif',
    facts: [
      'Es el día nacional de Colombia.',
      'El suceso del "Florero de Llorente" fue el detonante.',
    ],
    activities: ['Desfiles militares', 'Actos patriatícos', 'Izar la bandera'],
  },
  'Batalla de Boyacá': {
    description:
      'Conmemora la victoria definitiva del ejército libertador sobre las tropas realistas en 1819.',
    image: 'assets/banners/boyaca.avif',
    facts: ['Es el día del Ejército Nacional.', 'Ocurrió en el Puente de Boyacá.'],
    activities: ['Desfiles patrióticos', 'Visitas al Puente de Boyacá'],
  },
  'Asunción de la Virgen': {
    description: 'Celebra la asunción del cuerpo y el alma de la Virgen María al cielo.',
    image: 'assets/banners/ricardo-gomez-angel-L6T_6Rp2iEk-unsplash.avif',
    facts: ['Es dogma de fe desde 1950.', 'Es una de las festividades marianas más importantes.'],
    activities: ['Procesiones marianas', 'Misas solemnes'],
  },
  'Día de la raza': {
    description: 'Conmemora el descubrimiento de América y el encuentro de diversas culturas.',
    image: 'assets/banners/ricardo-gomez-angel-L6T_6Rp2iEk-unsplash.avif',
    facts: [
      'Ahora también se conoce como el Día de la Diversidad Étnica y Cultural.',
      'Se celebra el 12 de octubre o el lunes siguiente.',
    ],
    activities: ['Actos educativos en colegios', 'Eventos culturales de diversidad'],
  },
  'Todos los santos': {
    description: 'Día dedicado a todos los santos conocidos y desconocidos que están en el cielo.',
    image: 'assets/banners/ricardo-gomez-angel-L6T_6Rp2iEk-unsplash.avif',
    facts: [
      'Sigue a la celebración de Halloween (noche anterior).',
      'Es un día de recogimiento y oración por los difuntos.',
    ],
    activities: ['Visita a cementerios', 'Encendido de velas por seres queridos'],
  },
  'Independencia de Cartagena': {
    description: 'Conmemora la declaración de Cartagena como estado libre e independiente en 1811.',
    image: 'assets/banners/ricardo-gomez-angel-L6T_6Rp2iEk-unsplash.avif',
    facts: [
      'Cartagena fue la primera ciudad en declararse totalmente independiente.',
      'Se celebra con el Reinado Nacional de la Belleza.',
    ],
    activities: ['Desfiles de carrozas', 'Eventos culturales en Cartagena'],
  },
  'Inmaculada concepción': {
    description:
      'Celebra que la Virgen María fue concebida sin pecado original. Es el inicio oficial de la Navidad en Colombia.',
    image: 'assets/banners/ricardo-gomez-angel-L6T_6Rp2iEk-unsplash.avif',
    facts: [
      'En la víspera (7 de diciembre) se celebra el "Día de las Velitas".',
      'Es uno de los días más iluminados y bellos del año en Colombia.',
    ],
    activities: ['Encendido de velitas y faroles', 'Reuniones con vecinos y chocolate/natilla'],
  },
  Navidad: {
    description: 'Conmemoración del nacimiento de Jesucristo en Belén.',
    image: 'assets/banners/ricardo-gomez-angel-L6T_6Rp2iEk-unsplash.avif',
    facts: [
      'En Colombia es el día de entrega de regalos (Traído del Niño Dios).',
      'Es la celebración familiar más grande del año.',
    ],
    activities: ['Cena de Navidad', 'Apertura de regalos', 'Novena de Aguinaldos (culminación)'],
  },
};
