export const ADMIN_PASSWORD = "admin123";

export const CATEGORIAS = [
  { nombre: "Sala", slug: "sala", emoji: "🛋️", descripcion: "Sofás, mesas y centros de entretenimiento" },
  { nombre: "Cocina", slug: "cocina", emoji: "🍳", descripcion: "Utensilios, vajilla y pequeños electrodomésticos" },
  { nombre: "Dormitorio", slug: "dormitorio", emoji: "🛏️", descripcion: "Ropa de cama, cabeceras y lámparas" },
  { nombre: "Baño", slug: "bano", emoji: "🛁", descripcion: "Toallas, organizadores y accesorios" },
  { nombre: "Decoración", slug: "decoracion", emoji: "🖼️", descripcion: "Cuadros, floreros y objetos decorativos" },
  { nombre: "Jardín", slug: "jardin", emoji: "🪴", descripcion: "Macetas, muebles de exteriores y plantas" },
] as const;

export type SeedProduct = {
  nombre: string;
  descripcion: string;
  precio: number;
  precioOferta?: number | null;
  categoriaSlug: string;
  imagenes: string; // emoji
  especificaciones?: Record<string, string> | null;
  stock: number;
  rating: number;
  destacado?: boolean;
};

export const PRODUCTOS: SeedProduct[] = [
  // Sala
  {
    nombre: "Sofá de 3 plazas beige",
    descripcion:
      "Sofá contemporáneo de 3 plazas en lino beige. Estructura de madera sólida, cojines de alta densidad y patas en madera de haya. Ideal para tu sala moderna.",
    precio: 4500,
    precioOferta: 3800,
    categoriaSlug: "sala",
    imagenes: "🛋️",
    especificaciones: { Medidas: "210 x 95 x 85 cm", Material: "Lino y madera", Color: "Beige", Garantía: "12 meses" },
    stock: 12,
    rating: 4.8,
    destacado: true,
  },
  {
    nombre: "Mesa de comedor rústica",
    descripcion:
      "Mesa de comedor para 6 personas en madera de pino macizo con acabado rústico. Patas en A para mayor estabilidad. Cada pieza es única gracias al veteado natural.",
    precio: 6200,
    categoriaSlug: "sala",
    imagenes: "🍽️",
    especificaciones: { Medidas: "180 x 90 x 75 cm", Material: "Pino macizo", Color: "Natural", Capacidad: "6 personas" },
    stock: 7,
    rating: 4.6,
    destacado: true,
  },
  {
    nombre: "Centro de entretenimiento madera",
    descripcion:
      "Centro de entretenimiento amplio con almacenamiento para TV hasta 65 pulgadas. Puertas con persianas y shelves abiertos para decodarador o libros.",
    precio: 3400,
    categoriaSlug: "sala",
    imagenes: "📺",
    especificaciones: { Medidas: "180 x 45 x 60 cm", Material: "Madera MDF", Color: "Roble" },
    stock: 9,
    rating: 4.4,
  },
  // Cocina
  {
    nombre: "Set de 12 piezas vajilla cerámica",
    descripcion:
      "Juego de vajilla de cerámica artesanal hecha en Puebla. 4 platos hondos, 4 planos, 4 extendidos. Diseño Talavera moderno en tonos naturales.",
    precio: 890,
    categoriaSlug: "cocina",
    imagenes: "🍽️",
    especificaciones: { Piezas: "12", Material: "Cerámica Talavera", Origen: "Puebla, México" },
    stock: 25,
    rating: 4.9,
    destacado: true,
  },
  {
    nombre: "Set de 6 copas cristal",
    descripcion:
      "Copas de cristal soplado para vino tinto. Capacidad 380ml. Elegantes para tu mesa de comedor o como regalo.",
    precio: 420,
    precioOferta: 320,
    categoriaSlug: "cocina",
    imagenes: "🍷",
    especificaciones: { Capacidad: "380 ml", Material: "Cristal soplado", Piezas: "6" },
    stock: 40,
    rating: 4.7,
  },
  {
    nombre: "Tabla de madera y mármol",
    descripcion:
      "Tabla para servir con base de encino y superficie de mármol blanco. Ideal para quesos, embutidos o aperitivos. Incluye cuchillo.",
    precio: 560,
    categoriaSlug: "cocina",
    imagenes: "🧀",
    especificaciones: { Medidas: "40 x 25 cm", Material: "Encino y mármol", Incluye: "Cuchillo" },
    stock: 18,
    rating: 4.5,
  },
  {
    nombre: "Olla de barro tradicional",
    descripcion:
      "Olla de barro de Metepec ideal para cocinar mole, frijoles o caldos. Conserva el calor y realza los sabores tradicionales mexicanos.",
    precio: 480,
    categoriaSlug: "cocina",
    imagenes: "🍲",
    especificaciones: { Capacidad: "4 litros", Material: "Barro cocido", Origen: "Estado de México" },
    stock: 22,
    rating: 4.6,
  },
  // Dormitorio
  {
    nombre: "Juego de sábanas king algodón",
    descripcion:
      "Juego de sábanas 4 piezas para cama King en 100% algodón egipcio, 300 hilos. Incluye 2 fundas, sábana superior e inferior. Suavidad premium.",
    precio: 890,
    categoriaSlug: "dormitorio",
    imagenes: "🛏️",
    especificaciones: { Tamaño: "King", Material: "Algodón egipcio", Hilos: "300", Piezas: "4" },
    stock: 30,
    rating: 4.9,
    destacado: true,
  },
  {
    nombre: "Lámpara de mesa latón",
    descripcion:
      "Lámpara de mesa con base de latón cepillado y pantalla de lino natural. Interruptor touch con 3 niveles de intensidad. Elegancia cálida para tu noche.",
    precio: 1250,
    categoriaSlug: "dormitorio",
    imagenes: "💡",
    especificaciones: { Altura: "45 cm", Material: "Latón y lino", Potencia: "LED 9W" },
    stock: 15,
    rating: 4.7,
    destacado: true,
  },
  {
    nombre: "Cabecera de madera tallada",
    descripcion:
      "Cabecera king tallada a mano en madera de cedro con detalles coloniales. Acabado natural que realza el veteado. Pieza artesanal única.",
    precio: 2950,
    categoriaSlug: "dormitorio",
    imagenes: "🚪",
    especificaciones: { Tamaño: "King", Material: "Cedro tallado", Origen: "Michoacán" },
    stock: 5,
    rating: 4.8,
  },
  // Baño
  {
    nombre: "Set 6 toallas egipcias",
    descripcion:
      "Set de 6 toallas de mano en algodón egipcio 600 GSM. Suavidad y absorbencia premium. Colores elegantes neutros que combinan con tu baño.",
    precio: 320,
    categoriaSlug: "bano",
    imagenes: "🧖",
    especificaciones: { Material: "Algodón egipcio", Gramaje: "600 GSM", Piezas: "6" },
    stock: 50,
    rating: 4.7,
  },
  {
    nombre: "Organizador de tocador bambú",
    descripcion:
      "Organizador de tocador de 3 niveles en bambú sostenible. Espacio para cremas, cosméticos y joyería. Mantiene tu baño ordenado con estilo.",
    precio: 280,
    categoriaSlug: "bano",
    imagenes: "📦",
    especificaciones: { Medidas: "30 x 12 x 18 cm", Material: "Bambú", Niveles: "3" },
    stock: 35,
    rating: 4.5,
  },
  {
    nombre: "Cortina de baño lino look",
    descripcion:
      "Cortina de baño texturizada con apariencia de lino. 100% poliéster con tratamiento antimoho. Incluye 12 ganchos. Estilo hotel spa.",
    precio: 220,
    categoriaSlug: "bano",
    imagenes: "🚿",
    especificaciones: { Medidas: "180 x 180 cm", Material: "Poliéster", Incluye: "12 ganchos" },
    stock: 60,
    rating: 4.4,
  },
  // Decoración
  {
    nombre: "Espejo decorativo dorado",
    descripcion:
      "Espejo circular con marco en acabado dorado envejecido. 60cm de diámetro. Pieza que ilumina y amplía visualmente cualquier espacio.",
    precio: 680,
    precioOferta: 540,
    categoriaSlug: "decoracion",
    imagenes: "🪞",
    especificaciones: { Diámetro: "60 cm", Material: "Marco metálico dorado" },
    stock: 20,
    rating: 4.8,
    destacado: true,
  },
  {
    nombre: "Florero cerámica Talavera",
    descripcion:
      "Florero artesanal de Talavera poblana pintado a mano. Cada pieza es única. 28cm de alto. Color azul y blanco tradicional.",
    precio: 450,
    categoriaSlug: "decoracion",
    imagenes: "🏺",
    especificaciones: { Altura: "28 cm", Material: "Talavera", Origen: "Puebla" },
    stock: 28,
    rating: 4.9,
    destacado: true,
  },
  {
    nombre: "Cuadro textural latón",
    descripcion:
      "Cuadro decorativo en relieve con aplicaciones de latón cepillado sobre base de madera. 80x60cm. Arte contemporáneo hecho en México.",
    precio: 1850,
    categoriaSlug: "decoracion",
    imagenes: "🖼️",
    especificaciones: { Medidas: "80 x 60 cm", Material: "Latón y madera" },
    stock: 8,
    rating: 4.6,
  },
  {
    nombre: "Velas aromáticas set 3",
    descripcion:
      "Set de 3 velas aromáticas de soya natural en frascos cerámicos. Aromas: vainilla, lavanda y cítricos. Hasta 35 horas de combustión cada una.",
    precio: 320,
    categoriaSlug: "decoracion",
    imagenes: "🕯️",
    especificaciones: { Material: "Cera de soya", Piezas: "3", Duración: "35h c/u" },
    stock: 45,
    rating: 4.5,
  },
  // Jardín
  {
    nombre: "Set 3 macetas cerámica",
    descripcion:
      "Set de 3 macetas de cerámica esmaltada en tonos terracota y crema. Distintos tamaños para composiciones vegetales en terraza o interior.",
    precio: 410,
    categoriaSlug: "jardin",
    imagenes: "🪴",
    especificaciones: { Material: "Cerámica esmaltada", Piezas: "3", Tamaños: "S, M, L" },
    stock: 30,
    rating: 4.7,
    destacado: true,
  },
  {
    nombre: "Silla de exterior teca",
    descripcion:
      "Silla de exterior en madera de teca tratada para intemperie. Diseño minimalista. Vendida por unidad. Resistente a humedad y sol.",
    precio: 1280,
    categoriaSlug: "jardin",
    imagenes: "🪑",
    especificaciones: { Material: "Madera de teca", Uso: "Exterior", Venta: "Por unidad" },
    stock: 16,
    rating: 4.6,
  },
  {
    nombre: "Hamaca de ixtle tradicional",
    descripcion:
      "Hamaca tejida a mano en ixtle de maguey. Tejido tradicional de Yucatán. Capacidad 120kg. Lleva el descanso mexicano a tu patio.",
    precio: 540,
    categoriaSlug: "jardin",
    imagenes: "🏖️",
    especificaciones: { Material: "Ixtle de maguey", Capacidad: "120 kg", Origen: "Yucatán" },
    stock: 22,
    rating: 4.8,
  },
];

export const CUPONES = [
  { codigo: "BIENVENIDA10", descuento: 10, activo: true, minimo: 0 },
  { codigo: "VERANO15", descuento: 15, activo: true, minimo: 0 },
  { codigo: "CASA20", descuento: 20, activo: true, minimo: 2000 },
] as const;

export const ORDENES = [
  {
    clienteNombre: "María González",
    clienteEmail: "maria.gonzalez@example.com",
    clienteTelefono: "639 123 4567",
    direccion: "Calle Hidalgo #45, Colonia Centro",
    ciudad: "Delicias",
    codigoPostal: "33000",
    items: JSON.stringify([
      { productoId: "demo-1", nombre: "Sofá de 3 plazas beige", precio: 3800, cantidad: 1, imagen: "🛋️" },
      { productoId: "demo-2", nombre: "Set 6 toallas egipcias", precio: 320, cantidad: 2, imagen: "🧖" },
    ]),
    subtotal: 4440,
    envio: 0,
    total: 3996,
    estado: "entregado",
    cupon: "BIENVENIDA10",
  },
  {
    clienteNombre: "Jorge Ramírez",
    clienteEmail: "jorge.ramirez@example.com",
    clienteTelefono: "614 987 6543",
    direccion: "Av. Tecnológico #1200",
    ciudad: "Chihuahua",
    codigoPostal: "31300",
    items: JSON.stringify([
      { productoId: "demo-3", nombre: "Mesa de comedor rústica", precio: 6200, cantidad: 1, imagen: "🍽️" },
    ]),
    subtotal: 6200,
    envio: 0,
    total: 5270,
    estado: "enviado",
    cupon: "CASA20",
  },
  {
    clienteNombre: "Ana Beltrán",
    clienteEmail: "ana.beltran@example.com",
    clienteTelefono: "639 555 1212",
    direccion: "Privada Las Palmas #8",
    ciudad: "Delicias",
    codigoPostal: "33010",
    items: JSON.stringify([
      { productoId: "demo-4", nombre: "Juego de sábanas king algodón", precio: 890, cantidad: 1, imagen: "🛏️" },
      { productoId: "demo-5", nombre: "Lámpara de mesa latón", precio: 1250, cantidad: 1, imagen: "💡" },
      { productoId: "demo-6", nombre: "Set 6 toallas egipcias", precio: 320, cantidad: 2, imagen: "🧖" },
    ]),
    subtotal: 2780,
    envio: 0,
    total: 2780,
    estado: "pagado",
    cupon: null,
  },
  {
    clienteNombre: "Carlos Mendoza",
    clienteEmail: "carlos.mendoza@example.com",
    clienteTelefono: "639 222 3333",
    direccion: "Calle Aldama #200",
    ciudad: "Camargo",
    codigoPostal: "33700",
    items: JSON.stringify([
      { productoId: "demo-7", nombre: "Espejo decorativo dorado", precio: 540, cantidad: 1, imagen: "🪞" },
      { productoId: "demo-8", nombre: "Florero cerámica Talavera", precio: 450, cantidad: 2, imagen: "🏺" },
    ]),
    subtotal: 1440,
    envio: 99,
    total: 1539,
    estado: "pendiente",
    cupon: null,
  },
  {
    clienteNombre: "Patricia Sáenz",
    clienteEmail: "patricia.saenz@example.com",
    clienteTelefono: "614 444 5555",
    direccion: "Calle 5 de Febrero #19",
    ciudad: "Chihuahua",
    codigoPostal: "31000",
    items: JSON.stringify([
      { productoId: "demo-9", nombre: "Set 3 macetas cerámica", precio: 410, cantidad: 2, imagen: "🪴" },
    ]),
    subtotal: 820,
    envio: 99,
    total: 919,
    estado: "pendiente",
    cupon: null,
  },
] as const;
