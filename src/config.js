// --- CUSTOM COLORS (Light Theme) ---
// Primary Accent: F91250 (Fuchsia/Pink)
// Secondary Accent: 494949 (Dark Gray)
// Background: EEEEEF (Very Light Gray)

export const COLORS = {
  primary: "#F91250",
  secondary: "#494949",
  background: "#EEEEEF",
};

// --- DATOS DE NEGOCIO ---
// 1. NÚMERO DE TELÉFONO ACTUALIZADO
export const LOCAL_PHONE_NUMBER = "56944250890";
export const WHATSAPP_LINK = `https://wa.me/${LOCAL_PHONE_NUMBER}`;
export const LOCAL_COMMUNE = "Santiago"; // <<< ¡IMPORTANTE! Cambia esto por la comuna de tu local (ej: "Providencia", "Quilicura", etc.)

// --- DATOS DE LA EMPRESA CREADORA ---
export const CREATOR_COMPANY = "NexNubo";
export const CREATOR_SOCIALS = {
  instagram: "https://www.instagram.com/nexnubo.app",
  whatsapp: "https://wa.me/56972112686",
  facebook: "https://www.facebook.com/nexnubo.app",
};
// --- FIN DATOS DE LA EMPRESA CREADORA ---

// --- LÓGICA DE HORARIOS ---
// Horarios actualizados según la imagen
export const STORE_HOURS_STRING =
  "Mar - Jue: 14:00 - 22:00 | Vie - Dom: 14:00 - 23:00 (Lun: Cerrado)";

// Función que verifica si la tienda está abierta.
// Se mantiene aquí ya que es un dato configurable que afecta el flujo de compra.
export const checkIfStoreIsOpen = () => {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0 = Domingo, 1 = Lunes, 2 = Martes...
  const currentHour = now.getHours(); // 0 - 23

  // Lunes (1): Cerrado
  if (dayOfWeek === 1) {
    return false;
  }

  // Martes (2) a Jueves (4): 14:00 a 22:00
  if (dayOfWeek >= 2 && dayOfWeek <= 4) {
    return currentHour >= 14 && currentHour < 22;
  }

  // Viernes (5), Sábado (6) y Domingo (0): 14:00 a 23:00
  if (dayOfWeek === 5 || dayOfWeek === 6 || dayOfWeek === 0) {
    return currentHour >= 14 && currentHour < 23;
  }

  return false;
};
// --- FIN LÓGICA DE HORARIOS ---

// Tiers con slots fijos: 0=Básico, 1=Medio, 2=Especial
export const FILLING_TIERS = {
  BASIC: {
    id: "BASIC",
    label: "Nivel 1: Básico (Verduras)",
    color: "text-green-600",
    slotIndex: 0,
  },
  MID: {
    id: "MID",
    label: "Nivel 2: Medio (Cremoso)",
    color: "text-blue-600",
    slotIndex: 1,
  },
  SPECIAL: {
    id: "SPECIAL",
    label: "Nivel 3: Especial (Proteína)",
    color: "text-[#F91250]",
    slotIndex: 2,
  },
};

// PRECIOS DE LISTA
export const FILLINGS = [
  // NIVEL BÁSICO
  { id: "cebollin", name: "Cebollín", tier: "BASIC", price: 300 },
  { id: "pepino", name: "Pepino", tier: "BASIC", price: 300 },
  { id: "ciboulette_relleno", name: "Ciboulette", tier: "BASIC", price: 300 },
  { id: "palta_relleno", name: "Palta", tier: "BASIC", price: 800 },
  { id: "zanahoria", name: "Zanahoria", tier: "BASIC", price: 300 }, // NUEVO
  // NIVEL MEDIO
  { id: "queso", name: "Queso Crema", tier: "MID", price: 500 },
  { id: "champinon", name: "Champiñón Furay", tier: "MID", price: 700 },
  // NIVEL ESPECIAL
  { id: "kanikama", name: "Kanikama", tier: "SPECIAL", price: 500 },
  { id: "pollo", name: "Pollo Teriyaki", tier: "SPECIAL", price: 1000 },
  { id: "salmon", name: "Salmón Fresco", tier: "SPECIAL", price: 1500 },
  { id: "camaron", name: "Camarón Tempura", tier: "SPECIAL", price: 1500 },
];

// --- INICIO: DATOS VEGETARIANOS ---
const VEGETARIAN_FILLING_IDS = [
  "cebollin",
  "pepino",
  "ciboulette_relleno",
  "palta_relleno",
  "queso",
  "champinon",
  "zanahoria", // AÑADIDO
];
export const VEGETARIAN_FILLINGS_DATA = FILLINGS.filter((f) =>
  VEGETARIAN_FILLING_IDS.includes(f.id)
);
// --- FIN: DATOS VEGETARIANOS ---

export const WRAPPERS = {
  sesamo: { name: "Envuelto en Sésamo", price: 300 },
  ciboulette: { name: "Envuelto en Ciboulette", price: 300 },
  frito: { name: "Frito en Panko", price: 500 },
  palta: { name: "Envuelto en Palta", price: 1000 },
  queso: { name: "Envuelto en Queso Crema", price: 1000 },
  salmon: { name: "Envuelto en Salmón", price: 2000 },
  alganori: { name: "Alga Nori", price: 250 }, // NUEVO
};

// --- INICIO: NUEVOS DATOS VEGETARIANOS (ENVOLTURAS) ---
export const VEGETARIAN_WRAPPERS = {
  sesamo: { name: "Envuelto en Sésamo", price: 300 },
  ciboulette: { name: "Envuelto en Ciboulette", price: 300 },
  frito: { name: "Frito en Panko", price: 500 },
  palta: { name: "Envuelto en Palta", price: 1000 },
  queso: { name: "Envuelto en Queso Crema", price: 1000 },
  alganori: { name: "Alga Nori", price: 250 }, // AÑADIDO
};
// --- FIN: NUEVOS DATOS VEGETARIANOS (ENVOLTURAS) ---

// --- DATOS DE MENÚ ---
export const MODIFIABLE_PROMOS = [
  {
    id: "promo1",
    name: "Neo Start (20p)",
    basePrice: 11000,
    description: "2 Roll clásico. Configuración base incluida.",
    image: "/images/Neo Start.jpg",
    rolls: [
      {
        id: "p1_r1",
        name: "Roll Philadelphia",
        pieces: 10,
        wrapper: "queso", // <--- CORREGIDO: Usar la clave "queso"
        defaultFillings: ["cebollin", "queso", "pollo"],
      },
      {
        id: "p1_r2",
        name: "Avocado Roll",
        pieces: 10,
        wrapper: "palta", // <--- CORREGIDO: Usar la clave "palta" (ya estaba bien)
        defaultFillings: ["cebollin", "queso", "salmon"],
      },
    ],
  },
  {
    id: "promo2",
    name: "Cyber Trio (30p)",
    basePrice: 16990,
    description: "3 Rolls variados para compartir.",
    image: "/images/Cyber Trio.jpg",
    rolls: [
      {
        id: "p2_r1",
        name: "Avocado Roll",
        pieces: 10,
        wrapper: "palta",
        defaultFillings: ["cebollin", "queso", "salmon"],
      },
      {
        id: "p2_r2",
        name: "Tempura Roll",
        pieces: 10,
        wrapper: "frito",
        defaultFillings: ["pepino", "queso", "pollo"],
      },
      {
        id: "p2_r3",
        name: "California",
        pieces: 10,
        wrapper: "sesamo",
        defaultFillings: ["ciboulette_relleno", "queso", "kanikama"],
      },
    ],
  },
  {
    id: "promo3",
    name: "Techno Friends (50p)",
    basePrice: 26990,
    description: "5 Rolls. La combinación completa.",
    image: "/images/Techno Friends.jpg",
    rolls: [
      {
        id: "p3_r1",
        name: "Premium Salmon",
        pieces: 10,
        wrapper: "salmon",
        defaultFillings: ["palta_relleno", "queso", "camaron"],
      },
      {
        id: "p3_r2",
        name: "Avocado Roll",
        pieces: 10,
        wrapper: "palta",
        defaultFillings: ["cebollin", "queso", "salmon"],
      },
      {
        id: "p3_r3",
        name: "Chicken Furay",
        pieces: 10,
        wrapper: "frito",
        defaultFillings: ["ciboulette_relleno", "queso", "pollo"],
      },
      {
        id: "p3_r4",
        name: "Kanikama Furay",
        pieces: 10,
        wrapper: "frito",
        defaultFillings: ["pepino", "queso", "kanikama"],
      },
      {
        id: "p3_r5",
        name: "California",
        pieces: 10,
        wrapper: "sesamo",
        defaultFillings: ["palta_relleno", "queso", "kanikama"],
      },
    ],
  },
];

export const STATIC_PROMOS = [
  // NUEVAS PROMOS
  {
    id: "new_s1",
    name: "Selección Minimal (10p)",
    basePrice: 5500,
    description:
      "Una opción pequeña y equilibrada, ideal para antojos o para probar tu cocina.",
    type: "STATIC",
    rolls: [
      {
        id: "ns1_r1",
        name: "Roll",
        pieces: 10,
        wrapper: "alganori",
        defaultFillings: ["pollo", "queso", "cebollin"],
      },
    ],
    image: "/images/Selección Minimal.jpg",
  },
  {
    id: "new_s2",
    name: "Dúo Gourmet (20p)",
    basePrice: 9000,
    description:
      "Dos rolls complementarios que mezclan mar y tierra, pensados para compartir entre dos personas.",
    type: "STATIC",
    rolls: [
      {
        id: "ns2_r1",
        name: "Roll de Camarón",
        pieces: 10,
        wrapper: "sesamo",
        defaultFillings: ["camaron", "queso", "palta_relleno"],
      },
      {
        id: "ns2_r2",
        name: "Roll de Pollo",
        pieces: 10,
        wrapper: "alganori",
        defaultFillings: ["pollo", "cebollin", "palta_relleno"],
      },
    ],
    image: "/images/Dúo Gourmet 20.jpg",
  },
  {
    id: "new_s3",
    name: "Trilogía Premium (30p)",
    basePrice: 13000,
    description:
      "Tres sabores bien diferenciados para una experiencia variada, ideal para 2–3 personas.",
    type: "STATIC",
    rolls: [
      {
        id: "ns3_r1",
        name: "Roll de Pollo",
        pieces: 10,
        wrapper: "ciboulette",
        defaultFillings: ["pollo", "queso", "palta_relleno"],
      },
      {
        id: "ns3_r2",
        name: "Roll de Camarón",
        pieces: 10,
        wrapper: "sesamo",
        defaultFillings: ["camaron", "cebollin", "queso"],
      },
      {
        id: "ns3_r3",
        name: "Roll de Kanikama",
        pieces: 10,
        wrapper: "alganori",
        defaultFillings: ["kanikama", "palta_relleno", "queso"],
      },
    ],
    image: "/images/Trilogía Premium 30.jpg",
  },
  {
    id: "new_s4",
    name: "Edición Especial (40p)",
    basePrice: 14000,
    description:
      "Una mezcla perfecta entre crocante y fresco, ideal para una comida completa entre dos personas.",
    type: "STATIC",
    rolls: [
      {
        id: "ns4_r1",
        name: "Roll Crocante",
        pieces: 10,
        wrapper: "frito",
        defaultFillings: ["camaron", "queso", "cebollin"],
      },
      {
        id: "ns4_r2",
        name: "Roll Mixto",
        pieces: 10,
        wrapper: "sesamo",
        defaultFillings: ["pollo", "palta_relleno", "queso"],
      },
      {
        id: "ns4_r3",
        name: "Roll Fresco",
        pieces: 10,
        wrapper: "ciboulette",
        defaultFillings: ["kanikama", "queso", "palta_relleno"],
      },
      {
        id: "ns4_r4",
        name: "Roll Nori",
        pieces: 10,
        wrapper: "alganori",
        defaultFillings: ["camaron", "zanahoria", "queso"],
      },
    ],
    image: "/images/Edición Especial 40.jpg",
  },
  {
    id: "new_s5",
    name: "Clásicos Signature (50p)",
    basePrice: 17000,
    description:
      "Una selección de sabores clásicos y equilibrados, diseñada para quienes buscan variedad sin complicarse.",
    type: "STATIC",
    rolls: [
      {
        id: "ns5_r1",
        name: "Roll Sésamo Negro",
        pieces: 10,
        wrapper: "sesamo", // Asumimos sésamo negro usa 'sesamo'
        defaultFillings: ["pollo", "palta_relleno", "queso"],
      },
      {
        id: "ns5_r2",
        name: "Roll Crocante",
        pieces: 10,
        wrapper: "frito",
        defaultFillings: ["camaron", "queso", "palta_relleno"],
      },
      {
        id: "ns5_r3",
        name: "Roll Alga",
        pieces: 10,
        wrapper: "alganori",
        defaultFillings: ["kanikama", "cebollin", "queso"],
      },
      {
        id: "ns5_r4",
        name: "Roll Ciboulette",
        pieces: 10,
        wrapper: "ciboulette",
        defaultFillings: ["pollo", "zanahoria", "palta_relleno"],
      },
      {
        id: "ns5_r5",
        name: "Roll Sésamo Blanco",
        pieces: 10,
        wrapper: "sesamo", // Asumimos sésamo blanco usa 'sesamo'
        defaultFillings: ["camaron", "cebollin", "queso"],
      },
    ],
    image: "/images/Clásicos Signature 50.jpg",
  },
  {
    id: "new_s6",
    name: "Mega Mix (60p)",
    basePrice: 25000,
    description:
      "Perfecta para reuniones familiares o entre amigos. Trae una combinación balanceada entre sabores suaves, frescos y crispy.",
    type: "STATIC",
    rolls: [
      {
        id: "ns6_r1",
        name: "Roll Sésamo Mixto",
        pieces: 10,
        wrapper: "sesamo",
        defaultFillings: ["camaron", "palta_relleno", "queso"],
      },
      {
        id: "ns6_r2",
        name: "Roll Nori",
        pieces: 10,
        wrapper: "alganori",
        defaultFillings: ["pollo", "cebollin", "queso"],
      },
      {
        id: "ns6_r3",
        name: "Roll Crocante",
        pieces: 10,
        wrapper: "frito",
        defaultFillings: ["kanikama", "queso", "palta_relleno"],
      },
      {
        id: "ns6_r4",
        name: "Roll Ciboulette",
        pieces: 10,
        wrapper: "ciboulette",
        defaultFillings: ["pollo", "zanahoria", "queso"],
      },
      {
        id: "ns6_r5",
        name: "Roll Sésamo Negro",
        pieces: 10,
        wrapper: "sesamo",
        defaultFillings: ["camaron", "cebollin", "palta_relleno"],
      },
      {
        id: "ns6_r6",
        name: "Roll Sésamo Blanco",
        pieces: 10,
        wrapper: "sesamo",
        defaultFillings: ["pollo", "palta_relleno", "queso"],
      },
    ],
    image: "/images/Mega Mix 60.jpg",
  },
  {
    id: "new_s7",
    name: "Festival Gourmet (70p)",
    basePrice: 23500,
    description:
      "Una variedad amplia de sabores pensada para quienes les gusta degustar un poco de todo.",
    type: "STATIC",
    rolls: [
      {
        id: "ns7_r1",
        name: "Roll Ciboulette",
        pieces: 10,
        wrapper: "ciboulette",
        defaultFillings: ["pollo", "queso", "zanahoria"],
      },
      {
        id: "ns7_r2",
        name: "Roll Sésamo Mixto",
        pieces: 10,
        wrapper: "sesamo",
        defaultFillings: ["camaron", "palta_relleno", "cebollin"],
      },
      {
        id: "ns7_r3",
        name: "Roll Nori",
        pieces: 10,
        wrapper: "alganori",
        defaultFillings: ["kanikama", "queso", "palta_relleno"],
      },
      {
        id: "ns7_r4",
        name: "Roll Sésamo Blanco",
        pieces: 10,
        wrapper: "sesamo",
        defaultFillings: ["pollo", "palta_relleno", "cebollin"],
      },
      {
        id: "ns7_r5",
        name: "Roll Crocante",
        pieces: 10,
        wrapper: "frito",
        defaultFillings: ["camaron", "queso", "palta_relleno"],
      },
      {
        id: "ns7_r6",
        name: "Roll Sésamo Negro",
        pieces: 10,
        wrapper: "sesamo",
        defaultFillings: ["pollo", "cebollin", "queso"],
      },
      {
        id: "ns7_r7",
        name: "Roll Ciboulette Fino",
        pieces: 10,
        wrapper: "ciboulette",
        defaultFillings: ["camaron", "zanahoria", "queso"],
      },
    ],
    image: "/images/Festival Gourmet 70.jpg",
  },
  {
    id: "new_s8",
    name: "Deluxe (80p)",
    basePrice: 38000,
    description:
      "Una experiencia completa que mezcla texturas y sabores premium, ideal para grupos grandes o celebraciones.",
    type: "STATIC",
    rolls: [
      {
        id: "ns8_r1",
        name: "Roll Sésamo Blanco",
        pieces: 10,
        wrapper: "sesamo",
        defaultFillings: ["camaron", "queso", "palta_relleno"],
      },
      {
        id: "ns8_r2",
        name: "Roll Crocante",
        pieces: 10,
        wrapper: "frito",
        defaultFillings: ["pollo", "cebollin", "queso"],
      },
      {
        id: "ns8_r3",
        name: "Roll Nori",
        pieces: 10,
        wrapper: "alganori",
        defaultFillings: ["kanikama", "palta_relleno", "queso"],
      },
      {
        id: "ns8_r4",
        name: "Roll Ciboulette",
        pieces: 10,
        wrapper: "ciboulette",
        defaultFillings: ["pollo", "zanahoria", "cebollin"],
      },
      {
        id: "ns8_r5",
        name: "Roll Sésamo Mixto",
        pieces: 10,
        wrapper: "sesamo",
        defaultFillings: ["camaron", "palta_relleno", "cebollin"],
      },
      {
        id: "ns8_r6",
        name: "Roll Sésamo Negro",
        pieces: 10,
        wrapper: "sesamo",
        defaultFillings: ["pollo", "queso", "palta_relleno"],
      },
      {
        id: "ns8_r7",
        name: "Roll Crocante",
        pieces: 10,
        wrapper: "frito",
        defaultFillings: ["camaron", "zanahoria", "queso"],
      },
      {
        id: "ns8_r8",
        name: "Roll Ciboulette Fino",
        pieces: 10,
        wrapper: "ciboulette",
        defaultFillings: ["kanikama", "queso", "palta_relleno"],
      },
    ],
    image: "/images/Deluxe 80 Experience.jpg",
  },
  {
    id: "new_s9",
    name: "Gran Mar & Tierra (100p)",
    basePrice: 35000,
    description:
      "Nuestra promo más completa, con diez rolls diferentes para una celebración grande. Perfecta para 6–8 personas.",
    type: "STATIC",
    rolls: [
      {
        id: "ns9_r1",
        name: "Roll Sésamo Mixto",
        pieces: 10,
        wrapper: "sesamo",
        defaultFillings: ["pollo", "palta_relleno", "queso"],
      },
      {
        id: "ns9_r2",
        name: "Roll Crocante",
        pieces: 10,
        wrapper: "frito",
        defaultFillings: ["camaron", "cebollin", "queso"],
      },
      {
        id: "ns9_r3",
        name: "Roll Sésamo Negro",
        pieces: 10,
        wrapper: "sesamo",
        defaultFillings: ["kanikama", "palta_relleno", "queso"],
      },
      {
        id: "ns9_r4",
        name: "Roll Ciboulette",
        pieces: 10,
        wrapper: "ciboulette",
        defaultFillings: ["pollo", "cebollin", "zanahoria"],
      },
      {
        id: "ns9_r5",
        name: "Roll Nori",
        pieces: 10,
        wrapper: "alganori",
        defaultFillings: ["camaron", "palta_relleno", "cebollin"],
      },
      {
        id: "ns9_r6",
        name: "Roll Sésamo Blanco",
        pieces: 10,
        wrapper: "sesamo",
        defaultFillings: ["pollo", "queso", "palta_relleno"],
      },
      {
        id: "ns9_r7",
        name: "Roll Crocante",
        pieces: 10,
        wrapper: "frito",
        defaultFillings: ["kanikama", "cebollin", "queso"],
      },
      {
        id: "ns9_r8",
        name: "Roll Sésamo Mixto",
        pieces: 10,
        wrapper: "sesamo",
        defaultFillings: ["camaron", "zanahoria", "queso"],
      },
      {
        id: "ns9_r9",
        name: "Roll Nori",
        pieces: 10,
        wrapper: "alganori",
        defaultFillings: ["pollo", "palta_relleno", "cebollin"],
      },
      {
        id: "ns9_r10",
        name: "Roll Ciboulette Fino",
        pieces: 10,
        wrapper: "ciboulette",
        defaultFillings: ["camaron", "queso", "palta_relleno"],
      },
    ],
    image: "/images/Gran Mar & Tierra 100.jpg",
  },
  // PROMOS ORIGINALES
  {
    id: "s1",
    name: "Pack Intro (20p)",
    description: "10 California (Sésamo), 10 Frito (Pollo, Queso).",
    basePrice: 10990, // Precio fijo
    type: "STATIC",
    image: "/images/Pack Intro.jpg",
    rolls: [
      {
        id: "s1_r1",
        name: "California Roll",
        pieces: 10,
        wrapper: "sesamo",
        // Orden corregido: ["palta_relleno" (Básico), "queso" (Medio), "kanikama" (Especial)]
        defaultFillings: ["palta_relleno", "queso", "kanikama"],
      },
      {
        id: "s1_r2",
        name: "Frito Roll",
        pieces: 10,
        wrapper: "frito",
        // Orden corregido: ["cebollin" (Básico), "queso" (Medio), "pollo" (Especial)]
        defaultFillings: ["cebollin", "queso", "pollo"],
      },
    ],
  },
  {
    id: "s2",
    name: "Salmon Lover (10p)",
    // Descripción actualizada para incluir el Nivel 3
    description: "10 Rolls envueltos en Salmón con palta, queso y kanikama.",
    basePrice: 8990,
    type: "STATIC",
    image: "/images/Salmon Lover.jpg",
    rolls: [
      {
        id: "s2_r1",
        name: "Salmon Roll",
        pieces: 10,
        wrapper: "salmon",
        // Corregido: ["palta_relleno" (B), "queso" (M), "kanikama" (E)]
        defaultFillings: ["palta_relleno", "queso", "kanikama"],
      },
    ],
  },
];

export const EXTRAS = [
  {
    id: "e1",
    name: "Bebida Lata 350cc",
    description: "Elige tu sabor: Coca-Cola, Fanta o Sprite.", // Updated description
    price: 1500,
    type: "CONFIGURABLE", // Changed to CONFIGURABLE
    options: ["Coca-Cola", "Fanta", "Sprite"],
    image: "/images/Bebida Lata 350cc.jpg",
  },
  {
    id: "e2",
    name: "Porción Gyoza (5u)",
    description: "Elige entre Pollo o Cerdo.", // Updated description
    price: 3500,
    type: "CONFIGURABLE", // Changed to CONFIGURABLE
    options: ["Pollo", "Cerdo"],
    image: "/images/gyosas.jpg",
  },
  {
    id: "e3",
    name: "Salsas Extras", // Changed name
    description: "Elige el tipo: Soya o Agridulce. Botellita 50cc.", // Updated description
    price: 500,
    type: "CONFIGURABLE", // Changed to CONFIGURABLE
    options: ["Soya", "Agridulce"],
    image: "/images/salsas.jpg",
  },
  {
    id: "e4",
    name: "Palitos Extra", // New item
    description: "Agrega un par de palitos (chopsticks).",
    price: 300,
    type: "EXTRA",
    image: "/images/palitos.jpg",
  },
];
// --- FIN DATOS ---

export const BANK_DETAILS = {
  banco: "Banco Estado",
  tipo_cuenta: "Cuenta RUT",
  numero_cuenta: "12345678",
  rut: "12.345.678-9",
  email: "neosushi.app.prueba@gmail.com",
};

// --- OTROS TEXTOS FIJOS ---
export const BASE_ROLL_PRICE = 4990;

export const ABOUT_SECTION_DATA = {
  location: "Av. Neo Tokyo 2077, Local 4",
  commune: "Santiago, Chile",
  text: "Nacidos en el año 2077 (metafóricamente), NEO SUSHI fusiona la tradición milenaria japonesa con la tecnología de personalización más avanzada.",
  heroTitle: "EL FUTURO DEL SUSHI.",
  heroSubtitle: "DISEÑADO POR TI.",
  heroDescription:
    "Explora nuestras promos, diseña un roll desde cero o crea tu propia versión vegetariana.",
  footerText:
    "Reinventando la experiencia del sushi con tecnología y sabor desde el futuro.",
};

// --- CLAVE PARA ALMACENAR DATOS DE USUARIO ---
export const STORAGE_KEY = "neoSushiUserData";
