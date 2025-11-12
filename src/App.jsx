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
} from "lucide-react";

// --- DATOS DE NEGOCIO ---
const LOCAL_PHONE_NUMBER = "56912345678";
const WHATSAPP_LINK = `https://wa.me/${LOCAL_PHONE_NUMBER}`;

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

const WRAPPERS = {
  sesamo: { name: "Envuelto en Sésamo", price: 0 },
  ciboulette: { name: "Envuelto en Ciboulette", price: 0 },
  frito: { name: "Frito en Panko", price: 500 },
  palta: { name: "Envuelto en Palta", price: 1000 },
  queso: { name: "Envuelto en Queso Crema", price: 1000 },
  salmon: { name: "Envuelto en Salmón", price: 2000 },
};

// --- DATOS DE MENÚ ---
const MODIFIABLE_PROMOS = [
  {
    id: "promo1",
    name: "Neo Start (12p)",
    basePrice: 6490,
    description: "1 Roll clásico. Configuración base incluida.",
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
  },
  {
    id: "e2",
    name: "Porción Gyoza (5u)",
    description: "Empanaditas japonesas de cerdo.",
    price: 3500,
    type: "EXTRA",
  },
  {
    id: "e3",
    name: "Salsa Soya Extra",
    description: "Botellita 50cc.",
    price: 500,
    type: "EXTRA",
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
                Configura tus 3 Rellenos:
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

// --- COMPONENTE CORREGIDO ---
function CartDrawer({ isOpen, onClose, items, onRemove, total, onCheckout }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
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
        <div className="flex-grow overflow-y-auto p-4 space-y-4 custom-scrollbar bg-slate-950/50">
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
                      {item.type === "PROMO"
                        ? "Pack Promocional"
                        : item.type === "CUSTOM"
                        ? "Roll Personalizado"
                        : item.type === "STATIC"
                        ? "Promo Estática"
                        : "Extra"}
                    </p>
                  </div>
                  {/* --- LÍNEA CORREGIDA --- */}
                  {/* Se añadió pr-10 para dar espacio al botón de eliminar */}
                  <span className="font-bold text-white pr-10">
                    {formatPrice(item.totalPrice)}
                  </span>
                </div>
                {item.type === "PROMO" ||
                item.type === "CUSTOM" ||
                item.type === "STATIC" ? (
                  <div className="p-4 space-y-3 text-sm border-t border-white/5">
                    {(item.configuredRolls || item.rolls).map((roll, idx) => (
                      <div
                        key={idx}
                        className="pl-3 border-l-2 border-slate-700"
                      >
                        <div className="text-slate-200 font-medium">
                          {roll.name}{" "}
                          <span className="text-slate-500 text-xs">
                            ({WRAPPERS[roll.wrapperKey].name})
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
                ) : (
                  <p className="p-4 text-sm text-slate-400 border-t border-white/5">
                    {item.description}
                  </p>
                )}
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
          {/* LÓGICA DE BOTÓN DESHABILITADO */}
          <GlowingButton
            variant="primary"
            fullWidth
            disabled={items.length === 0}
            onClick={onCheckout}
          >
            Ir a Pagar
          </GlowingButton>
        </div>
      </div>
    </>
  );
}
// --- FIN COMPONENTE CORREGIDO ---

// --- CHECKOUT ACTUALIZADO CON LÓGICA DE HORARIO ---
function CheckoutView({ cartItems, total, onBack, onCompleteOrder }) {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    deliveryType: "delivery",
    address: "",
    commune: "",
    reference: "",
    paymentMethod: "transfer",
    cashAmount: "",
  });
  // Nuevo estado para el modal de error
  const [showClosedError, setShowClosedError] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone" && !/^\d*$/.test(value)) return;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
      <h2 className="text-3xl font-black text-white mb-8 flex items-center gap-3 border-b border-white/10 pb-4">
        <CreditCard className="text-fuchsia-500" /> Finalizar Compra
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
            <div className="grid grid-cols-2 gap-3">
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
                <Banknote /> Transferencia
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
            </div>
            {formData.paymentMethod === "transfer" ? (
              <div className="bg-slate-900/80 border border-slate-700 rounded-xl p-4 space-y-3 text-sm animate-in slide-in-from-top-2">
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
                <div className="mt-2 pt-2 text-fuchsia-300 text-xs flex items-start gap-2">
                  <Info size={16} className="shrink-0" /> Recuerda enviar el
                  comprobante por WhatsApp al finalizar.
                </div>
              </div>
            ) : (
              <div className="animate-in slide-in-from-top-2">
                <label className="block text-sm text-slate-400 mb-1">
                  ¿Con cuánto pagas? (Para calcular vuelto)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                    $
                  </span>
                  <input
                    type="number"
                    name="cashAmount"
                    value={formData.cashAmount}
                    onChange={handleInputChange}
                    required={formData.paymentMethod === "cash"}
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl pl-8 pr-4 py-3 text-white focus:border-cyan-500"
                    placeholder="Ej: 20000"
                  />
                </div>
              </div>
            )}
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
                    {item.type === "PROMO"
                      ? "Pack"
                      : item.type === "CUSTOM"
                      ? "Custom Roll"
                      : item.description}
                  </p>
                </div>
                <p className="font-medium text-slate-300">
                  {formatPrice(item.totalPrice)}
                </p>
              </div>
            ))}
          </div>
          <div className="border-t border-white/10 pt-4 flex justify-between items-center mb-6">
            <span className="text-lg text-slate-400">Total a Pagar</span>
            <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500">
              {formatPrice(total)}
            </span>
          </div>
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
      <div className="bg-fuchsia-900/30 border border-fuchsia-500/30 p-4 rounded-xl max-w-md text-fuchsia-200 text-sm mb-8 flex items-start gap-3">
        <Info className="shrink-0 mt-0.5" />
        <p>
          Si elegiste pagar con <strong>Transferencia</strong>, recuerda enviar
          el comprobante al WhatsApp que se abrirá a continuación para validar
          tu pedido.
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

function HeroSection() {
  return (
    <header className="relative overflow-hidden px-6 py-32 sm:py-48 text-center">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] -z-10"></div>
      <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-fuchsia-500/10 rounded-full blur-[100px] -z-10"></div>
      <h1 className="text-5xl sm:text-7xl font-black mb-6 leading-tight text-white animate-in fade-in duration-500">
        EL FUTURO DEL SUSHI.
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500 block">
          DISEÑADO POR TI.
        </span>
      </h1>
      <p className="text-slate-400 max-w-xl mx-auto text-lg mb-10 animate-in fade-in duration-500 delay-100">
        Explora nuestras promos modificables, packs estáticos o diseña un roll
        desde cero en el Neo-Lab.
      </p>
      <GlowingButton
        variant="primary"
        className="px-10 py-4 text-lg animate-in fade-in duration-500 delay-200"
        onClick={() =>
          document
            .getElementById("menu")
            ?.scrollIntoView({ behavior: "smooth" })
        }
      >
        Ver Menú <ArrowDown size={20} />
      </GlowingButton>
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
  const [view, setView] = useState("MENU");

  const cartTotal = useMemo(
    () => cartItems.reduce((acc, item) => acc + item.totalPrice, 0),
    [cartItems]
  );

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

  const handleCustomRollToCart = (customRoll) => {
    setCartItems([...cartItems, customRoll]);
    setIsNeoLabOpen(false);
    setIsCartOpen(true);
  };

  const generateWhatsAppMessage = (formData) => {
    let msg = `*NUEVO PEDIDO WEB - NEO SUSHI*\n--------------------------------\n*Cliente:* ${
      formData.fullName
    }\n*Teléfono:* ${formData.phone}\n*Entrega:* ${
      formData.deliveryType === "delivery"
        ? "🛵 DELIVERY"
        : "🏪 RETIRO EN LOCAL"
    }\n`;
    if (formData.deliveryType === "delivery")
      msg += `*Dir:* ${formData.address}, ${formData.commune}\n*Ref:* ${
        formData.reference || "-"
      }\n`;
    else msg += `*Fecha Retiro:* ${getTodayDateStr()}\n`;
    msg += `--------------------------------\n*DETALLE:*\n`;
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
      } else if (item.type === "CUSTOM") {
        msg += `   ➤ Base: ${
          WRAPPERS[item.wrapperKey].name
        }\n      Rellenos: ${item.fillings
          .map((fid) => getFillingById(fid).name)
          .join(", ")}\n`;
      } else {
        msg += `   ➤ ${item.description}\n`;
      }
    });
    msg += `\n--------------------------------\n*TOTAL: ${formatPrice(
      cartTotal
    )}*\n*Pago:* ${
      formData.paymentMethod === "transfer"
        ? "💳 TRANSFERENCIA"
        : `💵 EFECTIVO (Paga con: $${formData.cashAmount})`
    }`;
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
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
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
            <h1 className="text-xl font-black tracking-wider text-white">
              <span className="hidden sm:inline">NEO</span>
              <span className="text-cyan-400">SUSHI</span>
            </h1>
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
            <a
              href="#menu"
              onClick={(e) => {
                e.preventDefault();
                setView("MENU");
                scrollTo("menu");
              }}
              className="text-slate-300 hover:text-white transition-colors"
            >
              Menú
            </a>
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
                {cartTotal > 0 && (
                  <span className="text-sm font-bold text-cyan-300 hidden sm:block">
                    {formatPrice(cartTotal)}
                  </span>
                )}
              </button>
            )}
          </div>
        </div>
      </nav>

      <div className="grow">
        {view === "MENU" && (
          <main className="animate-in fade-in">
            <HeroSection />

            <section id="menu" className="container mx-auto px-4 sm:px-6 py-20">
              <h2 className="text-3xl font-black text-white mb-4 border-l-4 border-cyan-500 pl-4">
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
                    <div className="h-40 bg-[#0a0a1a] relative flex items-center justify-center">
                      <span className="text-7xl font-black text-white/10">
                        {promo.rolls.reduce((acc, r) => acc + r.pieces, 0)}p
                      </span>
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

              <h2 className="text-3xl font-black text-white mb-4 border-l-4 border-fuchsia-500 pl-4">
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
                    <div className="h-40 bg-[#0a0a1a] relative flex items-center justify-center">
                      <span className="text-7xl font-black text-white/10">
                        {promo.rolls.reduce((acc, r) => acc + r.pieces, 0)}p
                      </span>
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

              <h2 className="text-3xl font-black text-white mb-4 border-l-4 border-cyan-500 pl-4">
                Crea tu Roll (Neo-Lab)
              </h2>
              <p className="text-slate-400 text-sm mb-8 max-w-2xl pl-5">
                ¿No encuentras tu roll perfecto? Diséñalo aquí.
              </p>
              <div
                id="neolab"
                className="bg-gradient-to-r from-fuchsia-900/20 to-slate-900/50 rounded-[3rem] border border-fuchsia-500/20 p-8 sm:p-12 flex flex-col sm:flex-row items-center justify-between gap-8 mb-16"
              >
                <div className="relative z-10">
                  <h3 className="text-3xl font-black text-white mb-4 flex items-center gap-3">
                    <Zap className="text-fuchsia-500" /> Laboratorio
                  </h3>
                  <p className="text-slate-300 max-w-md">
                    Diseña un roll único de 10 piezas desde cero. Elige
                    envoltura y 3 rellenos.
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

              <h2 className="text-3xl font-black text-white mb-4 border-l-4 border-fuchsia-500 pl-4">
                Bebidas y Otros
              </h2>
              <p className="text-slate-400 text-sm mb-8 max-w-2xl pl-5">
                ¡No te olvides de la bebida o un extra!
              </p>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
                {EXTRAS.map((extra) => (
                  <div
                    key={extra.id}
                    className="bg-slate-900/40 border border-white/5 rounded-3xl p-5 flex flex-col justify-between group hover:border-white/20"
                  >
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
              onAddToCart={handleCustomRollToCart}
            />
          )}

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
          />
        </>
      )}
    </div>
  );
}
export default App;