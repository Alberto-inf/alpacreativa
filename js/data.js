const CATEGORY_ICONS = {
  "novedades": {
    small: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z"/></svg>`,
    large: `<svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z"/></svg>`
  },
  "ediciones-especiales": {
    small: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
    large: `<svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`
  },
  "linea-deportiva": {
    small: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>`,
    large: `<svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>`
  },
  "laboral": {
    small: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 7h-3a2 2 0 0 1-2-2V2"/><path d="M9 18a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-1a2 2 0 0 1 2-2h3"/><path d="M15 8a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-3a2 2 0 0 1-2-2V8z"/><path d="M3 12h6"/><path d="M3 6h6"/><path d="M3 18h6"/></svg>`,
    large: `<svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 7h-3a2 2 0 0 1-2-2V2"/><path d="M9 18a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-1a2 2 0 0 1 2-2h3"/><path d="M15 8a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-3a2 2 0 0 1-2-2V8z"/><path d="M3 12h6"/><path d="M3 6h6"/><path d="M3 18h6"/></svg>`
  },
  "ropa": {
    small: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"/></svg>`,
    large: `<svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"/></svg>`
  },
  "fechas-especiales": {
    small: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5.8 11.3 2 22l10.7-3.79"/><path d="M4 3h.01"/><path d="M22 8h.01"/><path d="M15 2h.01"/><path d="M22 20h.01"/><path d="m22 2-2.24.75a2.9 2.9 0 0 0-1.96 3.12c.1.86-.57 1.63-1.45 1.63h-.38c-.86 0-1.6.6-1.76 1.44L14 10"/><path d="m22 13-1.7-.83a2.9 2.9 0 0 0-3.79 1.27l-.18.36c-.4.8-1.36 1.13-2.16.73L13 14"/><path d="m11 2 .33.66a2.9 2.9 0 0 0 3.42 1.65l.7-.18"/></svg>`,
    large: `<svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5.8 11.3 2 22l10.7-3.79"/><path d="M4 3h.01"/><path d="M22 8h.01"/><path d="M15 2h.01"/><path d="M22 20h.01"/><path d="m22 2-2.24.75a2.9 2.9 0 0 0-1.96 3.12c.1.86-.57 1.63-1.45 1.63h-.38c-.86 0-1.6.6-1.76 1.44L14 10"/><path d="m22 13-1.7-.83a2.9 2.9 0 0 0-3.79 1.27l-.18.36c-.4.8-1.36 1.13-2.16.73L13 14"/><path d="m11 2 .33.66a2.9 2.9 0 0 0 3.42 1.65l.7-.18"/></svg>`
  },
  "colecciones": {
    small: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>`,
    large: `<svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>`
  },
  "hogar": {
    small: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
    large: `<svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`
  },
  "complementos": {
    small: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" x2="21" y1="6" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>`,
    large: `<svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" x2="21" y1="6" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>`
  },
  "outlet": {
    small: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" x2="7.01" y1="7" y2="7"/></svg>`,
    large: `<svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" x2="7.01" y1="7" y2="7"/></svg>`
  },
  "bordados-personalizados": {
    small: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>`,
    large: `<svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>`
  }
};

const CATEGORIES = [
  {
    name: "Novedades",
    slug: "novedades",
    sub: []
  },
  {
    name: "Ediciones Especiales",
    slug: "ediciones-especiales",
    sub: []
  },
  {
    name: "Línea Deportiva",
    slug: "linea-deportiva",
    sub: [
      "Camisetas", "Chandals", "Sudaderas", "Equipaciones", "Banderines",
      "Lonas publicitarias", "Trofeos", "Medallas", "Zapatilleros",
      "Mochilas", "Botellas de agua", "Espinilleras personalizadas",
      "Camisetas para acompañantes", "Bufandas"
    ]
  },
  {
    name: "Laboral",
    slug: "laboral",
    sub: [
      "Jerseys", "Camisas", "Camisetas", "Polos", "Pantalones (chinos, multibolsillos, cortos, reflectantes)",
      "Chalecos", "Micropolar", "Uniformes de limpieza", "Sanitarios",
      "Estética", "Ropa para hostelería", "Calzado laboral"
    ]
  },
  {
    name: "Ropa",
    slug: "ropa",
    sub: [
      "Camisetas", "Camisas", "Polos", "Sudaderas", "Chalecos", "Chaquetas"
    ]
  },
  {
    name: "Fechas Especiales",
    slug: "fechas-especiales",
    sub: [
      "Navidad", "San Valentín", "Halloween", "Semana Santa",
      "Chaquetas SoftShell", "Chalecos", "Guantes", "Cintas para el pelo",
      "Camisetas", "Costales", "Pañuelos", "Fundas de traje"
    ]
  },
  {
    name: "Colecciones",
    slug: "colecciones",
    sub: [
      "Iniciales", "Familia", "Pack (despedida de soltero, familiar, colegios)",
      "Animales", "Náutica", "Baño", "Coches", "Personajes",
      "Navidad", "San Valentín", "Halloween", "Bebé"
    ]
  },
  {
    name: "Hogar",
    slug: "hogar",
    sub: [
      "Toallas de baño bordadas", "Toallas de playa", "Albornoces",
      "Cojines", "Tazas"
    ]
  },
  {
    name: "Complementos",
    slug: "complementos",
    sub: [
      "Bolsas tote bag", "Bolsos playa", "Bolsas de tela", "Neceser",
      "Abanicos", "Paraguas", "Botellas", "Tazas", "Juegos",
      "Llaveros", "Bolígrafos", "Mechero"
    ]
  },
  {
    name: "Outlet",
    slug: "outlet",
    sub: []
  },
  {
    name: "Bordados Personalizados",
    slug: "bordados-personalizados",
    sub: []
  }
];

const CATALOG_MODE = true; // catálogo sin ventas: oculta carrito/login, precio "A partir de:"

const PRODUCT_SIZES = ["XS", "S", "M", "L", "XL", "XXL", "3XL", "4XL", "5XL"];
const PRODUCT_COLORS = [
  { name: "Blanco", hex: "#ffffff" },
  { name: "Negro", hex: "#1a1a1a" },
  { name: "Marino", hex: "#1e3a5f" },
  { name: "Gris", hex: "#9ca3af" },
  { name: "Beige", hex: "#d4b896" },
  { name: "Burdeos", hex: "#722f37" },
  { name: "Verde", hex: "#4a6b4a" },
  { name: "Rojo", hex: "#c0392b" }
];

const LEGACY_PRODUCTS = [
  // === ROPA - Catálogo (32 fichas del PDF) - modo catálogo: precio "A partir de:" ===
  { id: 101, name: "Camiseta BETA PREMIUM", price: 11.00, category: "ropa", subcategory: "Camisetas", img: "img/ropa/ropa_101_beta_premium.png", description: "Manga corta con costuras laterales. 100% algodón peinado 190gr. Tejido punto liso, cuello canalé 1x1 (4 capas). Tallas S-4XL y niño 3-12. Bordado / DTF." },
  { id: 102, name: "Camiseta ALPHA", price: 8.50, category: "ropa", subcategory: "Camisetas", img: "img/ropa/ropa_102_alpha.png", description: "Manga corta con costuras laterales. 100% algodón tubular preencogido 155gr. Cuello canalé 1x1 (4 capas). S-4XL y niño 3-12. Bordado / DTF." },
  { id: 103, name: "Camiseta GAMMA OVERSIZE", price: 15.00, category: "ropa", subcategory: "Camisetas", img: "img/ropa/ropa_103_gamma_oversize.png", description: "Manga corta oversize. 100% algodón 30% reciclado 200gr. Doble costura en cuello, mangas y bajo. Unisex. Bordado / DTF." },
  { id: 104, name: "Camiseta EPSILON", price: 8.50, category: "ropa", subcategory: "Camisetas", img: "img/ropa/ropa_104_epsilon.png", description: "Manga larga tubular. 100% algodón punto liso 160gr. Tubular, cubre costuras en cuello. Bordado / DTF." },
  { id: 105, name: "Camiseta EPSILON WOMAN", price: 9.00, category: "ropa", subcategory: "Camisetas", img: "img/ropa/ropa_105_epsilon_woman.png", description: "Manga larga tubular mujer. 100% algodón punto liso 160gr. Cubre costuras en cuello. Bordado / DTF." },
  { id: 106, name: "Camiseta ZETA WOMAN", price: 8.50, category: "ropa", subcategory: "Camisetas", img: "img/ropa/ropa_106_zeta_woman.png", description: "Manga corta entallada en cintura. 100% algodón punto liso 170gr. Cubre costuras en cuello. Bordado / DTF." },
  { id: 107, name: "Camiseta Técnica ZEUS", price: 7.00, category: "ropa", subcategory: "Camisetas", img: "img/ropa/ropa_107_zeus.png", description: "Camiseta técnica manga raglán Control Dry. 100% poliéster 135gr. Certificado UV. Bordado / DTF." },
  { id: 108, name: "Camiseta Técnica ARES", price: 8.50, category: "ropa", subcategory: "Camisetas", img: "img/ropa/ropa_108_ares.png", description: "Camiseta técnica unisex manga raglán. 100% poliéster (trasero mesh) 140gr. Cubre costuras cuello. Bordado / DTF." },
  { id: 109, name: "Polo PI", price: 12.00, category: "ropa", subcategory: "Polos", img: "img/ropa/ropa_109_pi.png", description: "Polo piqué 100% algodón peinado preencogido 210gr. Botones a tono. Bordado / DTF." },
  { id: 110, name: "Polo DELTA PREMIUM", price: 15.00, category: "ropa", subcategory: "Polos", img: "img/ropa/ropa_110_delta_premium.png", description: "Polo piqué 100% algodón peinado preencogido 240gr. Botones a tono. Bordado / DTF." },
  { id: 111, name: "Polo Técnico OMEGA", price: 10.00, category: "ropa", subcategory: "Polos", img: "img/ropa/ropa_111_omega.png", description: "Polo técnico transpirable Control Dry antibacteriano. 100% poliéster reciclado 125gr. Tapeta botones a presión. Bordado / DTF." },
  { id: 112, name: "Polo Técnico OMEGA WOMAN", price: 10.00, category: "ropa", subcategory: "Polos", img: "img/ropa/ropa_112_omega_woman.png", description: "Polo técnico mujer Control Dry. 100% poliéster reciclado 125gr. Tapeta botones a presión. Bordado / DTF." },
  { id: 113, name: "Sudadera LAMBDA", price: 19.00, category: "ropa", subcategory: "Sudaderas", img: "img/ropa/ropa_113_lambda.png", description: "Sudadera felpa perchada con capucha forrada. 50% algodón 50% poliéster 280gr. Bordado / DTF. Opción capucha contraste." },
  { id: 114, name: "Sudadera MONTAIN", price: 21.00, category: "ropa", subcategory: "Sudaderas", img: "img/ropa/ropa_114_montain.png", description: "Sudadera entallada cremallera frontal y capucha con canguro. 50% algodón 50% poliéster 280gr. Bordado / DTF." },
  { id: 115, name: "Sudadera SELENE", price: 21.00, category: "ropa", subcategory: "Sudaderas", img: "img/ropa/ropa_115_selene.png", description: "Sudadera entallada cremallera + capucha canguro. 50% algodón 50% poliéster 280gr. Bordado / DTF." },
  { id: 116, name: "Sudadera BACO", price: 21.00, category: "ropa", subcategory: "Sudaderas", img: "img/ropa/ropa_116_baco.png", description: "Sudadera unisex felpa perchada oversize capucha forrada, bolsillos laterales. 50% algodón 50% poliéster 320gr. Bordado / DTF." },
  { id: 117, name: "Sudadera GEA", price: 20.00, category: "ropa", subcategory: "Sudaderas", img: "img/ropa/ropa_117_gea.png", description: "Sudadera unisex oversize felpa perchada capucha forrada. 50% algodón 50% poliéster 320gr. Bordado / DTF." },
  { id: 118, name: "Sudadera HERA", price: 18.00, category: "ropa", subcategory: "Sudaderas", img: "img/ropa/ropa_118_hera.png", description: "Sudadera algodón no perchado, puños y cinturilla canalé. 100% algodón 260gr. Bordado / DTF." },
  { id: 119, name: "Sudadera CRONOS", price: 19.00, category: "ropa", subcategory: "Sudaderas", img: "img/ropa/ropa_119_cronos.png", description: "Sudadera técnica perchada media cremallera, puños con ojal pulgar. 88% poliéster 12% elastano 200gr. Bordado / DTF." },
  { id: 120, name: "Sudadera CRONOS WOMAN", price: 19.00, category: "ropa", subcategory: "Sudaderas", img: "img/ropa/ropa_120_cronos_woman.png", description: "Sudadera técnica mujer media cremallera, ojal pulgar. 88% poliéster 12% elastano 200gr. Bordado / DTF." },
  { id: 121, name: "Chaleco OSO", price: 22.00, category: "ropa", subcategory: "Chalecos", img: "img/ropa/ropa_121_oso.png", description: "Chaleco acolchado resistente viento y repelente agua. 100% poliéster efecto pluma 290gr. Bordado / DTF." },
  { id: 122, name: "Chaleco Soft Shell CANADÁ", price: 22.00, category: "ropa", subcategory: "Chalecos", img: "img/ropa/ropa_122_canada.png", description: "Chaleco Soft Shell 2 capas interior polar, repelente agua. 100% poliéster interior polar 300gr. Bordado / DTF." },
  { id: 123, name: "Chaqueta Soft Shell BRASKA", price: 24.00, category: "ropa", subcategory: "Chaquetas", img: "img/ropa/ropa_123_braska.png", description: "Chaqueta Soft Shell 2 capas interior polar, repelente agua. 100% poliéster 300gr extra cálido. Bordado / DTF." },
  { id: 124, name: "Chaqueta Soft Shell BRASKA WOMAN", price: 24.00, category: "ropa", subcategory: "Chaquetas", img: "img/ropa/ropa_124_braska_woman.png", description: "Chaqueta Soft Shell mujer 2 capas interior polar 300gr. Bordado / DTF." },
  { id: 125, name: "Chaqueta Polar APOLO", price: 19.00, category: "ropa", subcategory: "Chaquetas", img: "img/ropa/ropa_125_apolo.png", description: "Chaqueta polar cremallera frontal cuello alto bolsillos cremallera. 100% poliéster polar 300gr. Bordado / DTF." },
  { id: 126, name: "Chaqueta Polar APOLO WOMAN", price: 19.00, category: "ropa", subcategory: "Chaquetas", img: "img/ropa/ropa_126_apolo_woman.png", description: "Chaqueta polar mujer cremallera frontal 300gr. Bordado / DTF." },
  { id: 127, name: "Chaqueta JUPITER", price: 28.00, category: "ropa", subcategory: "Chaquetas", img: "img/ropa/ropa_127_jupiter.png", description: "Chaqueta unisex combinada 2 colores ligeramente acolchada bolsillos laterales. 100% poliéster 220gr. Bordado / DTF." },
  { id: 128, name: "Chaqueta VESTA", price: 29.00, category: "ropa", subcategory: "Chaquetas", img: "img/ropa/ropa_128_vesta.png", description: "Chaqueta acolchada repelente agua y viento. 100% poliéster 290gr. Bordado / DTF." },
  { id: 129, name: "Chaqueta VESTA WOMAN", price: 25.00, category: "ropa", subcategory: "Chaquetas", img: "img/ropa/ropa_129_vesta_woman.png", description: "Chaqueta acolchada mujer repelente agua y viento 290gr. Bordado / DTF." },
  { id: 130, name: "Chaqueta PLUTÓN", price: 36.00, category: "ropa", subcategory: "Chaquetas", img: "img/ropa/ropa_130_pluton.png", description: "Chaqueta acolchada repelente agua capucha extraíble. 100% poliéster guata 335gr. Bordado / DTF." },
  { id: 131, name: "Chaqueta MARTE", price: 32.00, category: "ropa", subcategory: "Chaquetas", img: "img/ropa/ropa_131_marte.png", description: "Chaqueta acolchada repelente agua forro micropolar. 100% poliéster 300gr. A prueba viento. Bordado / DTF." },
  {
    id: 3,
    name: "Taza Cerámica Personalizada",
    price: 9.95,
    category: "hogar",
    subcategory: "Tazas",
    img: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=600&h=600&fit=crop&auto=format",
    description: "Taza de cerámica blanca con tu foto, frase o diseño favorito. Apta para lavavajillas."
  },
  {
    id: 4,
    name: "Chándal Deportivo Completo",
    price: 49.90,
    category: "linea-deportiva",
    subcategory: "Chandals",
    img: "https://images.unsplash.com/photo-1483721310020-03333e577078?w=600&h=600&fit=crop&auto=format",
    description: "Chándal completo ideal para equipos. Personalización con escudo, nombre y número."
  },
  {
    id: 5,
    name: "Polo Laboral Bordado",
    price: 21.00,
    category: "laboral",
    subcategory: "Polos",
    img: "https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=600&h=600&fit=crop&auto=format",
    description: "Polo piqué resistente para trabajo con bordado de empresa. Algodón peinado."
  },
  {
    id: 6,
    name: "Toalla de Baño Bordada",
    price: 24.50,
    category: "hogar",
    subcategory: "Toallas de baño bordadas",
    img: "https://images.unsplash.com/photo-1600369671236-e74521d4b6ad?w=600&h=600&fit=crop&auto=format",
    description: "Toalla 100% algodón 500g con bordado personalizado. El regalo perfecto."
  },
  {
    id: 7,
    name: "Tote Bag Personalizada",
    price: 12.00,
    category: "complementos",
    subcategory: "Bolsas tote bag",
    img: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&h=600&fit=crop&auto=format",
    description: "Bolsa de tela resistente 100% algodón con tu diseño estampado en serigrafía."
  },
  {
    id: 8,
    name: "Pack Familiar 4 Camisetas",
    price: 64.90,
    category: "colecciones",
    subcategory: "Pack (despedida de soltero, familiar, colegios)",
    img: "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=600&h=600&fit=crop&auto=format",
    description: "Pack de 4 camisetas familiares con diseños coordinados. Ahorra en pedidos grandes."
  },
  {
    id: 9,
    name: "Chaqueta SoftShell Corporativa",
    price: 42.00,
    category: "fechas-especiales",
    subcategory: "Chaquetas SoftShell",
    img: "https://images.unsplash.com/photo-1591047139756-eb4a228be20d?w=600&h=600&fit=crop&auto=format",
    description: "Chaqueta cortavientos con bordado corporativo. Tres capas, transpirable."
  },
  {
    id: 10,
    name: "Equipación Deportiva Completa",
    price: 89.90,
    category: "linea-deportiva",
    subcategory: "Equipaciones",
    img: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&h=600&fit=crop&auto=format",
    description: "Kit completo para equipos: camiseta, pantalón y medias. Sublimación total."
  },
  {
    id: 11,
    name: "Albornoz Bordado Premium",
    price: 38.00,
    category: "hogar",
    subcategory: "Albornoces",
    img: "https://images.unsplash.com/photo-1600369671236-e74521d4b6ad?w=600&h=600&fit=crop&auto=format",
    description: "Albornoz de rizo premium con iniciales bordadas. Capucha y dos bolsillos."
  },
  {
    id: 12,
    name: "Llavero Metálico Personalizado",
    price: 4.50,
    category: "complementos",
    subcategory: "Llaveros",
    img: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=600&h=600&fit=crop&auto=format",
    description: "Llavero metálico grabado con láser con tu diseño o nombre. Acabado dorado o plateado."
  },
  {
    id: 13,
    name: "Camisa Laboral Manga Larga",
    price: 26.00,
    category: "laboral",
    subcategory: "Camisas",
    img: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&h=600&fit=crop&auto=format",
    description: "Camisa laboral de algodón con bolsillo en el pecho para bordado corporativo."
  },
  {
    id: 14,
    name: "Mochila Deportiva Personalizada",
    price: 18.50,
    category: "linea-deportiva",
    subcategory: "Mochilas",
    img: "https://images.unsplash.com/photo-1542219550-37153d387c27?w=600&h=600&fit=crop&auto=format",
    description: "Mochila resistente con varios compartimentos. Bordado del escudo del equipo."
  },
  {
    id: 15,
    name: "Cojín Decorativo Bordado",
    price: 16.90,
    category: "hogar",
    subcategory: "Cojines",
    img: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=600&h=600&fit=crop&auto=format",
    description: "Cojín 45x45 cm con funda lavable y relleno incluido. Tu foto o frase."
  },
  {
    id: 16,
    name: "Botella Térmica con Logo",
    price: 11.50,
    category: "complementos",
    subcategory: "Botellas",
    img: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&h=600&fit=crop&auto=format",
    description: "Botella de acero inoxidable 500ml con grabado láser de tu diseño."
  }
];

// Catálogo vivo: lo rellena js/store.js desde Supabase (lo que ella cree
// en admin.html). Empieza vacío a propósito: sin migración inicial.
const PRODUCTS = [];

const GALLERY = [
  { url: "img/imgnuevas/d9aa38fc-6ed4-47e0-afa0-39ca23615e3c.JPG", label: "Trabajo real 1" },
  { url: "img/imgnuevas/1edd1695-8fcd-4f89-b0d0-208f9383cb96.JPG", label: "Trabajo real 2" },
  { url: "img/imgnuevas/fbb6a138-8eb0-4084-b173-7b888913277b.JPG", label: "Trabajo real 3" },
  { url: "img/imgnuevas/ad48659b-bf66-4303-8ada-c4708c894ad1.JPG", label: "Trabajo real 4" },
  { url: "img/imgnuevas/7c5a6cf0-46f8-48f2-979d-2d99b08c2476.JPG", label: "Trabajo real 5" },
  { url: "img/imgnuevas/8a2e1f80-e0a3-4d6e-9bca-64f31eae8d36.JPG", label: "Trabajo real 6" },
  { url: "img/imgnuevas/339b5a42-0e55-4db2-9bfa-547533977785.JPG", label: "Trabajo real 7" },
  { url: "img/imgnuevas/f3624da4-dd1c-4f3b-b555-fdc1a393fa5c.JPG", label: "Trabajo real 8" },
  { url: "img/imgnuevas/4b5206f1-cfa5-4c71-a0df-5ee95eaaf002.JPG", label: "Trabajo real 9" },
  { url: "img/imgnuevas/1a12921b-b68a-4b6f-a856-e2ee5b682cc2.JPG", label: "Trabajo real 10" },
  { url: "img/imgnuevas/0a459398-88c9-4071-92f9-6d764d1e03b0.JPG", label: "Trabajo real 11" },
  { url: "img/imgnuevas/619687e1-ae8b-42b9-b18a-5cb99e39eee2.JPG", label: "Trabajo real 12" }
];

const TESTIMONIALS = [
  {
    name: "María G.",
    role: "Club deportivo",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop&auto=format",
    rating: 5,
    text: "Encargamos 40 equipaciones para el equipo y el resultado fue increíble. Bordados perfectos y entrega rapidísima."
  },
  {
    name: "Javier L.",
    role: "Empresa hostelería",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&auto=format",
    rating: 5,
    text: "Llevamos años confiando en ALPA para los uniformes de nuestra plantilla. Calidad, atención y precio inmejorables."
  },
  {
    name: "Carmen R.",
    role: "Particular",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&h=120&fit=crop&auto=format",
    rating: 5,
    text: "Quería unas toallas bordadas para un regalo y quedaron preciosas. Me asesoraron con el diseño y todo fue muy fácil."
  },
  {
    name: "David M.",
    role: "Peña futbolera",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop&auto=format",
    rating: 5,
    text: "Hicimos las camisetas de la peña y nos hicieron un descuento por volumen. Volveremos a repetir seguro."
  }
];
