import React, { useState, useMemo, useEffect } from "react";
import {
  ShoppingCart,
  X,
  ChevronRight,
  Trash2,
  ShoppingBag,
  Zap,
  Disc,
  Layers,
  Info,
  ArrowLeft,
  MapPin,
  Store,
  Banknote,
  CreditCard,
  Copy,
  CheckCircle,
  Clock,
  Calendar,
  Navigation,
  Facebook,
  Instagram,
  Twitter,
  Phone,
  ArrowDown,
  Eye,
  Menu, // Importamos el ícono de menú hamburguesa
} from "lucide-react";

// --- DATOS DE NEGOCIO ---
// 1. NÚMERO DE TELÉFONO ACTUALIZADO
const LOCAL_PHONE_NUMBER = "56959984791";
const WHATSAPP_LINK = `https://wa.me/${LOCAL_PHONE_NUMBER}`;
const LOCAL_COMMUNE = "Santiago"; // <<< ¡IMPORTANTE! Cambia esto por la comuna de tu local (ej: "Providencia", "Quilicura", etc.)

// --- LÓGICA DE HORARIOS ---
const STORE_HOURS = {
  openDays: [2, 3, 4, 5, 6], // Martes (2) a Sábado (6). Domingo es 0, Lunes es 1.
  openTime: 18, // 18:00 (6 PM)
  closeTime: 24, // Cierra a medianoche (check es < 24, o sea 23:59)
};
const STORE_HOURS_STRING = "Mar - Sáb: 18:00 - 00:00 (Dom - Lun: Cerrado)";
// --- FIN LÓGICA DE HORARIOS ---

// Tiers con slots fijos: 0=Básico, 1=Medio, 2=Especial
const FILLING_TIERS = {
  BASIC: {
    id: "BASIC",
    label: "Nivel 1: Básico (Verduras)",
    color: "text-green-400",
    slotIndex: 0,
  },
  MID: {
    id: "MID",
    label: "Nivel 2: Medio (Cremoso)",
    color: "text-cyan-400",
    slotIndex: 1,
  },
  SPECIAL: {
    id: "SPECIAL",
    label: "Nivel 3: Especial (Proteína)",
    color: "text-fuchsia-400",
    slotIndex: 2,
  },
};

// PRECIOS DE LISTA
const FILLINGS = [
  // NIVEL BÁSICO
  { id: "cebollin", name: "Cebollín", tier: "BASIC", price: 300 },
  { id: "pepino", name: "Pepino", tier: "BASIC", price: 300 },
  { id: "ciboulette_relleno", name: "Ciboulette", tier: "BASIC", price: 300 },
  { id: "palta_relleno", name: "Palta", tier: "BASIC", price: 800 },
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
];
const VEGETARIAN_FILLINGS_DATA = FILLINGS.filter((f) =>
  VEGETARIAN_FILLING_IDS.includes(f.id)
);
// --- FIN: DATOS VEGETARIANOS ---

const WRAPPERS = {
  sesamo: { name: "Envuelto en Sésamo", price: 0 },
  ciboulette: { name: "Envuelto en Ciboulette", price: 0 },
  frito: { name: "Frito en Panko", price: 500 },
  palta: { name: "Envuelto en Palta", price: 1000 },
  queso: { name: "Envuelto en Queso Crema", price: 1000 },
  salmon: { name: "Envuelto en Salmón", price: 2000 },
};

// --- INICIO: NUEVOS DATOS VEGETARIANOS (ENVOLTURAS) ---
const VEGETARIAN_WRAPPERS = {
  sesamo: { name: "Envuelto en Sésamo", price: 0 },
  ciboulette: { name: "Envuelto en Ciboulette", price: 0 },
  frito: { name: "Frito en Panko", price: 500 },
  palta: { name: "Envuelto en Palta", price: 1000 },
  queso: { name: "Envuelto en Queso Crema", price: 1000 },
};
// --- FIN: NUEVOS DATOS VEGETARIANOS (ENVOLTURAS) ---

// --- DATOS DE MENÚ ---
const MODIFIABLE_PROMOS = [
  {
    id: "promo1",
    name: "Neo Start (12p)",
    basePrice: 6490,
    description: "1 Roll clásico. Configuración base incluida.",
    image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=80",
    rolls: [
      {
        id: "p1_r1",
        name: "Roll California",
        pieces: 12,
        wrapper: "sesamo",
        defaultFillings: ["cebollin", "queso", "kanikama"],
      },
    ],
  },
  {
    id: "promo2",
    name: "Cyber Duo (30p)",
    basePrice: 16990,
    description: "3 Rolls variados para compartir.",
    image: "https://images.unsplash.com/photo-1611143669185-af224c5e3252?auto=format&fit=crop&w=800&q=80",
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
        name: "Hosomaki Style",
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
    image: "https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=800&q=80",
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

const STATIC_PROMOS = [
  {
    id: "s1",
    name: "Pack Intro (20p)",
    description: "10 California (Sésamo), 10 Frito (Pollo, Queso).",
    basePrice: 10990, // Precio fijo
    type: "STATIC",
    image: "https://images.unsplash.com/photo-1617196019474-271a6f25f8da?auto=format&fit=crop&w=800&q=80",
    rolls: [
      {
        id: "s1_r1",
        name: "California Roll",
        pieces: 10,
        wrapper: "sesamo",
        defaultFillings: ["kanikama", "palta_relleno", "queso"],
      },
      {
        id: "s1_r2",
        name: "Frito Roll",
        pieces: 10,
        wrapper: "frito",
        defaultFillings: ["pollo", "queso", "cebollin"],
      },
    ],
  },
  {
    id: "s2",
    name: "Salmon Lover (10p)",
    description: "10 Rolls envueltos en Salmón con palta y queso.",
    basePrice: 8990,
    type: "STATIC",
    image: "https://images.unsplash.com/photo-1583623025817-d180a2221d0a?auto=format&fit=crop&w=800&q=80",
    rolls: [
      {
        id: "s2_r1",
        name: "Salmon Roll",
        pieces: 10,
        wrapper: "salmon",
        defaultFillings: ["palta_relleno", "queso", "ciboulette_relleno"],
      },
    ],
  },
];

const EXTRAS = [
  {
    id: "e1",
    name: "Bebida Lata 350cc",
    description: "Coca-Cola, Fanta o Sprite.",
    price: 1500,
    type: "EXTRA",
    image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "e2",
    name: "Porción Gyoza (5u)",
    description: "Empanaditas japonesas de cerdo.",
    price: 3500,
    type: "EXTRA",
    image: "https://images.unsplash.com/photo-1496116218417-1a781b1c423c?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "e3",
    name: "Salsa Soya Extra",
    description: "Botellita 50cc.",
    price: 500,
    type: "EXTRA",
    image: "https://images.unsplash.com/photo-1598353386499-9d45c8677771?auto=format&fit=crop&w=800&q=80",
  },
];
// --- FIN DATOS ---

const BANK_DETAILS = {
  banco: "Banco Estado",
  tipo_cuenta: "Cuenta RUT",
  numero_cuenta: "12345678",
  rut: "12.345.678-9",
  email: "pagos@neosushi.cl",
};

// --- CLAVE PARA ALMACENAR DATOS DE USUARIO ---
const STORAGE_KEY = 'neoSushiUserData';

// --- HELPERS ---
const formatPrice = (price) => `$${price.toLocaleString("es-CL")}`;
const getFillingById = (id) =>
  FILLINGS.find((f) => f.id === id) || {
    name: "Seleccionar",
    tier: "BASIC",
    price: 0,
  };
const getTodayDateStr = () =>
  new Date().toLocaleDateString("es-CL", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

// --- NUEVA FUNCIÓN DE HORARIO ---
const checkIfStoreIsOpen = () => {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0 = Domingo, 1 = Lunes, 2 = Martes...
  const currentHour = now.getHours(); // 0 - 23

  const { openDays, openTime, closeTime } = STORE_HOURS;

  if (!openDays.includes(dayOfWeek)) {
    return false; // Cerrado este día
  }

  // Manejo de medianoche (ej. 18:00 a 00:00)
  // Si la hora de cierre es 24 (medianoche)
  if (closeTime === 24) {
    return currentHour >= openTime; // Abierto desde las 18:00 hasta las 23:59
  }

  // Para horarios que cruzan medianoche (ej. 18:00 a 02:00 am) - No implementado, pero así sería
  // if (closeTime < openTime) {
  //   return currentHour >= openTime || currentHour < closeTime;
  // }

  // Horario normal (ej. 10:00 a 18:00)
  if (currentHour < openTime || currentHour >= closeTime) {
    return false; // Fuera de horario
  }

  return true;
};
// --- FIN HELPERS ---

// --- LÓGICA DE NEGOCIO ---
const calculateRollExtraPrice = (currentFillings, defaultFillings) => {
  let extraPrice = 0;
  currentFillings.forEach((fillingId, index) => {
    if (!fillingId) return;
    if (defaultFillings && fillingId !== defaultFillings[index]) {
      const filling = getFillingById(fillingId);
      extraPrice += filling.price;
    }
  });
  return extraPrice;
};

const calculatePromoTotal = (basePrice, rollsState, originalRollsData) => {
  let totalExtra = 0;
  rollsState.forEach((roll) => {
    const originalRoll = originalRollsData.find(
      (r) => r.id === roll.originalId
    );
    totalExtra += calculateRollExtraPrice(
      roll.fillings,
      originalRoll.defaultFillings
    );
  });
  return basePrice + totalExtra;
};

// --- COMPONENTES ---

function GlowingButton({
  children,
  onClick,
  className = "",
  variant = "primary",
  fullWidth = false,
  disabled = false,
  type = "button",
}) {
  const variants = {
    primary:
      "bg-cyan-500/20 text-cyan-300 border-cyan-500/50 hover:bg-cyan-500/40 hover:shadow-[0_0_20px_rgba(6,182,212,0.3)]",
    secondary:
      "bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/50 hover:bg-fuchsia-500/40 hover:shadow-[0_0_20px_rgba(217,70,239,0.3)]",
    ghost: "bg-white/5 text-slate-300 border-white/10 hover:bg-white/10",
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`relative overflow-hidden transition-all duration-300 font-medium tracking-wider py-3 px-6 rounded-xl backdrop-blur-md group disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 border ${
        variants[variant]
      } ${fullWidth ? "w-full" : ""} ${className}`}
    >
      {children}
    </button>
  );
}

// --- NUEVO MODAL DE ERROR DE HORARIO ---
function StoreClosedModal({ onClose, hours }) {
  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      <div className="relative w-full max-w-md bg-slate-900 border border-fuchsia-500/50 rounded-2xl shadow-2xl p-6 text-center animate-in zoom-in-95 duration-300">
        <div className="w-16 h-16 bg-fuchsia-500/10 rounded-full flex items-center justify-center mb-4 mx-auto border-4 border-fuchsia-500/20">
          <Clock size={32} className="text-fuchsia-400" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-3">Local Cerrado</h3>
        <p className="text-slate-300 mb-6">
          Lo sentimos, nuestro local se encuentra cerrado en este momento. Solo
          puedes realizar pedidos durante nuestro horario de atención:
        </p>
        <p className="font-medium text-cyan-300 bg-slate-800/50 py-3 rounded-lg">
          {hours}
        </p>
        <GlowingButton
          variant="primary"
          fullWidth
          onClick={onClose}
          className="mt-6"
        >
          Entendido
        </GlowingButton>
      </div>
    </div>
  );
}
// --- FIN MODAL ERROR ---

function IngredientSelector({
  tierKey,
  currentFillingId,
  defaultFillingId,
  onSelect,
  onClose,
}) {
  const tier = FILLING_TIERS[tierKey];
  const tierFillings = FILLINGS.filter((f) => f.tier === tierKey);
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md flex flex-col shadow-2xl">
        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-950/50">
          <h3
            className={`text-lg font-bold flex items-center gap-2 ${tier.color}`}
          >
            <Layers className="w-5 h-5" /> Elegir {tier.label}
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full text-slate-400"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-3 bg-yellow-500/10 border-b border-yellow-500/20 text-yellow-200 text-xs flex items-start gap-2">
          <Info size={14} className="shrink-0 mt-0.5" />
          <p>
            Cualquier cambio respecto a la receta original tendrá un costo
            adicional (precio de lista).
          </p>
        </div>
        <div className="p-4 grid grid-cols-1 gap-2 max-h-[60vh] overflow-y-auto custom-scrollbar">
          {tierFillings.map((ing) => {
            const isOriginal = ing.id === defaultFillingId;
            const isSelected = ing.id === currentFillingId;
            let displayPrice = isOriginal ? "Incluido" : `+$${ing.price}`;
            return (
              <button
                key={ing.id}
                onClick={() => onSelect(ing.id)}
                className={`p-3 text-sm text-left rounded-lg border transition-all flex justify-between ${
                  isSelected
                    ? `bg-${tier.color.split("-")[1]}-900/30 border-${
                        tier.color.split("-")[1]
                      }-500 text-white`
                    : "border-slate-700 bg-slate-800/50 text-slate-300 hover:bg-slate-700"
                }`}
              >
                <span>
                  {ing.name}{" "}
                  {isOriginal && (
                    <span className="ml-2 text-[10px] uppercase bg-white/10 px-1.5 py-0.5 rounded">
                      Original
                    </span>
                  )}
                </span>
                <span
                  className={`text-xs ${
                    displayPrice === "Incluido"
                      ? "text-green-400 font-medium"
                      : "opacity-70 text-cyan-300"
                  }`}
                >
                  {displayPrice}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// --- INICIO: NUEVO SELECTOR VEGETARIANO ---
function VeggieIngredientSelector({ currentFillingId, onSelect, onClose }) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md flex flex-col shadow-2xl">
        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-950/50">
          <h3
            className={`text-lg font-bold flex items-center gap-2 text-green-400`}
          >
            <Layers className="w-5 h-5" /> Elegir Relleno Vegetariano
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full text-slate-400"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-3 bg-green-500/10 border-b border-green-500/20 text-green-200 text-xs flex items-start gap-2">
          <Info size={14} className="shrink-0 mt-0.5" />
          <p>
            El precio base del roll es de ${4990}. Cada ingrediente que elijas
            sumará su precio de lista al total.
          </p>
        </div>
        <div className="p-4 grid grid-cols-1 gap-2 max-h-[60vh] overflow-y-auto custom-scrollbar">
          {VEGETARIAN_FILLINGS_DATA.map((ing) => {
            const isSelected = ing.id === currentFillingId;
            let displayPrice = `+$${ing.price}`;
            return (
              <button
                key={ing.id}
                onClick={() => onSelect(ing.id)}
                className={`p-3 text-sm text-left rounded-lg border transition-all flex justify-between ${
                  isSelected
                    ? `bg-green-900/30 border-green-500 text-white`
                    : "border-slate-700 bg-slate-800/50 text-slate-300 hover:bg-slate-700"
                }`}
              >
                <span>{ing.name}</span>
                <span className={`text-xs opacity-70 text-cyan-300`}>
                  {displayPrice}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
// --- FIN: NUEVO SELECTOR VEGETARIANO ---

// Modal de Promo con guías
function PromoBuilderModal({
  promo,
  onClose,
  onAddToCart,
  isReadOnly = false,
}) {
  const [rollsState, setRollsState] = useState(
    promo.rolls.map((r) => ({
      originalId: r.id,
      name: r.name,
      pieces: r.pieces,
      wrapperKey: r.wrapper,
      fillings: [...r.defaultFillings],
    }))
  );
  const [activeConfig, setActiveConfig] = useState({
    rollIndex: null,
    slotIndex: null,
    tierKey: null,
  });

  const handleFillingSelect = (fillingId) => {
    if (isReadOnly) return;
    const newRollsState = [...rollsState];
    newRollsState[activeConfig.rollIndex].fillings[activeConfig.slotIndex] =
      fillingId;
    setRollsState(newRollsState);
    setActiveConfig({ rollIndex: null, slotIndex: null, tierKey: null });
  };

  const currentTotal = useMemo(() => {
    return isReadOnly
      ? promo.basePrice
      : calculatePromoTotal(promo.basePrice, rollsState, promo.rolls);
  }, [isReadOnly, promo, rollsState]);

  const SLOT_TIERS = [
    FILLING_TIERS.BASIC,
    FILLING_TIERS.MID,
    FILLING_TIERS.SPECIAL,
  ];

  const itemForCart = {
    ...promo,
    type: promo.type || "PROMO",
    configuredRolls: rollsState,
    totalPrice: currentTotal,
    uuid: Date.now(),
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center sm:p-4">
      <div
        className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      <div className="relative w-full max-w-4xl bg-[#0c0c1d] sm:border border-white/10 sm:rounded-3xl shadow-2xl overflow-hidden h-full sm:h-auto sm:max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-300">
        <div className="p-6 bg-slate-900/90 border-b border-white/5 flex justify-between items-start shrink-0">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500">
              {promo.name}
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              {isReadOnly
                ? "Detalle de la promoción (fija)."
                : "Configura los rellenos de cada Roll."}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-white/5 rounded-full text-white hover:bg-white/20"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-4 sm:p-6 overflow-y-auto custom-scrollbar grow bg-[#0a0a15]">
          {isReadOnly ? (
            <div className="p-3 mb-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-200 text-sm flex items-start gap-3 mx-4 sm:mx-0">
              <Info size={18} className="shrink-0 mt-0.5" />
              <p>
                Esta es una promo de precio fijo. Los ingredientes no se pueden
                cambiar, ¡listos para disfrutar!
              </p>
            </div>
          ) : (
            <div className="p-3 mb-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-200 text-sm flex items-start gap-3 mx-4 sm:mx-0">
              <Info size={18} className="shrink-0 mt-0.5" />
              <p>
                ¡Haz clic en cualquier relleno (Básico, Medio o Especial) para
                cambiarlo! <br />
                Recuerda: El precio del roll original es un "pack".{" "}
                <strong className="font-medium">
                  Cualquier cambio se cobra
                </strong>{" "}
                según el precio de lista del nuevo ingrediente.
              </p>
            </div>
          )}

          <div className="space-y-6">
            {rollsState.map((roll, rollIdx) => {
              return (
                <div
                  key={rollIdx}
                  className="p-4 rounded-2xl bg-slate-900/50 border border-white/5"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-cyan-900/30 flex items-center justify-center border border-cyan-500/30">
                      <Disc size={20} className="text-cyan-400" />
                    </div>
                    <div>
                      <h4 className="text-white font-bold">
                        {roll.name}{" "}
                        <span className="text-slate-500 text-sm font-normal">
                          ({roll.pieces} cortes)
                        </span>
                      </h4>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-slate-400">Envoltura:</span>
                        <span className="px-2 py-0.5 rounded-full bg-slate-800 text-cyan-200 border border-cyan-900">
                          {WRAPPERS[roll.wrapperKey]?.name}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {SLOT_TIERS.map((tier, slotIdx) => {
                      const fillingId = roll.fillings[slotIdx];
                      const filling = getFillingById(fillingId);
                      const originalFillingId =
                        promo.rolls[rollIdx].defaultFillings[slotIdx];
                      const isChanged = fillingId !== originalFillingId;
                      const SlotComponent = isReadOnly ? "div" : "button";

                      return (
                        <SlotComponent
                          key={slotIdx}
                          onClick={
                            isReadOnly
                              ? undefined
                              : () =>
                                  setActiveConfig({
                                    rollIndex: rollIdx,
                                    slotIndex: slotIdx,
                                    tierKey: tier.id,
                                  })
                          }
                          className={`relative p-3 rounded-xl border transition-all text-left group ${
                            isReadOnly
                              ? "bg-slate-950/50 border-slate-800 cursor-default"
                              : `hover:border-${
                                  tier.color.split("-")[1]
                                }-500/50 ${
                                  isChanged
                                    ? "bg-slate-900/80 border-yellow-500/50"
                                    : "bg-slate-950/50 border-slate-800"
                                }`
                          }`}
                        >
                          <div
                            className={`text-[10px] uppercase mb-1 font-bold ${tier.color}`}
                          >
                            {tier.label}
                          </div>
                          <div className="font-medium text-slate-200 truncate pr-6">
                            {filling.name}
                          </div>
                          {isChanged && !isReadOnly && (
                            <div className="text-[10px] text-yellow-400 absolute top-3 right-8 font-bold">
                              +${filling.price}
                            </div>
                          )}
                          {!isReadOnly && (
                            <ChevronRight
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-700 group-hover:text-white transition-colors"
                              size={16}
                            />
                          )}
                        </SlotComponent>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="p-6 bg-slate-900/90 border-t border-white/5 shrink-0 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-slate-400 text-sm">Total Promoción</span>
            <div className="text-3xl font-bold text-white">
              {formatPrice(currentTotal)}
            </div>
          </div>
          <GlowingButton
            variant="primary"
            className="w-full sm:w-auto min-w-[220px]"
            onClick={() => onAddToCart(itemForCart)}
          >
            <ShoppingBag size={20} />{" "}
            {isReadOnly ? "Agregar al Pedido" : "Confirmar y Agregar"}
          </GlowingButton>
        </div>
      </div>
      {!isReadOnly && activeConfig.tierKey && (
        <IngredientSelector
          tierKey={activeConfig.tierKey}
          currentFillingId={
            rollsState[activeConfig.rollIndex].fillings[activeConfig.slotIndex]
          }
          defaultFillingId={
            promo.rolls[activeConfig.rollIndex].defaultFillings[
              activeConfig.slotIndex
            ]
          }
          onSelect={handleFillingSelect}
          onClose={() =>
            setActiveConfig({ rollIndex: null, slotIndex: null, tierKey: null })
          }
        />
      )}
    </div>
  );
}

function CustomRollBuilder({ onClose, onAddToCart }) {
  const [step, setStep] = useState(1);
  const [selectedWrapper, setSelectedWrapper] = useState(null);
  const [fillings, setFillings] = useState([null, null, null]);
  const [activeSlot, setActiveSlot] = useState(null);
  const baseRollPrice = 4990;
  const currentTotal = useMemo(() => {
    let total = baseRollPrice;
    if (selectedWrapper) total += WRAPPERS[selectedWrapper].price;
    fillings.forEach((fId) => {
      if (fId) total += getFillingById(fId).price;
    });
    return total;
  }, [selectedWrapper, fillings]);
  const isReadyToAdd = selectedWrapper && fillings.every((f) => f !== null);
  const handleCustomFillingSelect = (id) => {
    const nf = [...fillings];
    nf[activeSlot] = id;
    setFillings(nf);
    setActiveSlot(null);
  };
  const SLOT_TIERS = [
    FILLING_TIERS.BASIC,
    FILLING_TIERS.MID,
    FILLING_TIERS.SPECIAL,
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center sm:p-4">
      <div
        className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      <div className="relative w-full max-w-2xl bg-[#0c0c1d] sm:border border-white/10 sm:rounded-3xl shadow-[0_0_50px_rgba(217,70,239,0.3)] overflow-hidden flex flex-col animate-in slide-in-from-bottom duration-300 max-h-[90vh]">
        <div className="p-6 bg-slate-900/90 border-b border-white/5 flex justify-between">
          <h2 className="text-2xl font-black text-fuchsia-400 flex items-center gap-2">
            <Zap /> NEO-LAB (10p)
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X />
          </button>
        </div>
        <div className="p-6 overflow-y-auto grow custom-scrollbar">
          {step === 1 ? (
            <>
              <h3 className="text-lg font-bold text-white mb-4">
                Paso 1: Elige tu Envoltura
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Object.entries(WRAPPERS).map(([key, wrapper]) => (
                  <button
                    key={key}
                    onClick={() => {
                      setSelectedWrapper(key);
                      setStep(2);
                    }}
                    className="p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-fuchsia-500/20 hover:border-fuchsia-500 transition-all text-left"
                  >
                    <span className="font-bold text-white block mb-1">
                      {wrapper.name}
                    </span>
                    <span className="text-fuchsia-300 text-sm">
                      {wrapper.price === 0 ? "Incluido" : `+$${wrapper.price}`}
                    </span>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div className="space-y-6">
              <div className="flex justify-between items-center p-4 bg-slate-900 rounded-xl border border-white/10">
                <span className="text-slate-400">Envoltura:</span>
                <span className="font-bold text-cyan-300">
                  {WRAPPERS[selectedWrapper].name}
                </span>
                <button
                  onClick={() => setStep(1)}
                  className="text-xs underline text-slate-500 hover:text-white"
                >
                  Cambiar
                </button>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                Paso 2: Configura tus 3 Rellenos
              </h3>
              <div className="p-3 -mt-2 rounded-xl bg-fuchsia-500/10 border border-fuchsia-500/20 text-fuchsia-200 text-sm flex items-start gap-3">
                <Info size={18} className="shrink-0 mt-0.5" />
                <p>
                  Debes seleccionar exactamente un ingrediente de cada nivel
                  (Básico, Medio y Especial) para crear tu roll.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {SLOT_TIERS.map((tier, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveSlot(idx)}
                    className={`p-4 rounded-xl border transition-all text-left relative min-h-[100px] flex flex-col justify-center ${
                      fillings[idx]
                        ? `border-${tier.color.split("-")[1]}-500/50 bg-${
                            tier.color.split("-")[1]
                          }-500/10`
                        : "border-dashed border-slate-700 hover:border-white/30 bg-slate-900/50"
                    }`}
                  >
                    <div
                      className={`text-[10px] uppercase mb-2 font-bold ${tier.color}`}
                    >
                      {tier.label}
                    </div>
                    {fillings[idx] ? (
                      <div className="font-medium text-slate-200">
                        {getFillingById(fillings[idx]).name}
                      </div>
                    ) : (
                      <span className="text-slate-500 italic">Elegir...</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="p-6 bg-slate-900/90 border-t border-white/5 shrink-0 flex justify-between items-center">
          <div>
            <div className="text-slate-400 text-xs">Total Roll Custom</div>
            <div className="text-3xl font-bold text-white">
              {formatPrice(currentTotal)}
            </div>
          </div>
          {step === 2 && (
            <GlowingButton
              variant="secondary"
              disabled={!isReadyToAdd}
              onClick={() =>
                onAddToCart({
                  type: "CUSTOM",
                  name: "Neo Custom Roll",
                  pieces: 10,
                  wrapperKey: selectedWrapper,
                  fillings,
                  totalPrice: currentTotal,
                  uuid: Date.now(),
                })
              }
            >
              Terminar Roll
            </GlowingButton>
          )}
        </div>
      </div>
      {activeSlot !== null && (
        <IngredientSelector
          tierKey={SLOT_TIERS[activeSlot].id}
          currentFillingId={fillings[activeSlot]}
          defaultFillingId={null}
          onSelect={handleCustomFillingSelect}
          onClose={() => setActiveSlot(null)}
        />
      )}
    </div>
  );
}

// --- INICIO: NUEVO CONSTRUCTOR VEGETARIANO ---
function VeggieRollBuilder({ onClose, onAddToCart }) {
  const [step, setStep] = useState(1);
  const [selectedWrapper, setSelectedWrapper] = useState(null);
  const [fillings, setFillings] = useState([null, null, null]); // 3 slots
  const [activeSlot, setActiveSlot] = useState(null); // 0, 1, or 2
  const baseRollPrice = 4990; // Mismo precio base que el custom

  // Lógica de precio: Base + Envoltura + 3 Rellenos
  const currentTotal = useMemo(() => {
    let total = baseRollPrice;
    if (selectedWrapper) total += WRAPPERS[selectedWrapper].price;
    fillings.forEach((fId) => {
      if (fId) total += getFillingById(fId).price;
    });
    return total;
  }, [selectedWrapper, fillings]);

  const isReadyToAdd = selectedWrapper && fillings.every((f) => f !== null);

  const handleVeggieFillingSelect = (id) => {
    const newFillings = [...fillings];
    newFillings[activeSlot] = id;
    setFillings(newFillings);
    setActiveSlot(null);
  };

  const slotLabels = ["Primer Relleno", "Segundo Relleno", "Tercer Relleno"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center sm:p-4">
      <div
        className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      <div className="relative w-full max-w-2xl bg-[#0c0c1d] sm:border border-white/10 sm:rounded-3xl shadow-[0_0_50px_rgba(6,182,212,0.3)] overflow-hidden flex flex-col animate-in slide-in-from-bottom duration-300 max-h-[90vh]">
        <div className="p-6 bg-slate-900/90 border-b border-white/5 flex justify-between">
          <h2 className="text-2xl font-black text-cyan-400 flex items-center gap-2">
            <Eye /> Roll Vegetariano (10p)
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X />
          </button>
        </div>
        <div className="p-6 overflow-y-auto grow custom-scrollbar">
          {step === 1 ? (
            <>
              <h3 className="text-lg font-bold text-white mb-4">
                Paso 1: Elige tu Envoltura
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Object.entries(VEGETARIAN_WRAPPERS).map(([key, wrapper]) => (
                  <button
                    key={key}
                    onClick={() => {
                      setSelectedWrapper(key);
                      setStep(2);
                    }}
                    className="p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-cyan-500/20 hover:border-cyan-500 transition-all text-left"
                  >
                    <span className="font-bold text-white block mb-1">
                      {wrapper.name}
                    </span>
                    <span className="text-cyan-300 text-sm">
                      {wrapper.price === 0 ? "Incluido" : `+$${wrapper.price}`}
                    </span>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div className="space-y-6">
              <div className="flex justify-between items-center p-4 bg-slate-900 rounded-xl border border-white/10">
                <span className="text-slate-400">Envoltura:</span>
                <span className="font-bold text-cyan-300">
                  {WRAPPERS[selectedWrapper].name}
                </span>
                <button
                  onClick={() => setStep(1)}
                  className="text-xs underline text-slate-500 hover:text-white"
                >
                  Cambiar
                </button>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                Paso 2: Elige 3 Rellenos Veggie
              </h3>
              <div className="p-3 -mt-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-200 text-sm flex items-start gap-3">
                <Info size={18} className="shrink-0 mt-0.5" />
                <p>
                  Selecciona 3 ingredientes de nuestra lista vegetariana. Puedes
                  repetir ingredientes si lo deseas.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {slotLabels.map((label, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveSlot(idx)}
                    className={`p-4 rounded-xl border transition-all text-left relative min-h-[100px] flex flex-col justify-center ${
                      fillings[idx]
                        ? `border-cyan-500/50 bg-cyan-500/10`
                        : "border-dashed border-slate-700 hover:border-white/30 bg-slate-900/50"
                    }`}
                  >
                    <div
                      className={`text-[10px] uppercase mb-2 font-bold text-cyan-400`}
                    >
                      {label}
                    </div>
                    {fillings[idx] ? (
                      <div className="font-medium text-slate-200">
                        {getFillingById(fillings[idx]).name}
                      </div>
                    ) : (
                      <span className="text-slate-500 italic">Elegir...</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="p-6 bg-slate-900/90 border-t border-white/5 shrink-0 flex justify-between items-center">
          <div>
            <div className="text-slate-400 text-xs">Total Roll Veggie</div>
            <div className="text-3xl font-bold text-white">
              {formatPrice(currentTotal)}
            </div>
          </div>
          {step === 2 && (
            <GlowingButton
              variant="primary" // Botón primario (cyan)
              disabled={!isReadyToAdd}
              onClick={() =>
                onAddToCart({
                  type: "VEGGIE", // Nuevo tipo
                  name: "Roll Veggie Custom", // Nuevo nombre
                  pieces: 10,
                  wrapperKey: selectedWrapper,
                  fillings,
                  totalPrice: currentTotal,
                  uuid: Date.now(),
                })
              }
            >
              Terminar Roll Veggie
            </GlowingButton>
          )}
        </div>
      </div>
      {/* Llama al nuevo selector vegetariano */}
      {activeSlot !== null && (
        <VeggieIngredientSelector
          currentFillingId={fillings[activeSlot]}
          onSelect={handleVeggieFillingSelect}
          onClose={() => setActiveSlot(null)}
        />
      )}
    </div>
  );
}
// --- FIN: NUEVO CONSTRUCTOR VEGETARIANO ---

// --- COMPONENTE CORREGIDO ---
function CartDrawer({
  isOpen,
  onClose,
  items,
  onRemove,
  total,
  onCheckout,
  onClearCart,
}) {
  const cartBodyRef = React.useRef(null); // Ref para el cuerpo del carrito

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      // --- INICIO: SCROLL AL TOPE ---
      // Resetea el scroll del carrito al abrir
      if (cartBodyRef.current) {
        cartBodyRef.current.scrollTop = 0;
      }
      // --- FIN: SCROLL AL TOPE ---
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);
  return (
    <>
      <div
        className={`fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[100] transition-opacity ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[450px] bg-[#0a0a18] border-l border-white/10 shadow-2xl z-[101] transform transition-transform duration-300 ease-out flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-6 border-b border-white/5 flex items-center justify-between bg-slate-900/90">
          <h2 className="text-xl font-bold text-white flex items-center gap-3">
            <ShoppingCart className="text-cyan-400" /> Pedido Cuántico
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X size={24} />
          </button>
        </div>
        <div
          ref={cartBodyRef} // Añadir ref al div scrollable
          className="flex-grow overflow-y-auto p-4 space-y-4 custom-scrollbar bg-slate-950/50"
        >
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 opacity-50">
              <ShoppingBag size={64} className="mb-4" />
              <p>Vacío.</p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.uuid}
                className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden relative group"
              >
                <div className="p-4 bg-slate-900/50 flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-cyan-300">{item.name}</h3>
                    <p className="text-xs text-slate-400">
                      {/* --- INICIO: LÓGICA DE TIPO ACTUALIZADA --- */}
                      {item.type === "PROMO"
                        ? "Promo Modificable"
                        : item.type === "CUSTOM"
                        ? "Roll Personalizado"
                        : item.type === "STATIC"
                        ? "Promo Estática"
                        : item.type === "VEGGIE"
                        ? "Roll Vegetariano" // <-- NUEVA LÍNEA
                        : "Extra"}
                      {/* --- FIN: LÓGICA DE TIPO ACTUALIZADA --- */}
                    </p>
                  </div>
                  {/* Se añadió pr-10 para dar espacio al botón de eliminar */}
                  <span className="font-bold text-white pr-10">
                    {formatPrice(item.totalPrice)}
                  </span>
                </div>
                {/* --- INICIO: LÓGICA DE RENDERIZADO DE ITEMS CORREGIDA --- */}
                {item.type === "PROMO" || item.type === "STATIC" ? (
                  // Lógica para promos (modificables o estáticas)
                  <div className="p-4 space-y-3 text-sm border-t border-white/5">
                    {(item.configuredRolls || item.rolls).map((roll, idx) => (
                      <div
                        key={idx}
                        className="pl-3 border-l-2 border-slate-700"
                      >
                        <div className="text-slate-200 font-medium">
                          {roll.name}{" "}
                          <span className="text-slate-500 text-xs">
                            (
                            {WRAPPERS[roll.wrapperKey]
                              ? WRAPPERS[roll.wrapperKey].name
                              : "N/A"}
                            )
                          </span>
                        </div>
                        <div className="text-slate-400 text-xs leading-tight mt-1">
                          {(roll.fillings || roll.defaultFillings)
                            .map((fid) => getFillingById(fid).name)
                            .join(" • ")}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : item.type === "CUSTOM" || item.type === "VEGGIE" ? ( // <-- LÓGICA ACTUALIZADA
                  // Lógica específica para Roll Custom (Neo-Lab) y Veggie
                  <div className="p-4 space-y-3 text-sm border-t border-white/5">
                    <div className="pl-3 border-l-2 border-slate-700">
                      <div className="text-slate-200 font-medium">
                        Envoltura:{" "}
                        <span className="text-cyan-300 text-xs">
                          {WRAPPERS[item.wrapperKey]
                            ? WRAPPERS[item.wrapperKey].name
                            : "N/A"}
                        </span>
                      </div>
                      <div className="text-slate-400 text-xs leading-tight mt-1">
                        Rellenos:{" "}
                        {item.fillings
                          .map((fid) => getFillingById(fid).name)
                          .join(" • ")}
                      </div>
                    </div>
                  </div>
                ) : (
                  // Lógica para Extras (bebidas, etc.)
                  <p className="p-4 text-sm text-slate-400 border-t border-white/5">
                    {item.description}
                  </p>
                )}
                {/* --- FIN: LÓGICA DE RENDERIZADO DE ITEMS CORREGIDA --- */}
                <button
                  onClick={() => onRemove(item.uuid)}
                  className="absolute top-2 right-2 p-2 text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all bg-slate-900/80 rounded-full"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          )}
        </div>
        <div className="p-6 border-t border-white/10 bg-slate-900 shrink-0">
          <div className="flex justify-between items-center mb-6">
            <span className="text-slate-400">Total Final</span>
            <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500">
              {formatPrice(total)}
            </span>
          </div>
          {/* LÓGICA DE BOTÓN DESHABILITADO Y NUEVOS BOTONES */}
          <div className="space-y-3">
            <GlowingButton
              variant="primary"
              fullWidth
              disabled={items.length === 0}
              onClick={onCheckout}
            >
              Continuar con Pedido
            </GlowingButton>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={onClose}
                className="flex items-center justify-center gap-2 p-3 rounded-xl border border-white/10 text-slate-400 hover:text-white hover:bg-white/5 transition-colors text-sm font-medium"
              >
                <ArrowLeft size={16} /> Seguir Viendo
              </button>
              <button
                onClick={onClearCart}
                disabled={items.length === 0}
                className="flex items-center justify-center gap-2 p-3 rounded-xl border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Trash2 size={16} /> Vaciar Todo
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
// --- FIN COMPONENTE CORREGIDO ---

// --- CHECKOUT ACTUALIZADO CON LÓGICA DE HORARIO ---
function CheckoutView({ cartItems, total, onBack, onCompleteOrder }) {
  // --- INICIO: LÓGICA DE AUTOCOMPLETAR ---
  // Carga los datos del usuario desde localStorage o usa un estado vacío
  const [formData, setFormData] = useState(() => {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        // Asegurarnos de que los campos esenciales no sean undefined
        const parsed = JSON.parse(savedData);
        return {
          fullName: parsed.fullName || "",
          phone: parsed.phone || "",
          deliveryType: parsed.deliveryType || "delivery",
          address: parsed.address || "",
          commune: parsed.commune || "",
          reference: parsed.reference || "",
          paymentMethod: parsed.paymentMethod || "transfer",
          cashAmount: parsed.cashAmount || "",
        };
      }
    } catch (e) {
      console.error("No se pudo cargar los datos del usuario:", e);
    }
    // Estado por defecto si no hay nada guardado
    return {
      fullName: "",
      phone: "",
      deliveryType: "delivery",
      address: "",
      commune: "",
      reference: "",
      paymentMethod: "transfer",
      cashAmount: "",
    };
  });

  // Guardar en localStorage cada vez que formData cambie
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
  }, [formData]);
  // --- FIN: LÓGICA DE AUTOCOMPLETAR ---

  // Nuevo estado para el modal de error
  const [showClosedError, setShowClosedError] = useState(false);
  // --- INICIO: NUEVO ESTADO PARA TABS DE PAGO ---
  const [paymentTab, setPaymentTab] = useState("transfer"); // 'transfer' o 'mercadopago'
  // --- FIN: NUEVO ESTADO ---

  // --- NUEVA LÓGICA DE CÁLCULO DE DESPACHO ---
  const { deliveryFee, finalTotal } = useMemo(() => {
    let fee = 0;
    if (formData.deliveryType === "delivery") {
      const commune = formData.commune.trim().toLowerCase();
      if (commune.length > 0) {
        // Comparamos en minúsculas y sin espacios
        if (commune === LOCAL_COMMUNE.toLowerCase()) {
          fee = 2000;
        } else {
          fee = 3000;
        }
      }
      // Si la comuna está vacía, la tarifa es 0 (aún no se cobra)
    }
    return { deliveryFee: fee, finalTotal: total + fee };
  }, [total, formData.deliveryType, formData.commune]);
  // --- FIN LÓGICA DE CÁLCULO ---

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone" && !/^\d*$/.test(value)) return;

    // --- INICIO: CAMBIO 2 (LÓGICA) ---
    if (name === "cashAmount") {
      // 1. Quitar puntos y caracteres no numéricos
      const rawValue = value.replace(/\D/g, "");
      // 2. Actualizar el estado solo con los números
      setFormData((prev) => ({ ...prev, [name]: rawValue }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    // --- FIN: CAMBIO 2 (LÓGICA) ---
  };
  const isFormValid = useMemo(() => {
    if (!formData.fullName || formData.phone.length < 8) return false;
    if (
      formData.deliveryType === "delivery" &&
      (!formData.address || !formData.commune)
    )
      return false;
    if (formData.paymentMethod === "cash" && !formData.cashAmount) return false;
    return true;
  }, [formData]);

  // Handler de envío actualizado
  const handleSubmit = (e) => {
    e.preventDefault();

    // 1. Revisar si la tienda está abierta
    if (!checkIfStoreIsOpen()) {
      setShowClosedError(true); // Muestra el modal de error
      return; // Detiene el envío
    }

    // 2. Revisar si el formulario es válido (ya estaba)
    if (!isFormValid) return;

    // 3. Enviar orden (solo si está abierto y es válido)
    onCompleteOrder(formData);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl animate-in fade-in">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft size={20} /> Volver al Menú
      </button>
      {/* 2. TÍTULO ACTUALIZADO */}
      <h2 className="text-3xl font-black text-white mb-8 flex items-center gap-3 border-b border-white/10 pb-4">
        <CreditCard className="text-fuchsia-500" /> Finalizar Pedido
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Sección 1: Datos */}
          <section className="space-y-4">
            <h3 className="text-xl font-bold text-cyan-400 mb-4">
              1. Tus Datos
            </h3>
            <div>
              <label className="block text-sm text-slate-400 mb-1">
                Nombre Completo *
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                required
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-cyan-500 focus:outline-none transition-colors"
                placeholder="Ej: Juan Pérez"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">
                Teléfono (Solo números) *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
                maxLength={11}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-cyan-500 focus:outline-none transition-colors"
                placeholder="Ej: 912345678"
              />
            </div>
          </section>
          {/* Sección 2: Entrega */}
          <section className="space-y-4">
            <h3 className="text-xl font-bold text-cyan-400 mb-4">
              2. Tipo de Entrega
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() =>
                  setFormData({ ...formData, deliveryType: "delivery" })
                }
                className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                  formData.deliveryType === "delivery"
                    ? "bg-cyan-500/20 border-cyan-500 text-white"
                    : "bg-slate-900/50 border-slate-700 text-slate-400 hover:bg-slate-800"
                }`}
              >
                <MapPin /> Delivery
              </button>
              <button
                type="button"
                onClick={() =>
                  setFormData({ ...formData, deliveryType: "pickup" })
                }
                className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                  formData.deliveryType === "pickup"
                    ? "bg-cyan-500/20 border-cyan-500 text-white"
                    : "bg-slate-900/50 border-slate-700 text-slate-400 hover:bg-slate-800"
                }`}
              >
                <Store /> Retiro en Local
              </button>
            </div>
            {formData.deliveryType === "delivery" ? (
              <div className="space-y-4 animate-in slide-in-from-top-2">
                <div>
                  <label className="block text-sm text-slate-400 mb-1">
                    Dirección *
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required={formData.deliveryType === "delivery"}
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-cyan-500"
                    placeholder="Calle y número"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">
                      Comuna *
                    </label>
                    <input
                      type="text"
                      name="commune"
                      value={formData.commune}
                      onChange={handleInputChange}
                      required={formData.deliveryType === "delivery"}
                      className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-cyan-500"
                      placeholder="Ej: Santiago"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">
                      Referencia (Opcional)
                    </label>
                    <input
                      type="text"
                      name="reference"
                      value={formData.reference}
                      onChange={handleInputChange}
                      className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-cyan-500"
                      placeholder="Ej: Portón negro"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-fuchsia-500/10 border border-fuchsia-500/30 rounded-xl text-fuchsia-200 text-sm animate-in slide-in-from-top-2 space-y-2">
                <p>
                  <Store className="inline mr-2 mb-1" size={16} /> Retiro en:{" "}
                  <strong>Av. Neo Tokyo 2077, Local 4</strong>.
                </p>
                <p className="flex items-center gap-2 text-cyan-300 font-medium border-t border-fuchsia-500/20 pt-2 mt-2">
                  <Calendar size={16} /> Fecha de retiro: {getTodayDateStr()}
                </p>
              </div>
            )}
          </section>
          {/* Sección 3: Pago */}
          <section className="space-y-4">
            <h3 className="text-xl font-bold text-cyan-400 mb-4">
              3. Forma de Pago
            </h3>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() =>
                  setFormData({ ...formData, paymentMethod: "transfer" })
                }
                className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                  formData.paymentMethod === "transfer"
                    ? "bg-fuchsia-500/20 border-fuchsia-500 text-white"
                    : "bg-slate-900/50 border-slate-700 text-slate-400 hover:bg-slate-800"
                }`}
              >
                <Banknote /> Transferencia / MP
              </button>
              <button
                type="button"
                onClick={() =>
                  setFormData({ ...formData, paymentMethod: "cash" })
                }
                className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                  formData.paymentMethod === "cash"
                    ? "bg-fuchsia-500/20 border-fuchsia-500 text-white"
                    : "bg-slate-900/50 border-slate-700 text-slate-400 hover:bg-slate-800"
                }`}
              >
                <Banknote /> Efectivo
              </button>
              {/* --- INICIO: NUEVO BOTÓN DE PAGO --- */}
              <button
                type="button"
                onClick={() => setFormData({ ...formData, paymentMethod: "pos" })}
                className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                  formData.paymentMethod === "pos"
                    ? "bg-fuchsia-500/20 border-fuchsia-500 text-white"
                    : "bg-slate-900/50 border-slate-700 text-slate-400 hover:bg-slate-800"
                }`}
              >
                <CreditCard /> Débito / Crédito
              </button>
              {/* --- FIN: NUEVO BOTÓN DE PAGO --- */}
            </div>
            {formData.paymentMethod === "transfer" ? (
              <div className="bg-slate-900/80 border border-slate-700 rounded-xl p-4 space-y-4 text-sm animate-in slide-in-from-top-2">
                {/* --- INICIO: CONTROLADOR DE TABS --- */}
                <div className="grid grid-cols-2 gap-2 p-1 bg-slate-950/50 rounded-lg">
                  <button
                    type="button"
                    onClick={() => setPaymentTab("transfer")}
                    className={`py-2 px-3 rounded-md text-xs font-bold transition-all ${
                      paymentTab === "transfer"
                        ? "bg-fuchsia-500/50 text-white shadow"
                        : "text-slate-400 hover:bg-slate-800"
                    }`}
                  >
                    Datos de Transferencia
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentTab("mercadopago")}
                    className={`py-2 px-3 rounded-md text-xs font-bold transition-all ${
                      paymentTab === "mercadopago"
                        ? "bg-fuchsia-500/50 text-white shadow"
                        : "text-slate-400 hover:bg-slate-800"
                    }`}
                  >
                    Mercado Pago
                  </button>
                </div>
                {/* --- FIN: CONTROLADOR DE TABS --- */}

                {/* --- INICIO: CONTENIDO DE TABS --- */}
                {paymentTab === "transfer" ? (
                  <div className="animate-in fade-in duration-200 space-y-3">
                    <p className="text-slate-400 text-xs mb-2">
                      Copia los datos para transferir:
                    </p>
                    {Object.entries(BANK_DETAILS).map(([key, value]) => (
                      <div
                        key={key}
                        className="flex justify-between items-center py-2 border-b border-slate-800 last:border-0"
                      >
                        <span className="text-slate-400 capitalize">
                          {key.replace("_", " ")}:
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-white select-all">
                            {value}
                          </span>
                          <button
                            type="button"
                            onClick={() => navigator.clipboard.writeText(value)}
                            className="p-1.5 bg-slate-800 hover:bg-cyan-500/20 text-slate-400 hover:text-cyan-300 rounded-md transition-colors"
                            title="Copiar"
                          >
                            <Copy size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                    {/* 3. TEXTO DE INSTRUCCIÓN DE PAGO (CHECKOUT) ACTUALIZADO */}
                    <div className="mt-2 pt-2 text-fuchsia-300 text-xs flex items-start gap-2">
                      <Info size={16} className="shrink-0 mt-0.5" />
                      <div>
                        <strong>Importante:</strong> Al presionar "Confirmar y
                        Enviar Pedido", se abrirá WhatsApp para que envíes tu
                        orden.{" "}
                        <strong>Después de enviar el pedido</strong>, realiza la
                        transferencia y envía el comprobante al mismo chat.
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="animate-in fade-in duration-200 space-y-3">
                    <div className="flex items-center gap-2">
                      <CreditCard className="text-cyan-400" size={20} />
                      <h4 className="font-bold text-white">
                        Pago con Mercado Pago
                      </h4>
                    </div>
                    <p className="text-slate-400 text-xs">
                      Al confirmar tu pedido, te contactaremos por WhatsApp para
                      enviarte el link de pago de Mercado Pago.
                    </p>
                    <div className="mt-2 pt-2 text-fuchsia-300 text-xs flex items-start gap-2">
                      <Info size={16} className="shrink-0 mt-0.5" />
                      <div>
                        <strong>Importante:</strong> Al presionar "Confirmar y
                        Enviar Pedido", se abrirá WhatsApp para que envíes tu
                        orden. Responderemos por ese medio con el link de pago.
                      </div>
                    </div>
                  </div>
                )}
                {/* --- FIN: CONTENIDO DE TABS --- */}
              </div>
            ) : formData.paymentMethod === "cash" ? (
              <div className="animate-in slide-in-from-top-2">
                <label className="block text-sm text-slate-400 mb-1">
                  ¿Con cuánto pagas? (Para calcular vuelto)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                    $
                  </span>
                  {/* --- INICIO: CAMBIO 2 (APARIENCIA) --- */}
                  <input
                    type="text" // Cambiado de number
                    inputMode="numeric" // Añadido
                    name="cashAmount"
                    // Formatear el valor para mostrarlo
                    value={formData.cashAmount
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                    onChange={handleInputChange}
                    required={formData.paymentMethod === "cash"}
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl pl-8 pr-4 py-3 text-white focus:border-cyan-500"
                    placeholder="Ej: 20.000" // Actualizado placeholder
                  />
                  {/* --- FIN: CAMBIO 2 (APARIENCIA) --- */}
                </div>
              </div>
            ) : formData.paymentMethod === "pos" ? (
              // --- INICIO: NUEVO BLOQUE PARA PAGO CON MÁQUINA ---
              <div className="animate-in slide-in-from-top-2 bg-slate-900/80 border border-slate-700 rounded-xl p-4 space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <CreditCard className="text-cyan-400" size={20} />
                  <h4 className="font-bold text-white">
                    Pago con Débito / Crédito
                  </h4>
                </div>
                <p className="text-slate-400 text-xs">
                  Has seleccionado pagar con la máquina (POS).
                </p>
                <div className="mt-2 pt-2 text-fuchsia-300 text-xs flex items-start gap-2">
                  <Info size={16} className="shrink-0 mt-0.5" />
                  <div>
                    <strong>Importante:</strong> Al confirmar el pedido, el
                    repartidor llevará la máquina para que puedas pagar al
                    momento de la entrega.
                  </div>
                </div>
              </div>
            ) : // --- FIN: NUEVO BLOQUE PARA PAGO CON MÁQUINA ---
            null}
          </section>
        </form>
        {/* Resumen de Pedido */}
        <div className="bg-slate-900/50 border border-white/5 rounded-3xl p-6 h-fit sticky top-24">
          <h3 className="text-xl font-bold text-white mb-6">
            Resumen del Pedido
          </h3>
          <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
            {cartItems.map((item) => (
              <div
                key={item.uuid}
                className="flex justify-between items-start text-sm"
              >
                <div>
                  <p className="font-bold text-cyan-300">{item.name}</p>
                  <p className="text-slate-500 text-xs">
                    {/* --- INICIO: LÓGICA DE TIPO ACTUALIZADA --- */}
                    {item.type === "PROMO"
                      ? "Pack"
                      : item.type === "CUSTOM"
                      ? "Custom Roll"
                      : item.type === "VEGGIE"
                      ? "Roll Vegetariano" // <-- NUEVA LÍNEA
                      : item.description}
                    {/* --- FIN: LÓGICA DE TIPO ACTUALIZADA --- */}
                  </p>
                </div>
                <p className="font-medium text-slate-300">
                  {formatPrice(item.totalPrice)}
                </p>
              </div>
            ))}
          </div>

          {/* --- INICIO: SECCIÓN DE TOTALES ACTUALIZADA --- */}
          <div className="border-t border-white/10 pt-4 space-y-2 mb-6">
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-400">Subtotal</span>
              <span className="font-medium text-slate-300">
                {formatPrice(total)}
              </span>
            </div>

            {/* Mostrar despacho solo si es delivery y se ha ingresado comuna */}
            {deliveryFee > 0 && (
              <div className="flex justify-between items-center text-sm animate-in fade-in duration-300">
                <span className="text-slate-400">Despacho</span>
                <span className="font-medium text-slate-300">
                  {formatPrice(deliveryFee)}
                </span>
              </div>
            )}

            {/* Separador */}
            <div className="!mt-4 pt-4 border-t border-white/5"></div>

            <div className="flex justify-between items-center">
              <span className="text-lg text-slate-400">Total a Pagar</span>
              <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500">
                {formatPrice(finalTotal)}
              </span>
            </div>
          </div>
          {/* --- FIN: SECCIÓN DE TOTALES ACTUALIZADA --- */}

          {/* Botón de envío que ahora llama a handleSubmit CON la validación de horario */}
          <GlowingButton
            variant="secondary"
            fullWidth
            onClick={handleSubmit}
            disabled={!isFormValid}
          >
            Confirmar y Enviar Pedido
          </GlowingButton>
        </div>
      </div>
      {/* Renderizado condicional del modal de error */}
      {showClosedError && (
        <StoreClosedModal
          onClose={() => setShowClosedError(false)}
          hours={STORE_HOURS_STRING}
        />
      )}
    </div>
  );
}
// --- FIN CHECKOUT ACTUALIZADO ---

function ThankYouView({ onReset }) {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4 animate-in zoom-in-95 duration-500">
      <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(34,197,94,0.3)]">
        <CheckCircle size={48} className="text-green-400" />
      </div>
      <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
        ¡Gracias por tu Compra!
      </h2>
      <p className="text-xl text-slate-300 max-w-md mb-8">
        Tu pedido se encuentra en proceso de preparación en nuestro laboratorio.
      </p>
      {/* 3. TEXTO DE INSTRUCCIÓN DE PAGO (GRACIAS) ACTUALIZADO */}
      <div className="bg-fuchsia-900/30 border border-fuchsia-500/30 p-4 rounded-xl max-w-md text-fuchsia-200 text-sm mb-8 flex items-start gap-3">
        <Info className="shrink-0 mt-0.5" />
        <p className="text-left">
          Tu pedido ha sido enviado a nuestro WhatsApp. Si elegiste pagar con{" "}
          <strong>Transferencia</strong>, por favor, realiza el pago a los datos
          indicados y{" "}
          <strong>envía el comprobante al mismo chat de WhatsApp</strong> para
          confirmar tu orden.
        </p>
      </div>
      <GlowingButton onClick={onReset}>Volver al Inicio</GlowingButton>
    </div>
  );
}

function AboutSection() {
  return (
    <section
      className="relative py-20 border-t border-white/5 bg-slate-950"
      id="nosotros"
    >
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="flex items-center gap-4 mb-12 justify-center">
          <div className="h-px bg-gradient-to-l from-fuchsia-500/50 to-transparent w-24"></div>
          <h3 className="text-3xl sm:text-4xl font-black text-white flex items-center gap-2">
            <Navigation className="text-fuchsia-500" /> NOSOTROS
          </h3>
          <div className="h-px bg-gradient-to-r from-fuchsia-500/50 to-transparent w-24"></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div className="space-y-8">
            <div className="prose prose-invert">
              <p className="text-lg text-slate-300 leading-relaxed">
                Nacidos en el año 2077 (metafóricamente),{" "}
                <strong className="text-cyan-300">NEO SUSHI</strong> fusiona la
                tradición milenaria japonesa con la tecnología de
                personalización más avanzada.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
              <div className="p-6 rounded-2xl bg-slate-900/50 border border-white/10 flex items-start gap-4">
                <div className="p-3 bg-cyan-500/10 rounded-lg text-cyan-400">
                  <MapPin size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-white mb-1">Ubicación Base</h4>
                  <p className="text-slate-400 text-sm">
                    Av. Neo Tokyo 2077, Local 4<br />
                    Santiago, Chile
                  </p>
                </div>
              </div>
              <div className="p-6 rounded-2xl bg-slate-900/50 border border-white/10 flex items-start gap-4">
                <div className="p-3 bg-fuchsia-500/10 rounded-lg text-fuchsia-400">
                  <Clock size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-white mb-1">
                    Horario Operativo
                  </h4>
                  {/* Horario actualizado aquí también */}
                  <p className="text-slate-400 text-sm">{STORE_HOURS_STRING}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="h-[400px] rounded-3xl overflow-hidden border border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.2)] relative bg-slate-900">
            <iframe
              width="100%"
              height="100%"
              frameBorder="0"
              style={{
                filter:
                  "invert(90%) hue-rotate(180deg) contrast(1.2) grayscale(0.2)",
              }}
              src="https://maps.google.com/maps?q=Santiago,Chile&t=&z=13&ie=UTF8&iwloc=&output=embed"
              title="Mapa Ubicación"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-white/5 pt-16 pb-8 mt-auto">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-fuchsia-600 rounded-lg rotate-45 flex items-center justify-center">
                <span className="-rotate-45 font-bold text-white text-xl">
                  N
                </span>
              </div>
              <h2 className="text-2xl font-black text-white tracking-wider">
                <span className="text-cyan-400">NEO</span>SUSHI
              </h2>
            </div>
            <p className="text-slate-400 max-w-sm mb-6">
              Reinventando la experiencia del sushi con tecnología y sabor desde
              el futuro.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="p-2 bg-white/5 rounded-full text-slate-400 hover:text-cyan-400 transition-all"
              >
                <Instagram size={20} />
              </a>
              <a
                href="#"
                className="p-2 bg-white/5 rounded-full text-slate-400 hover:text-blue-400 transition-all"
              >
                <Facebook size={20} />
              </a>
            </div>
          </div>
          <div>
            <h3 className="font-bold text-white mb-4 uppercase tracking-wider">
              Navegación
            </h3>
            <ul className="space-y-2 text-slate-400 text-sm">
              <li>
                <a href="#" className="hover:text-cyan-400">
                  Inicio
                </a>
              </li>
              <li>
                <a href="#menu" className="hover:text-cyan-400">
                  Menú
                </a>
              </li>
              <li>
                <a href="#nosotros" className="hover:text-cyan-400">
                  Nosotros
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/5 pt-8 flex justify-between items-center text-slate-500 text-sm">
          <p>© 2025 Neo Sushi Corp.</p>
          <p className="flex items-center gap-1">
            Diseñado en el futuro <Zap size={12} className="text-fuchsia-500" />
          </p>
        </div>
      </div>
    </footer>
  );
}

function HeroSection({ scrollTo }) {
  return (
    <header className="relative overflow-hidden px-6 text-center min-h-screen flex flex-col justify-center py-24">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] -z-10"></div>
      <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-fuchsia-500/10 rounded-full blur-[100px] -z-10"></div>
      <h1 className="text-5xl sm:text-7xl font-black mb-6 leading-tight text-white animate-in fade-in duration-500">
        EL FUTURO DEL SUSHI.
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500 block">
          DISEÑADO POR TI.
        </span>
      </h1>
      <p className="text-slate-400 max-w-xl mx-auto text-lg mb-12 animate-in fade-in duration-500 delay-100">
        Explora nuestras promos, diseña un roll desde cero o crea tu propia
        versión vegetariana.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 max-w-6xl mx-auto w-full animate-in fade-in duration-500 delay-200">
        {/* Card 1: Estáticas */}
        <button
          onClick={() => scrollTo("menu-estaticas")}
          className="group relative p-5 rounded-2xl bg-slate-900/60 border border-white/10 hover:border-fuchsia-500/50 hover:bg-fuchsia-900/20 transition-all duration-300 flex items-center gap-4 text-left"
        >
          <Eye size={28} className="text-fuchsia-400 shrink-0" />
          <div>
            <h3 className="font-bold text-white text-base">
              Promos Estáticas
            </h3>
            <p className="text-slate-400 text-xs">
              Packs listos para llevar.
            </p>
          </div>
        </button>

        {/* Card 2: Modificables */}
        <button
          onClick={() => scrollTo("menu-modificables")}
          className="group relative p-5 rounded-2xl bg-slate-900/60 border border-white/10 hover:border-cyan-500/50 hover:bg-cyan-900/20 transition-all duration-300 flex items-center gap-4 text-left"
        >
          <Layers size={28} className="text-cyan-400 shrink-0" />
          <div>
            <h3 className="font-bold text-white text-base">
              Promos Modificables
            </h3>
            <p className="text-slate-400 text-xs">
              Cambia los ingredientes.
            </p>
          </div>
        </button>

        {/* Card 3: Neo-Lab */}
        <button
          onClick={() => scrollTo("neolab")}
          className="group relative p-5 rounded-2xl bg-slate-900/60 border border-white/10 hover:border-fuchsia-500/50 hover:bg-fuchsia-900/20 transition-all duration-300 flex items-center gap-4 text-left"
        >
          <Zap size={28} className="text-fuchsia-400 shrink-0" />
          <div>
            <h3 className="font-bold text-white text-base">Neo-Lab</h3>
            <p className="text-slate-400 text-xs">
              Crea tu roll desde cero.
            </p>
          </div>
        </button>

        {/* Card 4: Veggie */}
        <button
          onClick={() => scrollTo("veggielab")}
          className="group relative p-5 rounded-2xl bg-slate-900/60 border border-white/10 hover:border-cyan-500/50 hover:bg-cyan-900/20 transition-all duration-300 flex items-center gap-4 text-left"
        >
          <Eye size={28} className="text-cyan-400 shrink-0" />
          <div>
            <h3 className="font-bold text-white text-base">
              Roll Vegetariano
            </h3>
            <p className="text-slate-400 text-xs">
              Opciones 100% veggie.
            </p>
          </div>
        </button>

        {/* Card 5: Bebidas */}
        <button
          onClick={() => scrollTo("menu-bebidas")}
          className="group relative p-5 rounded-2xl bg-slate-900/60 border border-white/10 hover:border-fuchsia-500/50 hover:bg-fuchsia-900/20 transition-all duration-300 flex items-center gap-4 text-left"
        >
          <ShoppingBag size={28} className="text-fuchsia-400 shrink-0" />
          <div>
            <h3 className="font-bold text-white text-base">
              Bebidas y Extras
            </h3>
            <p className="text-slate-400 text-xs">
              Acompaña tu pedido.
            </p>
          </div>
        </button>
      </div>

      <div className="mt-12 animate-in fade-in duration-500 delay-300">
        <button
          onClick={() => scrollTo("menu-estaticas")}
          className="text-slate-400 flex items-center gap-2 mx-auto hover:text-white"
        >
          O ver el menú completo <ArrowDown size={16} />
        </button>
      </div>
    </header>
  );
}

function FloatingWhatsappButton() {
  return (
    <a
      href={WHATSAPP_LINK}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-green-500 rounded-full flex items-center justify-center shadow-lg hover:bg-green-600 transition-all animate-in zoom-in duration-300 delay-500"
    >
      <Phone size={28} className="text-white" />
    </a>
  );
}

// --- APP PRINCIPAL ---
function App() {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedPromo, setSelectedPromo] = useState(null);
  const [selectedStaticPromo, setSelectedStaticPromo] = useState(null);
  const [isNeoLabOpen, setIsNeoLabOpen] = useState(false);
  const [isVeggieLabOpen, setIsVeggieLabOpen] = useState(false); // <-- NUEVO ESTADO
  const [view, setView] = useState("MENU");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Nuevo estado
  const [isMenuDropdownOpen, setIsMenuDropdownOpen] = useState(false); // Estado para el dropdown de menú
  const menuRef = React.useRef(null); // Ref para el dropdown

  const cartTotal = useMemo(
    () => cartItems.reduce((acc, item) => acc + item.totalPrice, 0),
    [cartItems]
  );

  // --- CERRAR DROPDOWN AL HACER CLIC FUERA ---
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuDropdownOpen(false);
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);
  // --- FIN CERRAR DROPDOWN ---

  // --- CERRAR DROPDOWN AL HACER SCROLL ---
  useEffect(() => {
    function handleScroll() {
      if (isMenuDropdownOpen) {
        setIsMenuDropdownOpen(false);
      }
    }
    // Escuchar en 'window' es más fiable para el scroll de la página
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isMenuDropdownOpen]); // Solo se activa si el dropdown está abierto
  // --- FIN CERRAR DROPDOWN SCROLL ---

  const handleSimpleAddToCart = (item) => {
    setCartItems([
      ...cartItems,
      { ...item, uuid: Date.now(), totalPrice: item.price },
    ]);
    setIsCartOpen(true);
  };

  const handleModalAddToCart = (itemFromModal) => {
    setCartItems([...cartItems, itemFromModal]);
    setSelectedPromo(null);
    setSelectedStaticPromo(null);
    setIsCartOpen(true);
  };

  // --- FUNCIONES SEPARADAS PARA AÑADIR ROLLS ---
  const handleCustomRollToCart = (customRoll) => {
    setCartItems([...cartItems, customRoll]);
    setIsNeoLabOpen(false); // Cierra modal Neo-Lab
    setIsCartOpen(true);
  };

  const handleVeggieRollToCart = (veggieRoll) => {
    setCartItems([...cartItems, veggieRoll]);
    setIsVeggieLabOpen(false); // Cierra modal Veggie
    setIsCartOpen(true);
  };
  // --- FIN FUNCIONES ---

  const generateWhatsAppMessage = (formData) => {
    // --- CÁLCULO DE DESPACHO ---
    let deliveryFee = 0;
    if (formData.deliveryType === "delivery") {
      const commune = formData.commune.trim().toLowerCase();
      if (commune.length > 0) {
        if (commune === LOCAL_COMMUNE.toLowerCase()) {
          deliveryFee = 2000;
        } else {
          deliveryFee = 3000;
        }
      }
    }
    const finalTotal = cartTotal + deliveryFee;
    const separador = "--------------------------------";

    // --- INFO DE FECHA Y HORA ---
    const now = new Date();
    const fecha = now.toLocaleDateString("es-CL", { day: '2-digit', month: '2-digit', year: 'numeric' });
    const hora = now.toLocaleTimeString("es-CL", { hour: '2-digit', minute: '2-digit', hour12: true });

    // --- INICIO DEL MENSAJE ---
    let msg = `*¡NUEVO PEDIDO WEB! - NEO SUSHI* 🍣\n`;
    msg += `${separador}\n`;
    msg += `*Fecha:* ${fecha}\n`;
    msg += `*Hora:* ${hora}\n`;
    msg += `${separador}\n\n`;

    // --- DATOS DEL CLIENTE ---
    msg += `*DATOS DEL CLIENTE*\n`;
    msg += `*Nombre:* ${formData.fullName}\n`;
    msg += `*Teléfono:* +56${formData.phone}\n`;
    msg += `${separador}\n\n`;

    // --- TIPO DE ENTREGA ---
    msg += `*TIPO DE ENTREGA*\n`;
    if (formData.deliveryType === "delivery") {
      msg += `*Tipo:* 🛵 Delivery a Domicilio\n`;
      msg += `*Dirección:* ${formData.address}\n`;
      msg += `*Comuna:* ${formData.commune}\n`;
      msg += `*Referencia:* ${formData.reference || "Ninguna"}\n`;
    } else {
      msg += `*Tipo:* 🏪 Retiro en Local\n`;
      msg += `*Fecha Retiro:* ${getTodayDateStr()}\n`;
    }
    msg += `${separador}\n\n`;

    // --- DETALLE DEL PEDIDO ---
    msg += `*DETALLE DEL PEDIDO*\n`;
    cartItems.forEach((item, i) => {
      msg += `\n*[${i + 1}] ${item.name.toUpperCase()}* (${formatPrice(
        item.totalPrice
      )})\n`;
      if (item.type === "PROMO" || item.type === "STATIC") {
        const rolls = item.configuredRolls || item.rolls;
        rolls.forEach((r) => {
          const fillings = r.fillings || r.defaultFillings;
          msg += `   ➤ _${r.name} (${
            WRAPPERS[r.wrapperKey].name
          })_\n      Rellenos: ${fillings
            .map((fid) => getFillingById(fid).name)
            .join(", ")}\n`;
        });
      } else if (item.type === "CUSTOM" || item.type === "VEGGIE") { // <-- LÓGICA ACTUALIZADA
        msg += `   ➤ Base: ${
          WRAPPERS[item.wrapperKey].name
        }\n      Rellenos: ${item.fillings
          .map((fid) => getFillingById(fid).name)
          .join(", ")}\n`;
      } else {
        msg += `   ➤ ${item.description}\n`;
      }
    });
    msg += `\n${separador}\n\n`;

    // --- RESUMEN DE PAGO ---
    msg += `*RESUMEN DE PAGO*\n`;
    msg += `*Subtotal:* ${formatPrice(cartTotal)}\n`;
    if (deliveryFee > 0) {
      msg += `*Envío:* ${formatPrice(deliveryFee)}\n`;
    }
    msg += `\n*TOTAL A PAGAR: ${formatPrice(finalTotal)}*\n`;
    msg += `${separador}\n\n`;

    // --- MÉTODO DE PAGO ---
    msg += `*MÉTODO DE PAGO*\n`;
    if (formData.paymentMethod === "transfer") {
      msg += `*Tipo:* 💳 Transferencia Bancaria\n`;
      msg += `_(Por favor, enviar comprobante a este chat)_\n`;
    } else {
      const pagaCon = parseInt(formData.cashAmount, 10);
      msg += `*Tipo:* 💵 Efectivo\n`;
      msg += `*Paga con:* ${formatPrice(pagaCon)}\n`;
      // --- LÍNEA DE VUELTO ELIMINADA ---
    }
    msg += `${separador}\n\n`;
    msg += `¡Gracias por preferir NEO SUSHI!`;

    return encodeURIComponent(msg);
  };

  const handleCompleteOrder = (formData) => {
    window.open(
      `https://wa.me/${LOCAL_PHONE_NUMBER}?text=${generateWhatsAppMessage(
        formData
      )}`,
      "_blank"
    );
    setView("THANKYOU");
    setCartItems([]);
  };

  const scrollTo = (id) => {
    const element = document.getElementById(id);
    if (!element) return;

    const navElement = document.querySelector("nav"); // 1. Encontramos la barra de navegación
    const navHeight = navElement ? navElement.offsetHeight : 0; // 2. Obtenemos su altura
    const buffer = 24; // 3. Un pequeño espacio extra (como en tu 'imagen 2')

    // 4. Calculamos la posición final
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition =
      elementPosition + window.pageYOffset - navHeight - buffer;

    // 5. Hacemos scroll a esa posición calculada
    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });

    setIsMobileMenuOpen(false);
    setIsMenuDropdownOpen(false); // <- Cierra el dropdown de menú
  };

  return (
    <div className="min-h-screen bg-[#050510] text-slate-200 font-inter flex flex-col">
      <nav className="sticky top-0 z-40 bg-[#050510]/80 backdrop-blur-xl border-b border-white/5 px-4 sm:px-6 py-4">
        <div className="container mx-auto flex justify-between items-center">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setView("MENU")}
          >
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-fuchsia-600 rounded-lg rotate-45 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.5)]">
              <span className="-rotate-45 font-bold text-white text-xl">N</span>
            </div>
            {/* --- CAMBIO 2: LOGO EN MÓVIL --- */}
            <h1 className="text-xl font-black tracking-wider text-white">
              <span>NEO</span>
              <span className="text-cyan-400">SUSHI</span>
            </h1>
            {/* --- FIN CAMBIO 2 --- */}
          </div>

          <div className="hidden md:flex items-center gap-6 text-sm font-medium">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setView("MENU");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="text-slate-300 hover:text-white transition-colors"
            >
              Inicio
            </a>

            {/* --- INICIO: DROPDOWN DE MENÚ (RESTAURADO) --- */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setIsMenuDropdownOpen(!isMenuDropdownOpen)}
                className="text-slate-300 hover:text-white transition-colors flex items-center gap-1"
              >
                Menú
                <ArrowDown
                  size={16}
                  className={`transition-transform duration-200 ${
                    isMenuDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              {isMenuDropdownOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-64 bg-[#0c0c1d] border border-white/10 rounded-xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-200">
                  <a
                    href="#menu-estaticas" // Actualizado para el nuevo orden
                    onClick={(e) => {
                      e.preventDefault();
                      setView("MENU");
                      scrollTo("menu-estaticas"); // Actualizado para el nuevo orden
                    }}
                    className="block px-4 py-2 rounded-lg text-sm text-slate-300 hover:bg-cyan-500/20 hover:text-cyan-300"
                  >
                    Promos Estáticas
                  </a>
                  <a
                    href="#menu-modificables" // Actualizado para el nuevo orden
                    onClick={(e) => {
                      e.preventDefault();
                      setView("MENU");
                      scrollTo("menu-modificables"); // Actualizado para el nuevo orden
                    }}
                    className="block px-4 py-2 rounded-lg text-sm text-slate-300 hover:bg-cyan-500/20 hover:text-cyan-300"
                  >
                    Promos Modificables
                  </a>
                  <a
                    href="#neolab"
                    onClick={(e) => {
                      e.preventDefault();
                      setView("MENU");
                      scrollTo("neolab");
                    }}
                    className="block px-4 py-2 rounded-lg text-sm text-slate-300 hover:bg-cyan-500/20 hover:text-cyan-300"
                  >
                    Crea tu Roll (Neo-Lab)
                  </a>
                  {/* --- INICIO: NUEVO ENLACE VEGGIE --- */}
                  <a
                    href="#veggielab"
                    onClick={(e) => {
                      e.preventDefault();
                      setView("MENU");
                      scrollTo("veggielab");
                    }}
                    className="block px-4 py-2 rounded-lg text-sm text-slate-300 hover:bg-cyan-500/20 hover:text-cyan-300"
                  >
                    Roll Vegetariano
                  </a>
                  {/* --- FIN: NUEVO ENLACE VEGGIE --- */}
                  <a
                    href="#menu-bebidas"
                    onClick={(e) => {
                      e.preventDefault();
                      setView("MENU");
                      scrollTo("menu-bebidas");
                    }}
                    className="block px-4 py-2 rounded-lg text-sm text-slate-300 hover:bg-cyan-500/20 hover:text-cyan-300"
                  >
                    Bebidas y Otros
                  </a>
                </div>
              )}
            </div>
            {/* --- FIN: DROPDOWN DE MENÚ --- */}

            <a
              href="#nosotros"
              onClick={(e) => {
                e.preventDefault();
                setView("MENU");
                scrollTo("nosotros");
              }}
              className="text-slate-300 hover:text-white transition-colors"
            >
              Nosotros
            </a>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="#"
              className="p-2 text-slate-400 hover:text-white transition-colors hidden sm:block"
            >
              <Instagram size={20} />
            </a>
            <a
              href="#"
              className="p-2 text-slate-400 hover:text-white transition-colors hidden sm:block"
            >
              <Facebook size={20} />
            </a>

            {view === "MENU" && (
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all flex items-center gap-3"
              >
                <ShoppingCart className="text-white" size={22} />
                {cartItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-fuchsia-600 text-white text-[10px] font-bold h-5 min-w-[20px] px-1 flex items-center justify-center rounded-full">
                    {cartItems.length}
                  </span>
                )}
                <span className="text-sm font-bold text-cyan-300">
                  {formatPrice(cartTotal)}
                </span>
              </button>
            )}

            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 bg-white/5 rounded-xl text-slate-400 hover:text-white md:hidden"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </nav>

      {/* --- INICIO: Modal Menú Móvil (CORREGIDO) --- */}
      {/* Se movió fuera del <nav> y se quitó backdrop-blur-xl para asegurar opacidad */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[100] bg-slate-950 md:hidden animate-in fade-in duration-300">
          <div className="flex justify-end p-4">
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 bg-white/10 rounded-full text-white hover:bg-white/20"
            >
              <X size={24} />
            </button>
          </div>
          <div className="flex flex-col items-center justify-center h-[80vh] gap-8">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setView("MENU");
                window.scrollTo({ top: 0, behavior: "smooth" });
                setIsMobileMenuOpen(false);
              }}
              className="text-2xl font-bold text-white hover:text-cyan-400"
            >
              Inicio
            </a>

            {/* --- INICIO: ENLACES DE MENÚ MÓVIL (CORREGIDO) --- */}
            {/* Reemplazamos el 'Menú' simple por las 4 categorías */}
            <div className="flex flex-col items-center gap-8">
              <a
                href="#menu-estaticas" // Actualizado para el nuevo orden
                onClick={(e) => {
                  e.preventDefault();
                  setView("MENU");
                  scrollTo("menu-estaticas"); // Actualizado para el nuevo orden
                }}
                className="text-2xl font-bold text-white hover:text-cyan-400"
              >
                Promos Estáticas
              </a>
              <a
                href="#menu-modificables" // Actualizado para el nuevo orden
                onClick={(e) => {
                  e.preventDefault();
                  setView("MENU");
                  scrollTo("menu-modificables"); // Actualizado para el nuevo orden
                }}
                className="text-2xl font-bold text-white hover:text-cyan-400"
              >
                Promos Modificables
              </a>
              <a
                href="#neolab"
                onClick={(e) => {
                  e.preventDefault();
                  setView("MENU");
                  scrollTo("neolab");
                }}
                className="text-2xl font-bold text-white hover:text-cyan-400"
              >
                Crea tu Roll
              </a>
              {/* --- INICIO: NUEVO ENLACE VEGGIE --- */}
              <a
                href="#veggielab"
                onClick={(e) => {
                  e.preventDefault();
                  setView("MENU");
                  scrollTo("veggielab");
                }}
                className="text-2xl font-bold text-white hover:text-cyan-400"
              >
                Roll Vegetariano
              </a>
              {/* --- FIN: NUEVO ENLACE VEGGIE --- */}
              <a
                href="#menu-bebidas"
                onClick={(e) => {
                  e.preventDefault();
                  setView("MENU");
                  scrollTo("menu-bebidas");
                }}
                className="text-2xl font-bold text-white hover:text-cyan-400"
              >
                Bebidas y Otros
              </a>
            </div>
            {/* --- FIN: ENLACES DE MENÚ MÓVIL --- */}

            <a
              href="#nosotros"
              onClick={(e) => {
                e.preventDefault();
                setView("MENU");
                scrollTo("nosotros");
              }}
              className="text-2xl font-bold text-white hover:text-cyan-400"
            >
              Nosotros
            </a>
            <div className="flex gap-6 mt-8">
              <a
                href="#"
                className="p-4 bg-white/5 rounded-full text-slate-400 hover:text-cyan-400"
              >
                <Instagram size={32} />
              </a>
              <a
                href="#"
                className="p-4 bg-white/5 rounded-full text-slate-400 hover:text-blue-400"
              >
                <Facebook size={32} />
              </a>
            </div>
          </div>
        </div>
      )}
      {/* --- FIN: Modal Menú Móvil --- */}

      <div className="grow">
        {view === "MENU" && (
          <main className="animate-in fade-in">
            <HeroSection scrollTo={scrollTo} />

            {/* --- CAMBIO 1: ORDEN DE SECCIONES --- */}
            <section id="menu" className="container mx-auto px-4 sm:px-6 py-20">
              <h2
                id="menu-estaticas"
                className="text-3xl font-black text-white mb-4 border-l-4 border-fuchsia-500 pl-4"
              >
                Promociones Estáticas
              </h2>
              <p className="text-slate-400 text-sm mb-8 max-w-2xl pl-5">
                Promociones con rolls fijos a un precio especial. No se pueden
                modificar.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                {STATIC_PROMOS.map((promo) => (
                  <div
                    key={promo.id}
                    className="bg-slate-900/40 border border-white/5 rounded-3xl overflow-hidden hover:border-fuchsia-500/50 transition-all flex flex-col group"
                  >
                    <div className="h-48 overflow-hidden relative group-hover:scale-105 transition-transform duration-500">
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a1a] to-transparent z-10" />
                      <img
                        src={promo.image}
                        alt={promo.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src =
                            "https://placehold.co/800x400/1e293b/94a3b8?text=Sin+Imagen";
                        }}
                      />
                      <div className="absolute bottom-0 left-0 p-4 z-20">
                        <span className="px-3 py-1 rounded-full bg-fuchsia-500/20 border border-fuchsia-500/30 text-fuchsia-300 text-xs font-bold backdrop-blur-md">
                          {promo.rolls.reduce((acc, r) => acc + r.pieces, 0)}{" "}
                          Piezas
                        </span>
                      </div>
                    </div>
                    <div className="p-5 flex flex-col grow">
                      <h4 className="text-xl font-bold text-white mb-2">
                        {promo.name}
                      </h4>
                      <p className="text-slate-400 text-sm mb-4 grow">
                        {promo.description}
                      </p>
                      <div className="flex justify-between items-end">
                        <div>
                          <p className="text-xs text-slate-500 uppercase">
                            Precio
                          </p>
                          <p className="text-2xl font-bold text-white">
                            {formatPrice(promo.basePrice)}
                          </p>
                        </div>
                        <GlowingButton
                          variant="ghost"
                          onClick={() => setSelectedStaticPromo(promo)}
                        >
                          Ver Detalle <Eye size={18} />
                        </GlowingButton>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <h2
                id="menu-modificables"
                className="text-3xl font-black text-white mb-4 border-l-4 border-cyan-500 pl-4"
              >
                Promociones Modificables
              </h2>
              <p className="text-slate-400 text-sm mb-8 max-w-2xl pl-5">
                Aquí puedes cambiar los ingredientes de cada roll. (Cualquier
                cambio tiene un costo extra).
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-16">
                {MODIFIABLE_PROMOS.map((promo) => (
                  <div
                    key={promo.id}
                    className="bg-slate-900/40 border border-white/5 rounded-3xl overflow-hidden hover:border-cyan-500/50 transition-all flex flex-col group"
                  >
                    <div className="h-48 overflow-hidden relative group-hover:scale-105 transition-transform duration-500">
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a1a] to-transparent z-10" />
                      <img
                        src={promo.image}
                        alt={promo.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src =
                            "https://placehold.co/800x400/1e293b/94a3b8?text=Sin+Imagen";
                        }}
                      />
                      <div className="absolute bottom-0 left-0 p-4 z-20">
                        <span className="px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-bold backdrop-blur-md">
                          {promo.rolls.reduce((acc, r) => acc + r.pieces, 0)}{" "}
                          Piezas
                        </span>
                      </div>
                    </div>
                    <div className="p-5 flex flex-col grow">
                      <h4 className="text-xl font-bold text-white mb-2">
                        {promo.name}
                      </h4>
                      <p className="text-slate-400 text-sm mb-4 grow">
                        {promo.description}
                      </p>
                      <div className="flex justify-between items-end">
                        <div>
                          <p className="text-xs text-slate-500 uppercase">
                            Base
                          </p>
                          <p className="text-2xl font-bold text-white">
                            {formatPrice(promo.basePrice)}
                          </p>
                        </div>
                        <GlowingButton
                          variant="ghost"
                          onClick={() => setSelectedPromo(promo)}
                        >
                          Configurar <ChevronRight size={18} />
                        </GlowingButton>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {/* --- FIN CAMBIO 1 --- */}

              <h2
                id="neolab"
                className="text-3xl font-black text-white mb-4 border-l-4 border-fuchsia-500 pl-4"
              >
                Crea tu Roll (Neo-Lab)
              </h2>
              <p className="text-slate-400 text-sm mb-8 max-w-2xl pl-5">
                ¿No encuentras tu roll perfecto? Diséñalo aquí con cualquier
                ingrediente.
              </p>
              <div
                className="bg-gradient-to-r from-fuchsia-900/20 to-slate-900/50 rounded-[3rem] border border-fuchsia-500/20 p-8 sm:p-12 flex flex-col sm:flex-row items-center justify-between gap-8 mb-16"
              >
                <div className="relative z-10">
                  <h3 className="text-3xl font-black text-white mb-4 flex items-center gap-3">
                    <Zap className="text-fuchsia-500" /> Laboratorio
                  </h3>
                  <p className="text-slate-300 max-w-md">
                    Diseña un roll único de 10 piezas desde cero. Elige
                    envoltura y 3 rellenos (Básico, Medio y Especial).
                  </p>
                </div>
                <GlowingButton
                  variant="secondary"
                  className="min-w-[200px]"
                  onClick={() => setIsNeoLabOpen(true)}
                >
                  Entrar al Lab
                </GlowingButton>
              </div>

              {/* --- INICIO: NUEVA SECCIÓN VEGETARIANA --- */}
              <h2
                id="veggielab"
                className="text-3xl font-black text-white mb-4 border-l-4 border-cyan-500 pl-4"
              >
                Roll Vegetariano
              </h2>
              <p className="text-slate-400 text-sm mb-8 max-w-2xl pl-5">
                Crea tu roll perfecto usando solo ingredientes de nuestra
                selección vegetariana.
              </p>
              <div
                className="bg-gradient-to-r from-cyan-900/20 to-slate-900/50 rounded-[3rem] border border-cyan-500/20 p-8 sm:p-12 flex flex-col sm:flex-row items-center justify-between gap-8 mb-16"
              >
                <div className="relative z-10">
                  <h3 className="text-3xl font-black text-white mb-4 flex items-center gap-3">
                    <Eye className="text-cyan-500" /> Sección Vegetariana
                  </h3>
                  <p className="text-slate-300 max-w-md">
                    Diseña un roll veggie de 10 piezas. Elige tu envoltura y 3
                    ingredientes de la lista vegetariana.
                  </p>
                </div>
                <GlowingButton
                  variant="primary" // Botón Cyan
                  className="min-w-[200px]"
                  onClick={() => setIsVeggieLabOpen(true)}
                >
                  Crear Roll Veggie
                </GlowingButton>
              </div>
              {/* --- FIN: NUEVA SECCIÓN VEGETARIANA --- */}

              <h2
                id="menu-bebidas"
                className="text-3xl font-black text-white mb-4 border-l-4 border-fuchsia-500 pl-4"
              >
                Bebidas y Otros
              </h2>
              <p className="text-slate-400 text-sm mb-8 max-w-2xl pl-5">
                ¡No te olvides de la bebida o un extra!
              </p>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
                {EXTRAS.map((extra) => (
                  <div
                    key={extra.id}
                    className="bg-slate-900/40 border border-white/5 rounded-3xl overflow-hidden flex flex-col group hover:border-white/20 transition-all"
                  >
                    <div className="h-32 overflow-hidden relative">
                      <img
                        src={extra.image}
                        alt={extra.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src =
                            "https://placehold.co/800x400/1e293b/94a3b8?text=Sin+Imagen";
                        }}
                      />
                    </div>
                    <div className="p-5 flex flex-col justify-between grow">
                      <div>
                        <h4 className="text-lg font-bold text-white mb-1">
                          {extra.name}
                        </h4>
                        <p className="text-slate-400 text-xs mb-4">
                          {extra.description}
                        </p>
                      </div>
                      <div className="flex justify-between items-end">
                        <p className="text-xl font-bold text-white">
                          {formatPrice(extra.price)}
                        </p>
                        <GlowingButton
                          variant="ghost"
                          onClick={() => handleSimpleAddToCart(extra)}
                        >
                          Agregar
                        </GlowingButton>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <AboutSection />
          </main>
        )}

        {view === "CHECKOUT" && (
          <CheckoutView
            cartItems={cartItems}
            total={cartTotal}
            onBack={() => setView("MENU")}
            onCompleteOrder={handleCompleteOrder}
          />
        )}
        {view === "THANKYOU" && (
          <ThankYouView onReset={() => setView("MENU")} />
        )}
      </div>

      <Footer />
      <FloatingWhatsappButton />

      {/* Renderizado de Modales */}
      {view === "MENU" && (
        <>
          {selectedPromo && (
            <PromoBuilderModal
              promo={selectedPromo}
              onClose={() => setSelectedPromo(null)}
              onAddToCart={handleModalAddToCart}
              isReadOnly={false}
            />
          )}

          {selectedStaticPromo && (
            <PromoBuilderModal
              promo={selectedStaticPromo}
              onClose={() => setSelectedStaticPromo(null)}
              onAddToCart={handleModalAddToCart}
              isReadOnly={true}
            />
          )}

          {isNeoLabOpen && (
            <CustomRollBuilder
              onClose={() => setIsNeoLabOpen(false)}
              onAddToCart={handleCustomRollToCart} // Usa la función específica
            />
          )}

          {/* --- INICIO: RENDERIZADO MODAL VEGGIE --- */}
          {isVeggieLabOpen && (
            <VeggieRollBuilder
              onClose={() => setIsVeggieLabOpen(false)}
              onAddToCart={handleVeggieRollToCart} // Usa la función específica
            />
          )}
          {/* --- FIN: RENDERIZADO MODAL VEGGIE --- */}

          <CartDrawer
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
            items={cartItems}
            onRemove={(uuid) =>
              setCartItems((items) => items.filter((i) => i.uuid !== uuid))
            }
            total={cartTotal}
            onCheckout={() => {
              setIsCartOpen(false);
              setView("CHECKOUT");
            }}
            onClearCart={() => setCartItems([])}
          />
        </>
      )}
    </div>
  );
}
export default App;