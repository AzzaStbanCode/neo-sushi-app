import React, { useState, useMemo, useEffect, useRef } from "react";
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
  Leaf, // <-- Nuevo ícono de hoja para la sección vegetariana
  Utensils, // <-- Nuevo ícono para palitos
} from "lucide-react";

// --- IMPORTACIÓN DE DATOS DE NEGOCIO ---
import {
  LOCAL_PHONE_NUMBER,
  WHATSAPP_LINK,
  LOCAL_COMMUNE,
  CREATOR_COMPANY,
  CREATOR_SOCIALS,
  STORE_HOURS_STRING,
  FILLING_TIERS,
  FILLINGS,
  VEGETARIAN_FILLINGS_DATA,
  WRAPPERS,
  VEGETARIAN_WRAPPERS,
  MODIFIABLE_PROMOS,
  STATIC_PROMOS,
  EXTRAS,
  BANK_DETAILS,
  STORAGE_KEY,
  checkIfStoreIsOpen,
  BASE_ROLL_PRICE,
  ABOUT_SECTION_DATA,
} from "./config";
// --- FIN IMPORTACIÓN DE DATOS DE NEGOCIO ---

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

// --- HOOK PARA DRAG HORIZONTAL ---
function useHorizontalDragScroll(ref) {
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleMouseDown = (e) => {
      // Permitir que el clic en botones funcione
      if (e.target.closest("button") || e.target.closest("a")) return;

      setIsDragging(true);
      setStartX(e.pageX - el.offsetLeft);
      setScrollLeft(el.scrollLeft);
      el.style.cursor = "grabbing";
    };

    const handleMouseLeave = () => {
      if (isDragging) {
        setIsDragging(false);
        el.style.cursor = "grab";
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      el.style.cursor = "grab";
    };

    const handleMouseMove = (e) => {
      if (!isDragging) return;
      e.preventDefault();
      const x = e.pageX - el.offsetLeft;
      const walk = (x - startX) * 1.5; // Factor de velocidad
      el.scrollLeft = scrollLeft - walk;
    };

    el.addEventListener("mousedown", handleMouseDown);
    el.addEventListener("mouseleave", handleMouseLeave);
    el.addEventListener("mouseup", handleMouseUp);
    el.addEventListener("mousemove", handleMouseMove);

    // Configura cursor inicial (no dragging)
    el.style.cursor = "grab";
    el.style.userSelect = "none"; // Evita selección de texto

    return () => {
      el.removeEventListener("mousedown", handleMouseDown);
      el.removeEventListener("mouseleave", handleMouseLeave);
      el.removeEventListener("mouseup", handleMouseUp);
      el.removeEventListener("mousemove", handleMouseMove);
      // Limpieza de estilos
      el.style.cursor = "";
      el.style.userSelect = "";
    };
  }, [isDragging, startX, scrollLeft, ref]);

  // Aplica estilos de transición para el scroll (opcional, para suavidad)
  useEffect(() => {
    const el = ref.current;
    if (el) {
      el.style.scrollBehavior = "smooth";
      el.style.overflowX = "scroll"; // Asegurarse que el scroll esté habilitado
    }
  }, [ref]);
}

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
      "bg-[#F91250]/10 text-[#F91250] border-[#F91250]/50 hover:bg-[#F91250]/20 hover:shadow-[0_0_20px_rgba(249,18,80,0.3)]",
    secondary:
      "bg-[#494949]/10 text-[#494949] border-[#494949]/50 hover:bg-[#494949]/20 hover:shadow-[0_0_20px_rgba(73,73,73,0.3)]",
    ghost: "bg-white/5 text-gray-800 border-gray-300 hover:bg-gray-100",
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`relative overflow-hidden transition-all duration-300 font-medium tracking-wider py-3 px-6 rounded-xl backdrop-blur-sm group disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 border ${
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
        className="absolute inset-0 bg-white/90 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      <div className="relative w-full max-w-md bg-white border border-[#F91250]/50 rounded-2xl shadow-2xl p-6 text-center animate-in zoom-in-95 duration-300">
        <div className="w-16 h-16 bg-[#F91250]/10 rounded-full flex items-center justify-center mb-4 mx-auto border-4 border-[#F91250]/20">
          <Clock size={32} className="text-[#F91250]" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-3">Local Cerrado</h3>
        <p className="text-gray-600 mb-6">
          Lo sentimos, nuestro local se encuentra cerrado en este momento. Solo
          puedes realizar pedidos durante nuestro horario de atención:
        </p>
        <p className="font-medium text-[#F91250] bg-gray-100 py-3 rounded-lg">
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
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white border border-gray-300 rounded-2xl w-full max-w-md flex flex-col shadow-2xl">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <h3
            className={`text-lg font-bold flex items-center gap-2 text-gray-900`}
          >
            <Layers className={`w-5 h-5 text-[#F91250]`} /> Elegir{" "}
            <span className={tier.color.replace('text-green-600', 'text-green-600').replace('text-blue-600', 'text-blue-600').replace('text-[#F91250]', 'text-[#F91250]')}>
                {tier.label.split(":")[1].trim()}
            </span>
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-full text-gray-500"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-3 bg-yellow-100 border-b border-yellow-300 text-yellow-800 text-xs flex items-start gap-2">
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
                    ? `bg-[#F91250]/10 border-[#F91250] text-gray-900`
                    : "border-gray-200 bg-white text-gray-800 hover:bg-gray-50"
                }`}
              >
                <span>
                  {ing.name}{" "}
                  {isOriginal && (
                    <span className="ml-2 text-[10px] uppercase bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded">
                      Original
                    </span>
                  )}
                </span>
                <span
                  className={`text-xs ${
                    displayPrice === "Incluido"
                      ? "text-green-600 font-medium"
                      : "opacity-70 text-[#F91250]"
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
  const tierFillings = VEGETARIAN_FILLINGS_DATA;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white border border-gray-300 rounded-2xl w-full max-w-md flex flex-col shadow-2xl">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <h3
            className={`text-lg font-bold flex items-center gap-2 text-green-600`}
          >
            <Layers className={`w-5 h-5 text-[#F91250]`} /> Elegir Relleno Vegetariano
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-full text-gray-500"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-3 bg-green-100 border-b border-green-300 text-green-800 text-xs flex items-start gap-2">
          <Info size={14} className="shrink-0 mt-0.5" />
          <p>
            El precio base del roll es de ${BASE_ROLL_PRICE}. Cada ingrediente que elijas
            sumará su precio de lista al total.
          </p>
        </div>
        <div className="p-4 grid grid-cols-1 gap-2 max-h-[60vh] overflow-y-auto custom-scrollbar">
          {tierFillings.map((ing) => {
            const isSelected = ing.id === currentFillingId;
            let displayPrice = `+$${ing.price}`;
            return (
              <button
                key={ing.id}
                onClick={() => onSelect(ing.id)}
                className={`p-3 text-sm text-left rounded-lg border transition-all flex justify-between ${
                  isSelected
                    ? `bg-green-100 border-green-500 text-gray-900`
                    : "border-gray-200 bg-white text-gray-800 hover:bg-gray-50"
                }`}
              >
                <span>{ing.name}</span>
                <span className={`text-xs opacity-70 text-[#F91250]`}>
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
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      <div className="relative w-full max-w-4xl bg-[#EFEEEE] sm:border border-gray-300 sm:rounded-3xl shadow-2xl overflow-hidden h-full sm:h-auto sm:max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-300">
        <div className="p-6 bg-white border-b border-gray-200 flex justify-between items-start shrink-0">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900">
              {promo.name}
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              {isReadOnly
                ? "Detalle de la promoción (fija)."
                : "Configura los rellenos de cada Roll."}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-gray-100 rounded-full text-gray-600 hover:bg-gray-200"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-4 sm:p-6 overflow-y-auto custom-scrollbar grow bg-white">
          {isReadOnly ? (
            <div className="p-3 mb-4 rounded-xl bg-[#F91250]/10 border border-[#F91250]/20 text-gray-800 text-sm flex items-start gap-3 mx-4 sm:mx-0">
              <Info size={18} className="shrink-0 mt-0.5 text-[#F91250]" />
              <p>
                Esta es una promo de precio fijo. Los ingredientes no se pueden
                cambiar, ¡listos para disfrutar!
              </p>
            </div>
          ) : (
            <div className="p-3 mb-4 rounded-xl bg-yellow-100 border border-yellow-300 text-yellow-800 text-sm flex items-start gap-3 mx-4 sm:mx-0">
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

          <div className="space-y-4">
            {rollsState.map((roll, rollIdx) => {
              const wrapperName = WRAPPERS[roll.wrapperKey]?.name || "N/A";
              const rollFillings = (
                roll.fillings || promo.rolls[rollIdx].defaultFillings
              ).map((fid) => getFillingById(fid).name);

              return (
                <div
                  key={rollIdx}
                  className="p-4 rounded-2xl bg-[#EFEEEE] border border-gray-200"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full bg-[#F91250]/10 flex items-center justify-center border border-[#F91250]/20 shrink-0 mt-1">
                      <Disc size={18} className="text-[#F91250]" />
                    </div>
                    <div>
                      <h4 className="text-gray-900 font-bold">
                        {roll.name}{" "}
                        <span className="text-gray-500 text-sm font-normal">
                          ({roll.pieces} cortes)
                        </span>
                      </h4>
                      <div className="flex items-center gap-2 text-sm mt-1">
                        <span className="text-gray-600">Envoltura:</span>
                        <span className="font-medium text-[#494949]">
                          {wrapperName}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* --- INICIO: MODIFICACIÓN PARA VISTA COMPACTA ESTÁTICA --- */}
                  {isReadOnly ? (
                    <div className="pt-2">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-gray-600 font-medium">
                          Rellenos:
                        </span>
                        <span className="font-semibold text-[#494949]">
                          {rollFillings.join(" • ")}
                        </span>
                      </div>
                    </div>
                  ) : (
                    // MODO EDITABLE (como estaba antes)
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {SLOT_TIERS.map((tier, slotIdx) => {
                        const fillingId = roll.fillings[slotIdx];
                        const filling = getFillingById(fillingId);
                        const originalFillingId =
                          promo.rolls[rollIdx].defaultFillings[slotIdx];
                        const isChanged = fillingId !== originalFillingId;

                        return (
                          <button
                            key={slotIdx}
                            onClick={() =>
                              setActiveConfig({
                                rollIndex: rollIdx,
                                slotIndex: slotIdx,
                                tierKey: tier.id,
                              })
                            }
                            className={`relative p-3 rounded-xl border transition-all text-left group ${
                              isChanged
                                ? "bg-yellow-50 border-yellow-400"
                                : "bg-white border-gray-200"
                            }`}
                          >
                            <div
                              className={`text-[10px] uppercase mb-1 font-bold ${tier.color}`}
                            >
                              {tier.label}
                            </div>
                            <div className="font-medium text-gray-800 truncate pr-6">
                              {filling.name}
                            </div>
                            {isChanged && (
                              <div className="text-[10px] text-yellow-600 absolute top-3 right-8 font-bold">
                                +${filling.price}
                              </div>
                            )}
                            <ChevronRight
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-gray-800 transition-colors"
                              size={16}
                            />
                          </button>
                        );
                      })}
                    </div>
                  )}
                  {/* --- FIN DE LA MODIFICACIÓN --- */}
                </div>
              );
            })}
          </div>
        </div>
        <div className="p-6 bg-white border-t border-gray-200 shrink-0 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-gray-600 text-sm">Total Promoción</span>
            <div className="text-3xl font-bold text-[#F91250]">
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
  const baseRollPrice = BASE_ROLL_PRICE;
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
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      <div className="relative w-full max-w-2xl bg-[#EFEEEE] sm:border border-gray-300 sm:rounded-3xl shadow-[0_0_50px_rgba(249,18,80,0.3)] overflow-hidden flex flex-col animate-in slide-in-from-bottom duration-300 max-h-[90vh]">
        <div className="p-6 bg-white border-b border-gray-200 flex justify-between">
          <h2 className="text-2xl font-black text-[#F91250] flex items-center gap-2">
            <Zap /> NEO-LAB (10p)
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-[#494949]">
            <X />
          </button>
        </div>
        <div className="p-6 overflow-y-auto grow custom-scrollbar">
          {step === 1 ? (
            <>
              <h3 className="text-lg font-bold text-gray-900 mb-4">
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
                    className="p-4 rounded-xl border border-gray-300 bg-white hover:bg-[#F91250]/10 hover:border-[#F91250] transition-all text-left shadow-sm"
                  >
                    <span className="font-bold text-gray-900 block mb-1">
                      {wrapper.name}
                    </span>
                    <span className="text-[#F91250] text-sm">
                      {/* Corregido: Solo muestra el precio si es mayor a 0 */}
                      {wrapper.price > 0 && `+${formatPrice(wrapper.price)}`}
                    </span>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div className="space-y-6">
              <div className="flex justify-between items-center p-4 bg-white rounded-xl border border-gray-300">
                <span className="text-gray-600">Envoltura:</span>
                <span className="font-bold text-[#F91250]">
                  {WRAPPERS[selectedWrapper].name}
                </span>
                <button
                  onClick={() => setStep(1)}
                  className="text-xs underline text-gray-500 hover:text-[#494949]"
                >
                  Cambiar
                </button>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Paso 2: Configura tus 3 Rellenos
              </h3>
              <div className="p-3 -mt-2 rounded-xl bg-[#F91250]/10 border border-[#F91250]/20 text-[#494949] text-sm flex items-start gap-3">
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
                    className={`p-4 rounded-xl border transition-all text-left relative min-h-[100px] flex flex-col justify-center shadow-sm ${
                      fillings[idx]
                        ? `border-[#F91250]/50 bg-[#F91250]/10`
                        : "border-dashed border-gray-300 hover:border-[#494949]/30 bg-white"
                    }`}
                  >
                    <div
                      className={`text-[10px] uppercase mb-2 font-bold ${tier.color}`}
                    >
                      {tier.label}
                    </div>
                    {fillings[idx] ? (
                      <div className="font-medium text-gray-900">
                        {getFillingById(fillings[idx]).name}
                      </div>
                    ) : (
                      <span className="text-gray-500 italic">Elegir...</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="p-6 bg-white border-t border-gray-200 shrink-0 flex justify-between items-center">
          <div>
            <div className="text-gray-600 text-xs">Total Roll Custom</div>
            <div className="text-3xl font-bold text-[#F91250]">
              {formatPrice(currentTotal)}
            </div>
          </div>
          {step === 2 && (
            <GlowingButton
              variant="primary"
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
  const baseRollPrice = BASE_ROLL_PRICE; // Mismo precio base que el custom

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
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      <div className="relative w-full max-w-2xl bg-[#EFEEEE] sm:border border-gray-300 sm:rounded-3xl shadow-[0_0_50px_rgba(73,73,73,0.3)] overflow-hidden flex flex-col animate-in slide-in-from-bottom duration-300 max-h-[90vh]">
        <div className="p-6 bg-white border-b border-gray-200 flex justify-between">
          <h2 className="text-2xl font-black text-[#494949] flex items-center gap-2">
            <Leaf className="text-green-600" /> Roll Vegetariano (10p)
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-[#494949]">
            <X />
          </button>
        </div>
        <div className="p-6 overflow-y-auto grow custom-scrollbar">
          {step === 1 ? (
            <>
              <h3 className="text-lg font-bold text-gray-900 mb-4">
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
                    className="p-4 rounded-xl border border-gray-300 bg-white hover:bg-[#F91250]/10 hover:border-[#F91250] transition-all text-left shadow-sm"
                  >
                    <span className="font-bold text-gray-900 block mb-1">
                      {wrapper.name}
                    </span>
                    <span className="text-[#F91250] text-sm">
                      {/* Corregido: Solo muestra el precio si es mayor a 0 */}
                      {wrapper.price > 0 && `+${formatPrice(wrapper.price)}`}
                    </span>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div className="space-y-6">
              <div className="flex justify-between items-center p-4 bg-white rounded-xl border border-gray-300">
                <span className="text-gray-600">Envoltura:</span>
                <span className="font-bold text-[#F91250]">
                  {WRAPPERS[selectedWrapper].name}
                </span>
                <button
                  onClick={() => setStep(1)}
                  className="text-xs underline text-gray-500 hover:text-[#494949]"
                >
                  Cambiar
                </button>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Paso 2: Elige 3 Rellenos Veggie
              </h3>
              <div className="p-3 -mt-2 rounded-xl bg-green-100 border border-green-300 text-green-800 text-sm flex items-start gap-3">
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
                    className={`p-4 rounded-xl border transition-all text-left relative min-h-[100px] flex flex-col justify-center shadow-sm ${
                      fillings[idx]
                        ? `border-green-500/50 bg-green-100`
                        : "border-dashed border-gray-300 hover:border-[#494949]/30 bg-white"
                    }`}
                  >
                    <div
                      className={`text-[10px] uppercase mb-2 font-bold text-green-600`}
                    >
                      {label}
                    </div>
                    {fillings[idx] ? (
                      <div className="font-medium text-gray-900">
                        {getFillingById(fillings[idx]).name}
                      </div>
                    ) : (
                      <span className="text-gray-500 italic">Elegir...</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="p-6 bg-white border-t border-gray-200 shrink-0 flex justify-between items-center">
          <div>
            <div className="text-gray-600 text-xs">Total Roll Veggie</div>
            <div className="text-3xl font-bold text-[#F91250]">
              {formatPrice(currentTotal)}
            </div>
          </div>
          {step === 2 && (
            <GlowingButton
              variant="primary" // Botón primario (#F91250)
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

// --- NUEVO MODAL PARA EXTRAS CONFIGURABLES ---
function ExtraConfigModal({ extra, onClose, onAddToCart }) {
  const [selectedOption, setSelectedOption] = useState(extra.options ? extra.options[0] : null);
  const [quantity, setQuantity] = useState(1);
  
  const handleQuantityChange = (delta) => {
    setQuantity(prev => Math.max(1, prev + delta));
  }

  const handleAdd = () => {
    let description = extra.description;
    
    // Customize description based on selected option
    if (extra.id === 'e1' && selectedOption) { // Bebida
      description = `Sabor: ${selectedOption}`;
    } else if (extra.id === 'e2' && selectedOption) { // Gyoza
      description = `Tipo: ${selectedOption}`;
    } else if (extra.id === 'e3' && selectedOption) { // Salsas
      description = `Tipo: ${selectedOption} (Botellita 50cc)`;
    } else {
      // Default / Fallback description
      description = extra.description;
    }

    const itemForCart = {
      id: extra.id,
      name: extra.name,
      description: description,
      selectedOption: selectedOption,
      quantity: quantity,
      totalPrice: extra.price * quantity,
      type: "EXTRA_CONFIGURED",
      uuid: Date.now(),
    };
    onAddToCart(itemForCart);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4"> {/* Aumentado a z-100 para estar sobre todo el contenido base */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      <div className="relative w-full max-w-md bg-white border border-[#F91250]/50 rounded-2xl shadow-2xl p-6 flex flex-col animate-in zoom-in-95 duration-300">
        <div className="flex justify-between items-center pb-4 border-b border-gray-200">
          <h3 className="text-xl font-black text-gray-900">{extra.name}</h3>
          <button
            onClick={onClose}
            className="p-2 bg-gray-100 rounded-full text-gray-600 hover:bg-gray-200"
          >
            <X size={20} />
          </button>
        </div>

        <div className="py-6 space-y-4">
          <div className="text-sm text-gray-600">
            {extra.description.split('.').filter(p => p.trim().length > 0).map((p, i) => (
                <p key={i} className="mb-1">{p.trim()}</p>
            ))}
            <p className="font-bold text-[#F91250] mt-2">Precio Unitario: {formatPrice(extra.price)}</p>
          </div>
          
          {/* Opciones de Selección */}
          {extra.options && (
            <div className="space-y-2">
              <label className="block text-sm font-bold text-[#494949]">Seleccionar Opción</label>
              <div className="grid grid-cols-3 gap-2">
                {extra.options.map((option) => (
                  <button
                    key={option}
                    onClick={() => setSelectedOption(option)}
                    className={`p-3 rounded-xl border transition-all text-sm font-medium ${
                      selectedOption === option
                        ? "bg-[#F91250]/10 border-[#F91250] text-[#F91250]"
                        : "bg-white border-gray-300 text-gray-800 hover:bg-gray-50"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Selector de Cantidad */}
          <div className="flex justify-between items-center pt-4 border-t border-gray-100">
            <span className="text-sm font-bold text-[#494949]">Cantidad</span>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => handleQuantityChange(-1)} 
                disabled={quantity <= 1}
                className="p-2 bg-gray-100 rounded-full text-gray-600 disabled:opacity-50 hover:bg-gray-200"
              >
                <ArrowLeft size={16} />
              </button>
              <span className="w-8 text-center font-bold text-lg">{quantity}</span>
              <button 
                onClick={() => handleQuantityChange(1)} 
                className="p-2 bg-gray-100 rounded-full text-gray-600 hover:bg-gray-200"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg text-gray-600">Total a Pagar</span>
            <span className="text-2xl font-black text-[#F91250]">
              {formatPrice(extra.price * quantity)}
            </span>
          </div>
          <GlowingButton
            variant="primary"
            fullWidth
            onClick={handleAdd}
            disabled={!selectedOption && extra.options} // Deshabilita si es configurable y no se eligió opción
          >
            Agregar {extra.name}
          </GlowingButton>
        </div>
      </div>
    </div>
  );
}
// --- FIN NUEVO MODAL PARA EXTRAS ---

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
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] transition-opacity ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[450px] bg-[#EFEEEE] border-l border-gray-300 shadow-2xl z-[101] transform transition-transform duration-300 ease-out flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-6 border-b border-gray-200 flex items-center justify-between bg-white">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3">
            <ShoppingCart className="text-[#F91250]" /> Pedido Cuántico
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-[#494949]">
            <X size={24} />
          </button>
        </div>
        <div
          ref={cartBodyRef} // Añadir ref al div scrollable
          className="flex-grow overflow-y-auto p-4 space-y-4 custom-scrollbar bg-gray-50"
        >
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 opacity-50">
              <ShoppingBag size={64} className="mb-4" />
              <p>Vacío.</p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.uuid}
                className="rounded-2xl bg-white border border-gray-200 overflow-hidden relative group shadow-sm"
              >
                <div className="p-4 bg-gray-50 flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-[#F91250]">{item.name}</h3>
                    <p className="text-xs text-gray-600">
                      {/* --- INICIO: LÓGICA DE TIPO ACTUALIZADA --- */}
                      {item.type === "PROMO"
                        ? "Promo Modificable"
                        : item.type === "CUSTOM"
                        ? "Roll Personalizado"
                        : item.type === "STATIC"
                        ? "Promo Estática"
                        : item.type === "VEGGIE"
                        ? "Roll Vegetariano" // <-- NUEVA LÍNEA
                        : `Extra (${item.quantity}u)`} {/* <-- Updated Extra description */}
                      {/* --- FIN: LÓGICA DE TIPO ACTUALIZADA --- */}
                    </p>
                  </div>
                  {/* Se añadió pr-10 para dar espacio al botón de eliminar */}
                  <span className="font-bold text-gray-900 pr-10">
                    {formatPrice(item.totalPrice)}
                  </span>
                </div>
                {/* --- INICIO: LÓGICA DE RENDERIZADO DE ITEMS CORREGIDA --- */}
                {item.type === "PROMO" || item.type === "STATIC" ? (
                  // Lógica para promos (modificables o estáticas)
                  <div className="p-4 space-y-3 text-sm border-t border-gray-100">
                    {(item.configuredRolls || item.rolls).map((roll, idx) => (
                      <div
                        key={idx}
                        className="pl-3 border-l-2 border-gray-300"
                      >
                        <div className="text-gray-800 font-medium">
                          {roll.name}{" "}
                          <span className="text-gray-500 text-xs">
                            {WRAPPERS[roll.wrapperKey]
                              ? `(${WRAPPERS[roll.wrapperKey].name})`
                              : "(N/A)"}
                          </span>
                        </div>
                        <div className="text-gray-600 text-xs leading-tight mt-1">
                          {(roll.fillings || roll.defaultFillings)
                            .map((fid) => getFillingById(fid).name)
                            .join(" • ")}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : item.type === "CUSTOM" || item.type === "VEGGIE" ? ( // <-- LÓGICA ACTUALIZADA
                  // Lógica específica para Roll Custom (Neo-Lab) y Veggie
                  <div className="p-4 space-y-3 text-sm border-t border-gray-100">
                    <div className="pl-3 border-l-2 border-gray-300">
                      <div className="text-gray-800 font-medium">
                        Envoltura:{" "}
                        <span className="text-[#F91250] text-xs">
                          {WRAPPERS[item.wrapperKey]
                            ? WRAPPERS[item.wrapperKey].name
                            : "N/A"}
                        </span>
                      </div>
                      <div className="text-gray-600 text-xs leading-tight mt-1">
                        Rellenos:{" "}
                        {item.fillings
                          .map((fid) => getFillingById(fid).name)
                          .join(" • ")}
                      </div>
                    </div>
                  </div>
                ) : (
                  // Lógica para Extras (bebidas, etc.)
                  <p className="p-4 text-sm text-gray-600 border-t border-gray-100">
                    {item.description}
                  </p>
                )}
                {/* --- FIN: LÓGICA DE RENDERIZADO DE ITEMS CORREGIDA --- */}
                <button
                  onClick={() => onRemove(item.uuid)}
                  className="absolute top-2 right-2 p-2 text-gray-500 hover:text-[#F91250] opacity-0 group-hover:opacity-100 transition-all bg-white/80 rounded-full"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          )}
        </div>
        <div className="p-6 border-t border-gray-200 bg-white shrink-0">
          <div className="flex justify-between items-center mb-6">
            <span className="text-gray-600">Total Final</span>
            <span className="text-3xl font-bold text-[#F91250]">
              {formatPrice(total)}
            </span>
          </div>
          {/* LÓGICA DE BOTÓN DESHABILITADO Y NUEVOS BOTONES (ORDEN CAMBIADO) */}
          <div className="space-y-3">
            {/* "Seguir Viendo" y "Vaciar Todo" ahora están primero */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={onClose}
                className="flex items-center justify-center gap-2 p-3 rounded-xl border border-gray-300 text-gray-600 hover:text-[#494949] hover:bg-gray-100 transition-colors text-sm font-medium"
              >
                <ArrowLeft size={16} /> Seguir Viendo
              </button>
              <button
                onClick={onClearCart}
                disabled={items.length === 0}
                className="flex items-center justify-center gap-2 p-3 rounded-xl border border-[#F91250]/20 text-[#F91250] hover:bg-[#F91250]/10 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Trash2 size={16} /> Vaciar Todo
              </button>
            </div>

            {/* "Continuar con Pedido" ahora está al final */}
            <GlowingButton
              variant="primary"
              fullWidth
              disabled={items.length === 0}
              onClick={onCheckout}
            >
              Continuar con Pedido
            </GlowingButton>
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
          // "rut" eliminado
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
      // "rut" eliminado
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
    } else if (name === "rut") {
      // Lógica de RUT eliminada, se maneja en 'else'
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    // --- FIN: CAMBIO 2 (LÓGICA) ---
  };
  const isFormValid = useMemo(() => {
    if (!formData.fullName || formData.phone.length < 8) return false;
    // Validación de RUT eliminada
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
        className="flex items-center gap-2 text-gray-600 hover:text-[#494949] mb-6 transition-colors"
      >
        <ArrowLeft size={20} /> Volver al Menú
      </button>
      {/* 2. TÍTULO ACTUALIZADO */}
      <h2 className="text-3xl font-black text-gray-900 mb-8 flex items-center gap-3 border-b border-gray-200 pb-4">
        <CreditCard className="text-[#F91250]" /> Finalizar Pedido
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Sección 1: Datos */}
          <section className="space-y-4">
            <h3 className="text-xl font-bold text-[#F91250] mb-4">
              1. Tus Datos
            </h3>
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Nombre Completo *
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                required
                className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:border-[#F91250] focus:outline-none transition-colors shadow-sm"
                placeholder="Ej: Juan Pérez"
              />
            </div>
            {/* --- CAMPO DE RUT ELIMINADO --- */}
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Teléfono (Solo números) *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
                maxLength={11}
                className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:border-[#F91250] focus:outline-none transition-colors shadow-sm"
                placeholder="Ej: 912345678"
              />
            </div>
          </section>
          {/* Sección 2: Entrega */}
          <section className="space-y-4">
            <h3 className="text-xl font-bold text-[#F91250] mb-4">
              2. Tipo de Entrega
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() =>
                  setFormData({ ...formData, deliveryType: "delivery" })
                }
                className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all shadow-sm ${
                  formData.deliveryType === "delivery"
                    ? "bg-[#F91250]/10 border-[#F91250] text-[#494949]"
                    : "bg-white border-gray-300 text-gray-600 hover:bg-gray-100"
                }`}
              >
                <MapPin /> Delivery
              </button>
              <button
                type="button"
                onClick={() =>
                  setFormData({ ...formData, deliveryType: "pickup" })
                }
                className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all shadow-sm ${
                  formData.deliveryType === "pickup"
                    ? "bg-[#F91250]/10 border-[#F91250] text-[#494949]"
                    : "bg-white border-gray-300 text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Store /> Retiro en Local
              </button>
            </div>
            {formData.deliveryType === "delivery" ? (
              <div className="space-y-4 animate-in slide-in-from-top-2">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Dirección *
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required={formData.deliveryType === "delivery"}
                    className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:border-[#F91250] shadow-sm"
                    placeholder="Calle y número"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      Comuna *
                    </label>
                    <input
                      type="text"
                      name="commune"
                      value={formData.commune}
                      onChange={handleInputChange}
                      required={formData.deliveryType === "delivery"}
                      className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:border-[#F91250] shadow-sm"
                      placeholder="Ej: Santiago"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      Referencia (Opcional)
                    </label>
                    <input
                      type="text"
                      name="reference"
                      value={formData.reference}
                      onChange={handleInputChange}
                      className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:border-[#F91250] shadow-sm"
                      placeholder="Ej: Portón negro"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-gray-100 border border-gray-300 rounded-xl text-gray-800 text-sm animate-in slide-in-from-top-2 space-y-2">
                <p>
                  <Store className="inline mr-2 mb-1 text-[#F91250]" size={16} /> Retiro en:{" "}
                  <strong>{ABOUT_SECTION_DATA.location.replace(/,.*$/, "")}</strong>.
                </p>
                <p className="flex items-center gap-2 text-[#494949] font-medium border-t border-gray-200 pt-2 mt-2">
                  <Calendar size={16} className="text-[#F91250]" /> Fecha de retiro: {getTodayDateStr()}
                </p>
              </div>
            )}
          </section>
          {/* Sección 3: Pago */}
          <section className="space-y-4">
            <h3 className="text-xl font-bold text-[#F91250] mb-4">
              3. Forma de Pago
            </h3>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() =>
                  setFormData({ ...formData, paymentMethod: "transfer" })
                }
                className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all shadow-sm ${
                  formData.paymentMethod === "transfer"
                    ? "bg-[#F91250]/10 border-[#F91250] text-[#494949]"
                    : "bg-white border-gray-300 text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Banknote /> Transferencia / MP
              </button>
              <button
                type="button"
                onClick={() =>
                  setFormData({ ...formData, paymentMethod: "cash" })
                }
                className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all shadow-sm ${
                  formData.paymentMethod === "cash"
                    ? "bg-[#F91250]/10 border-[#F91250] text-[#494949]"
                    : "bg-white border-gray-300 text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Banknote /> Efectivo
              </button>
              {/* --- INICIO: NUEVO BOTÓN DE PAGO --- */}
              <button
                type="button"
                onClick={() => setFormData({ ...formData, paymentMethod: "pos" })}
                className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all shadow-sm ${
                  formData.paymentMethod === "pos"
                    ? "bg-[#F91250]/10 border-[#F91250] text-[#494949]"
                    : "bg-white border-gray-300 text-gray-600 hover:bg-gray-100"
                }`}
              >
                <CreditCard /> Débito / Crédito
              </button>
              {/* --- FIN: NUEVO BOTÓN DE PAGO --- */}
            </div>
            {formData.paymentMethod === "transfer" ? (
              <div className="bg-white border border-gray-300 rounded-xl p-4 space-y-4 text-sm animate-in slide-in-from-top-2 shadow-sm">
                {/* --- INICIO: CONTROLADOR DE TABS --- */}
                <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 rounded-lg">
                  <button
                    type="button"
                    onClick={() => setPaymentTab("transfer")}
                    className={`py-2 px-3 rounded-md text-xs font-bold transition-all ${
                      paymentTab === "transfer"
                        ? "bg-[#F91250]/50 text-white shadow"
                        : "text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    Datos de Transferencia
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentTab("mercadopago")}
                    className={`py-2 px-3 rounded-md text-xs font-bold transition-all ${
                      paymentTab === "mercadopago"
                        ? "bg-[#F91250]/50 text-white shadow"
                        : "text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    Mercado Pago
                  </button>
                </div>
                {/* --- FIN: CONTROLADOR DE TABS --- */}

                {/* --- INICIO: CONTENIDO DE TABS --- */}
                {paymentTab === "transfer" ? (
                  <div className="animate-in fade-in duration-200 space-y-3">
                    <p className="text-gray-600 text-xs mb-2">
                      Copia los datos para transferir:
                    </p>
                    {Object.entries(BANK_DETAILS).map(([key, value]) => (
                      <div
                        key={key}
                        className="flex justify-between items-center py-2 border-b border-gray-200 last:border-0"
                      >
                        <span className="text-gray-600 capitalize">
                          {key.replace("_", " ")}:
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-[#494949] select-all">
                            {value}
                          </span>
                          <button
                            type="button"
                            onClick={() => document.execCommand('copy')} // Uso de execCommand para compatibilidad
                            className="p-1.5 bg-gray-100 hover:bg-[#F91250]/20 text-gray-500 hover:text-[#F91250] rounded-md transition-colors"
                            title="Copiar"
                          >
                            <Copy size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                    {/* 3. TEXTO DE INSTRUCCIÓN DE PAGO (CHECKOUT) ACTUALIZADO */}
                    <div className="mt-2 pt-2 text-[#494949] text-xs flex items-start gap-2">
                      <Info size={16} className="shrink-0 mt-0.5 text-[#F91250]" />
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
                      <CreditCard className="text-[#F91250]" size={20} />
                      <h4 className="font-bold text-gray-900">
                        Pago con Mercado Pago
                      </h4>
                    </div>
                    <p className="text-gray-600 text-xs">
                      Al confirmar tu pedido, te contactaremos por WhatsApp para
                      enviarte el link de pago de Mercado Pago.
                    </p>
                    <div className="mt-2 pt-2 text-[#494949] text-xs flex items-start gap-2">
                      <Info size={16} className="shrink-0 mt-0.5 text-[#F91250]" />
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
                <label className="block text-sm text-gray-600 mb-1">
                  ¿Con cuánto pagas? (Para calcular vuelto)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
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
                    className="w-full bg-white border border-gray-300 rounded-xl pl-8 pr-4 py-3 text-gray-900 focus:border-[#F91250] shadow-sm"
                    placeholder="Ej: 20.000" // Actualizado placeholder
                  />
                  {/* --- FIN: CAMBIO 2 (APARIENCIA) --- */}
                </div>
              </div>
            ) : formData.paymentMethod === "pos" ? (
              // --- INICIO: NUEVO BLOQUE PARA PAGO CON MÁQUINA ---
              <div className="animate-in slide-in-from-top-2 bg-white border border-gray-300 rounded-xl p-4 space-y-3 text-sm shadow-sm">
                <div className="flex items-center gap-2">
                  <CreditCard className="text-[#F91250]" size={20} />
                  <h4 className="font-bold text-gray-900">
                    Pago con Débito / Crédito
                  </h4>
                </div>
                <p className="text-gray-600 text-xs">
                  Has seleccionado pagar con la máquina (POS).
                </p>
                <div className="mt-2 pt-2 text-[#494949] text-xs flex items-start gap-2">
                  <Info size={16} className="shrink-0 mt-0.5 text-[#F91250]" />
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
        <div className="bg-white border border-gray-200 rounded-3xl p-6 h-fit sticky top-24 shadow-lg">
          <h3 className="text-xl font-bold text-gray-900 mb-6">
            Resumen del Pedido
          </h3>
          <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
            {cartItems.map((item) => (
              <div
                key={item.uuid}
                className="flex justify-between items-start text-sm"
              >
                <div>
                  <p className="font-bold text-[#F91250]">{item.name}</p>
                  <p className="text-gray-500 text-xs">
                    {/* --- INICIO: LÓGICA DE TIPO ACTUALIZADA --- */}
                    {item.type === "PROMO"
                      ? "Pack"
                      : item.type === "CUSTOM"
                      ? "Custom Roll"
                      : item.type === "VEGGIE"
                      ? "Roll Vegetariano"
                      : item.type === "EXTRA_CONFIGURED"
                      ? `${item.description} (${item.quantity}u)` // Configured Extra
                      : `${item.description} (${item.quantity || 1}u)`} // Simple Extra
                    {/* --- FIN: LÓGICA DE TIPO ACTUALIZADA --- */}
                  </p>
                </div>
                <p className="font-medium text-[#494949]">
                  {formatPrice(item.totalPrice)}
                </p>
              </div>
            ))}
          </div>

          {/* --- INICIO: SECCIÓN DE TOTALES ACTUALIZADA --- */}
          <div className="border-t border-gray-200 pt-4 space-y-2 mb-6">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium text-[#494949]">
                {formatPrice(total)}
              </span>
            </div>

            {/* Mostrar despacho solo si es delivery y se ha ingresado comuna */}
            {deliveryFee > 0 && (
              <div className="flex justify-between items-center text-sm animate-in fade-in duration-300">
                <span className="text-gray-600">Despacho</span>
                <span className="font-medium text-[#494949]">
                  {formatPrice(deliveryFee)}
                </span>
              </div>
            )}

            {/* Separador */}
            <div className="!mt-4 pt-4 border-t border-gray-100"></div>

            <div className="flex justify-between items-center">
              <span className="text-lg text-gray-600">Total a Pagar</span>
              <span className="text-3xl font-black text-[#F91250]">
                {formatPrice(finalTotal)}
              </span>
            </div>
          </div>
          {/* --- FIN: SECCIÓN DE TOTALES ACTUALIZADA --- */}

          {/* Botón de envío que ahora llama a handleSubmit CON la validación de horario */}
          <GlowingButton
            variant="primary"
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

function ThankYouView({ onReset, paymentMethod }) { // <-- Recibe paymentMethod
  
  const showTransferDetails = paymentMethod === "transfer";

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4 animate-in zoom-in-95 duration-500">
      <div className="w-24 h-24 bg-[#F91250]/20 rounded-full flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(249,18,80,0.3)]">
        <CheckCircle size={48} className="text-[#F91250]" />
      </div>
      <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-4">
        ¡Gracias por tu Pedido!
      </h2>
      <p className="text-lg text-gray-700 max-w-md mb-2">
        La espera aproximada de tu pedido es de 45 a 60 minutos.
      </p>
      <p className="text-xl text-gray-600 max-w-md mb-8">
        Tu pedido se encuentra en proceso de preparación en nuestro laboratorio.
      </p>
      
      {/* --- INICIO: MENSAJE CONDICIONAL DE TRANSFERENCIA --- */}
      {showTransferDetails && (
        <>
          <div className="bg-[#F91250]/10 border border-[#F91250]/30 p-4 rounded-xl max-w-md text-gray-800 text-sm mb-8 flex items-start gap-3">
            <Info className="shrink-0 mt-0.5 text-[#F91250]" />
            <p className="text-left">
              Tu pedido ha sido enviado a nuestro WhatsApp. Si elegiste pagar con{" "}
              <strong>Transferencia</strong>, por favor, realiza el pago a los{" "}
              <strong>datos que se muestran a continuación</strong> y{" "}
              <strong>envía el comprobante al mismo chat de WhatsApp</strong> para
              confirmar tu orden.
            </p>
          </div>

          {/* --- INICIO: DATOS DE TRANSFERENCIA AÑADIDOS (CONDICIONAL) --- */}
          <div className="bg-white border border-gray-300 rounded-xl p-4 space-y-3 text-sm max-w-md w-full mb-8 animate-in fade-in duration-300 shadow-sm">
            <h4 className="font-bold text-gray-900 text-left mb-2 text-base">
              Datos de Transferencia
            </h4>
            {Object.entries(BANK_DETAILS).map(([key, value]) => (
              <div
                key={key}
                className="flex justify-between items-center py-2 border-b border-gray-200 last:border-0"
              >
                <span className="text-gray-600 capitalize">
                  {key.replace("_", " ")}:
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-[#494949] select-all">
                    {value}
                  </span>
                  <button
                    type="button"
                    onClick={() => document.execCommand('copy')} // Uso de execCommand para compatibilidad
                    className="p-1.5 bg-gray-100 hover:bg-[#F91250]/20 text-gray-500 hover:text-[#F91250] rounded-md transition-colors"
                    title="Copiar"
                  >
                    <Copy size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
          {/* --- FIN: DATOS DE TRANSFERENCIA AÑADIDOS --- */}
        </>
      )}
      {/* --- FIN: MENSAJE CONDICIONAL DE TRANSFERENCIA --- */}
      
      {/* Mensaje si NO es transferencia */}
      {!showTransferDetails && (
         <div className="p-4 rounded-xl max-w-md text-gray-800 text-sm mb-8 flex items-start gap-3 bg-gray-100 border border-gray-300">
             <Info className="shrink-0 mt-0.5 text-[#F91250]" />
             <p className="text-left">
                Tu pedido fue enviado a nuestro WhatsApp. Te contactaremos pronto para
                confirmar la forma de pago elegida (Efectivo / Débito / Crédito).
             </p>
         </div>
      )}

      <GlowingButton onClick={onReset}>Volver al Inicio</GlowingButton>
    </div>
  );
}

function AboutSection() {
  return (
    <section
      className="relative py-20 border-t border-gray-200 bg-[#EFEEEE]"
      id="nosotros"
    >
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 relative z-10">
        <div className="flex items-center gap-4 mb-12 justify-center">
          <div className="h-px bg-gradient-to-l from-[#F91250]/50 to-transparent w-24"></div>
          <h3 className="text-3xl sm:text-4xl font-black text-gray-900 flex items-center gap-2">
            <Navigation className="text-[#F91250]" /> NOSOTROS
          </h3>
          <div className="h-px bg-gradient-to-r from-[#F91250]/50 to-transparent w-24"></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div className="space-y-8">
            <div className="prose">
              <p className="text-lg text-gray-700 leading-relaxed">
                Nacidos en el año 2077 (metafóricamente),{" "}
                <strong className="text-[#F91250]">NEO SUSHI</strong> fusiona la
                tradición milenaria japonesa con la tecnología de
                personalización más avanzada.
              </p>
            </div>
            {/* Se eliminó 'sm:grid-cols-2' para que las 
              tarjetas de ubicación y horario estén siempre apiladas 
              verticalmente (Ubicación arriba, Horario abajo) 
              en todas las pantallas.
            */}
            <div className="grid grid-cols-1 gap-4 mt-8">
              <div className="p-6 rounded-2xl bg-white border border-gray-200 flex items-start gap-4 shadow-sm">
                <div className="p-3 bg-[#F91250]/10 rounded-lg text-[#F91250]">
                  <MapPin size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">
                    Ubicación Base
                  </h4>
                  <p className="text-gray-600 text-sm">
                    {ABOUT_SECTION_DATA.location}<br />
                    {ABOUT_SECTION_DATA.commune}
                  </p>
                </div>
              </div>
              <div className="p-6 rounded-2xl bg-white border border-gray-200 flex items-start gap-4 shadow-sm">
                <div className="p-3 bg-[#F91250]/10 rounded-lg text-[#F91250]">
                  <Clock size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">
                    Horario Operativo
                  </h4>
                  {/* Horario actualizado aquí también */}
                  <p className="text-gray-600 text-sm">{STORE_HOURS_STRING}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="h-[400px] rounded-3xl overflow-hidden border border-[#F91250]/30 shadow-[0_0_30px_rgba(249,18,80,0.2)] relative bg-white">
            <iframe
              width="100%"
              height="100%"
              frameBorder="0"
              style={{
                // Estilo ajustado para fondo claro
                filter: "grayscale(10%) contrast(1.1)",
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
    <footer className="bg-white border-t border-gray-200 pt-16 pb-8 mt-auto">
      <div className="container mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Columna 1: Logo y Descripción (Ocupa 2 en escritorio) */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-[#F91250] rounded-lg rotate-45 flex items-center justify-center shadow-lg">
                <span className="-rotate-45 font-bold text-white text-xl">
                  N
                </span>
              </div>
              <h2 className="text-2xl font-black text-gray-900 tracking-wider">
                <span className="text-[#494949]">NEO</span>
                <span className="text-[#F91250]">SUSHI</span>
              </h2>
            </div>
            <p className="text-gray-600 max-w-sm mb-6">
              {ABOUT_SECTION_DATA.footerText}
            </p>
          </div>
          
          {/* Columna 2: Navegación (Ocupa 1 en escritorio) */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4 uppercase tracking-wider">
              Navegación
            </h3>
            <ul className="space-y-2 text-gray-600 text-sm">
              <li>
                <a href="#" className="hover:text-[#F91250]">
                  Inicio
                </a>
              </li>
              <li>
                <a href="#menu" className="hover:text-[#F91250]">
                  Menú
                </a>
              </li>
              <li>
                <a href="#nosotros" className="hover:text-[#F91250]">
                  Nosotros
                </a>
              </li>
            </ul>
          </div>
          
          {/* Columna 3: Síguenos (Ocupa 1 en escritorio) */}
          <div className="md:col-span-1"> {/* Aseguramos que solo ocupe una columna en md+ */}
            <h3 className="font-bold text-gray-900 mb-4 uppercase tracking-wider">
              Síguenos
            </h3>
            
            {/* Contenedor de Iconos y Siguenos para controlar el ancho */}
            <div className="flex flex-col gap-2 items-start">
                 {/* Iconos (contenedor flex) */}
                <div className="flex gap-4 items-center" id="footer-social-icons"> 
                  <a
                    href="https://www.instagram.com/appneosushi"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-gray-100 rounded-full text-gray-600 hover:text-[#F91250] transition-all"
                  >
                    <Instagram size={20} />
                  </a>
                  <a
                    href="https://www.facebook.com/neosushiapp"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-gray-100 rounded-full text-gray-600 hover:text-blue-600 transition-all"
                  >
                    <Facebook size={20} />
                  </a>
                </div>

                {/* Mensaje Siguenos - Ubicado debajo de los iconos y con ancho ajustado */}
                {/* Se usa w-[100px] para forzar un ancho que se asemeje a la suma de los dos íconos circulares */}
                 <div className="w-[100px] mt-2">
                    <FloatingFollowUs />
                 </div>
            </div>
          </div>
        </div>
        
        {/* LÍNEA DE COPYRIGHT Y DATOS DE DISEÑO/CREADOR (AJUSTADO PARA UNA SOLA FILA EN ESCRITORIO) */}
        <div className="border-t border-gray-200 pt-8 flex flex-col sm:flex-row justify-center sm:justify-between items-center text-gray-500 text-sm space-y-2 sm:space-y-0">
          
          {/* Contenido Izquierdo: Copyright */}
          <p className="text-center sm:text-left shrink-0">© 2025 Neo Sushi Corp.</p>
          
          {/* Contenido Derecho: Diseño y Redes del Creador (Horizontal) */}
          <div className="flex items-center gap-3 flex-wrap justify-center sm:justify-end text-center sm:text-right">
              {/* Texto de Diseño */}
             <p className="flex items-center gap-1 shrink-0">
                Diseñado por {CREATOR_COMPANY} <Zap size={12} className="text-[#F91250]" />
             </p>
             
             {/* Redes Sociales del Creador */}
             <div className="flex gap-3 items-center shrink-0">
                 <a
                    href={CREATOR_SOCIALS.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={`Instagram de ${CREATOR_COMPANY}`}
                    className="p-1 text-gray-400 hover:text-[#F91250] transition-colors"
                 >
                    <Instagram size={18} />
                 </a>
                 <a
                    href={CREATOR_SOCIALS.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={`WhatsApp de ${CREATOR_COMPANY}`}
                    className="p-1 text-gray-400 hover:text-green-500 transition-colors"
                 >
                    <Phone size={18} />
                 </a>
                 <a
                    href={CREATOR_SOCIALS.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={`Facebook de ${CREATOR_COMPANY}`}
                    className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                 >
                    <Facebook size={18} />
                 </a>
             </div>
          </div>
          
        </div>
      </div>
    </footer>
  );
}

// --- NUEVO COMPONENTE: MENSAJE SIGUENOS ---
function FloatingFollowUs({ isMobile = false }) {
    // Usamos el color principal de la paleta: F91250
    const neonPink = '#F91250';
    
    // Un font más "impactante" de uso común, combinando con el estilo futurista
    const impactFont = 'font-black'; 
    
    // La versión de escritorio mantiene su posición absoluta y visibilidad condicional
    if (!isMobile) {
        // En Nav principal y Footer, usamos "block w-full" para que tome el ancho del contenedor.
        
        // La nav principal usa hidden sm:block para ocultar en móvil
        return (
            <div className="relative w-full"> 
                 <span 
                    className={`text-sm ${impactFont} text-white px-2 py-1 text-center rounded-lg shadow-lg animate-flash-attention block w-full`} 
                    style={{
                        backgroundColor: neonPink,
                        textShadow: `0 0 5px ${neonPink}, 0 0 10px ${neonPink}`
                    }}
                >
                    ¡SÍGUENOS!
                </span>
            </div>
        );
    }

    // La versión móvil (en el menú modal)
    return (
        <span 
            className={`text-xl ${impactFont} text-white px-3 py-1.5 rounded-xl shadow-lg animate-flash-attention block mx-auto mb-4`} 
            style={{
                backgroundColor: neonPink,
                textShadow: `0 0 8px ${neonPink}, 0 0 16px ${neonPink}`
            }}
        >
            ¡SÍGUENOS!
        </span>
    );
}
// --- FIN NUEVO COMPONENTE: MENSAJE SIGUENOS ---


function HeroSection({ scrollTo }) {
  return (
    <header className="relative overflow-hidden px-6 text-center min-h-screen flex flex-col justify-center py-24 bg-[#EFEEEE]">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#F91250]/10 rounded-full blur-[120px] -z-10"></div>
      <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-[#494949]/10 rounded-full blur-[100px] -z-10"></div>
      <h1 className="text-5xl sm:text-7xl font-black mb-6 leading-tight text-gray-900 animate-in fade-in duration-500">
        {ABOUT_SECTION_DATA.heroTitle}
        <span className="text-[#F91250] block">{ABOUT_SECTION_DATA.heroSubtitle}</span>
      </h1>
      <p className="text-gray-600 max-w-xl mx-auto text-lg mb-12 animate-in fade-in duration-500 delay-100">
        {ABOUT_SECTION_DATA.heroDescription}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 max-w-6xl mx-auto w-full animate-in fade-in duration-500 delay-200">
        {/* Card 1: Estáticas */}
        <button
          onClick={() => scrollTo("menu-estaticas")}
          className="group relative p-5 rounded-2xl bg-white border border-gray-200 hover:border-[#F91250]/50 hover:bg-[#F91250]/10 transition-all duration-300 flex items-center gap-4 text-left shadow-sm"
        >
          <Eye size={28} className="text-[#F91250] shrink-0" />
          <div>
            <h3 className="font-bold text-gray-900 text-base">
              Promos Estáticas
            </h3>
            <p className="text-gray-600 text-xs">Packs listos para llevar.</p>
          </div>
        </button>

        {/* Card 2: Modificables */}
        <button
          onClick={() => scrollTo("menu-modificables")}
          className="group relative p-5 rounded-2xl bg-white border border-gray-200 hover:border-[#494949]/50 hover:bg-[#494949]/10 transition-all duration-300 flex items-center gap-4 text-left shadow-sm"
        >
          <Layers size={28} className="text-[#494949] shrink-0" />
          <div>
            <h3 className="font-bold text-gray-900 text-base">
              Promos Modificables
            </h3>
            <p className="text-gray-600 text-xs">Cambia los ingredientes.</p>
          </div>
        </button>

        {/* Card 3: Neo-Lab */}
        <button
          onClick={() => scrollTo("neolab")}
          className="group relative p-5 rounded-2xl bg-white border border-gray-200 hover:border-[#F91250]/50 hover:bg-[#F91250]/10 transition-all duration-300 flex items-center gap-4 text-left shadow-sm"
        >
          <Zap className="text-[#F91250] animate-pulse-slow shrink-0" size={28} />
          <div>
            <h3 className="font-bold text-gray-900 text-base">Neo-Lab</h3>
            <p className="text-gray-600 text-xs">Crea tu roll desde cero.</p>
          </div>
        </button>

        {/* Card 4: Veggie */}
        <button
          onClick={() => scrollTo("veggielab")}
          className="group relative p-5 rounded-2xl bg-white border border-gray-200 hover:border-[#494949]/50 hover:bg-[#494949]/10 transition-all duration-300 flex items-center gap-4 text-left shadow-sm"
        >
          <Leaf className="text-green-600 animate-pulse-slow shrink-0" size={28} />
          <div>
            <h3 className="font-bold text-gray-900 text-base">
              Roll Vegetariano
            </h3>
            <p className="text-gray-600 text-xs">Opciones 100% veggie.</p>
          </div>
        </button>

        {/* Card 5: Bebidas */}
        <button
          onClick={() => scrollTo("menu-bebidas")}
          className="group relative p-5 rounded-2xl bg-white border border-gray-200 hover:border-[#F91250]/50 hover:bg-[#F91250]/10 transition-all duration-300 flex items-center gap-4 text-left shadow-sm"
        >
          <ShoppingBag size={28} className="text-[#F91250] shrink-0" />
          <div>
            <h3 className="font-bold text-gray-900 text-base">
              Bebidas y Extras
            </h3>
            <p className="text-gray-600 text-xs">Acompaña tu pedido.</p>
          </div>
        </button>
      </div>

      <div className="mt-12 animate-in fade-in duration-500 delay-300">
        <button
          onClick={() => scrollTo("menu-estaticas")}
          className="text-gray-600 flex items-center gap-2 mx-auto hover:text-[#494949]"
        >
          O ver el menú completo <ArrowDown size={16} />
        </button>
      </div>
    </header>
  );
}

// --- NUEVO COMPONENTE: INDICADOR DE SCROLL ---
function HorizontalScrollIndicator({ targetRef, id, color }) {
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const observerRef = useRef(null);
  
  // Función para verificar la posición del scroll
  const checkScroll = (el) => {
    if (!el) return;
    const isAtStart = el.scrollLeft === 0;
    const isAtEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 1; // -1 por tolerancia
    setCanScrollLeft(!isAtStart);
    setCanScrollRight(!isAtEnd);
  };

  // Observa el elemento y maneja los eventos de scroll
  useEffect(() => {
    const el = targetRef.current;
    if (!el) return;

    // Inicializa la comprobación al montar
    checkScroll(el);

    const handleScroll = () => checkScroll(el);
    el.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);

    // MutationObserver para detectar cambios en el contenido (p. ej., renderizado de ítems)
    observerRef.current = new MutationObserver(() => checkScroll(el));
    observerRef.current.observe(el, { childList: true, subtree: true, attributes: true });

    return () => {
      el.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [targetRef]);

  // Manejadores de click para scroll suave
  const scroll = (direction) => {
    const el = targetRef.current;
    if (!el) return;
    const scrollAmount = el.clientWidth * 0.75; // Scroll 75% del ancho visible
    const newScrollLeft = direction === 'left' 
      ? el.scrollLeft - scrollAmount 
      : el.scrollLeft + scrollAmount;
    
    el.scrollTo({
      left: newScrollLeft,
      behavior: 'smooth'
    });
  };

  // El elemento debe estar envuelto en un div con position: relative
  // y el `targetRef` debe estar en el elemento que se desplaza (`div` interno)

  return (
    <div className="absolute inset-y-0 w-full pointer-events-none hidden lg:block">
      {/* Flecha Izquierda */}
      <button
        onClick={(e) => { e.preventDefault(); scroll('left'); }}
        disabled={!canScrollLeft}
        className={`absolute left-0 top-0 h-full w-24 flex items-center justify-start transition-opacity duration-300 pointer-events-auto z-10 
          bg-gradient-to-r from-white/90 to-transparent disabled:opacity-0 ${color === 'primary' ? 'text-[#F91250]' : 'text-[#494949]'}
          ${canScrollLeft ? 'opacity-100 hover:from-white/100' : 'opacity-0'}
        `}
        aria-label="Deslizar a la izquierda"
      >
        <ArrowLeft size={36} className="ml-4 drop-shadow-md" />
      </button>

      {/* Flecha Derecha */}
      <button
        onClick={(e) => { e.preventDefault(); scroll('right'); }}
        disabled={!canScrollRight}
        className={`absolute right-0 top-0 h-full w-24 flex items-center justify-end transition-opacity duration-300 pointer-events-auto z-10 
          bg-gradient-to-l from-white/90 to-transparent disabled:opacity-0 ${color === 'primary' ? 'text-[#F91250]' : 'text-[#494949]'}
          ${canScrollRight ? 'opacity-100 hover:from-white/100' : 'opacity-0'}
        `}
        aria-label="Deslizar a la derecha"
      >
        <ChevronRight size={36} className="mr-4 drop-shadow-md" />
      </button>

    </div>
  );
}
// --- FIN NUEVO COMPONENTE ---

function FloatingWhatsappButton() {
  return (
    // Se mueve a la derecha, se eleva y usa posicionamiento responsive para no interferir con el Footer.
    <a
      href={WHATSAPP_LINK}
      target="_blank"
      rel="noopener noreferrer"
      // bottom-16 es una posición segura para no tapar el footer.
      className="fixed bottom-16 right-6 z-50 w-16 h-16 bg-green-500 rounded-full flex items-center justify-center shadow-lg hover:bg-green-600 transition-all animate-in zoom-in duration-300 delay-500" 
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
  const [selectedExtra, setSelectedExtra] = useState(null); // <-- Estado para el Extra configurable
  const [lastPaymentMethod, setLastPaymentMethod] = useState(null); // <-- Nuevo estado para guardar el método de pago
  const [view, setView] = useState("MENU");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Nuevo estado
  const [isMenuDropdownOpen, setIsMenuDropdownOpen] = useState(false); // Estado para el dropdown de menú
  const menuRef = useRef(null); // Ref para el dropdown

  // --- NUEVOS ESTADOS PARA FILTROS DE PROMOS ESTÁTICAS ---
  const [staticFilter, setStaticFilter] = useState("Todos");
  const staticPromosRef = useRef(null);
  useHorizontalDragScroll(staticPromosRef); // Aplica drag scroll

  const modifiablePromosRef = useRef(null);
  useHorizontalDragScroll(modifiablePromosRef); // Aplica drag scroll

  const extrasRef = useRef(null);
  useHorizontalDragScroll(extrasRef); // Aplica drag scroll
  // --- FIN NUEVOS ESTADOS ---

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

  // --- LÓGICA DE FILTRADO ---
  const filteredStaticPromos = useMemo(() => {
    if (staticFilter === "Todos") return STATIC_PROMOS;
    return STATIC_PROMOS.filter(
      (promo) =>
        promo.rolls.reduce((acc, r) => acc + r.pieces, 0) ===
        parseInt(staticFilter)
    );
  }, [staticFilter]);

  const uniquePieces = useMemo(() => {
    const pieces = STATIC_PROMOS.map((promo) =>
      promo.rolls.reduce((acc, r) => acc + r.pieces, 0)
    );
    return ["Todos", ...new Set(pieces.sort((a, b) => a - b))];
  }, []);
  // --- FIN LÓGICA DE FILTRADO ---

  // --- MODIFIED: handleSimpleAddToCart now checks if it needs to open a modal ---
  const handleSimpleAddToCart = (item) => {
    if (item.type === "CONFIGURABLE") {
      setSelectedExtra(item);
    } else {
      // Logic for non-configurable extras (like Palitos Extra)
      setCartItems([
        ...cartItems,
        { ...item, uuid: Date.now(), totalPrice: item.price, quantity: 1, type: "EXTRA" },
      ]);
      setIsCartOpen(true);
    }
  };

  const handleModalAddToCart = (itemFromModal) => {
    setCartItems([...cartItems, itemFromModal]);
    setSelectedPromo(null);
    setSelectedStaticPromo(null);
    setSelectedExtra(null); // Close Extra modal too
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
    const fecha = now.toLocaleDateString("es-CL", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    const hora = now.toLocaleTimeString("es-CL", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    // --- INICIO DEL MENSAJE ---
    let msg = `*¡NUEVO PEDIDO WEB! - NEO SUSHI* 🍣\n`;
    msg += `${separador}\n`;
    msg += `*Fecha:* ${fecha}\n`;
    msg += `*Hora:* ${hora}\n`;
    msg += `${separador}\n\n`;

    // --- DATOS DEL CLIENTE ---
    msg += `*DATOS DEL CLIENTE*\n`;
    msg += `*Nombre:* ${formData.fullName}\n`;
    // Línea de RUT eliminada
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
      } else if (item.type === "CUSTOM" || item.type === "VEGGIE") {
        // <-- LÓGICA ACTUALIZADA
        msg += `   ➤ Base: ${
          WRAPPERS[item.wrapperKey].name
        }\n      Rellenos: ${item.fillings
          .map((fid) => getFillingById(fid).name)
          .join(", ")}\n`;
      } else {
        // Updated logic for Extras
        const qty = item.quantity || 1;
        const description = item.selectedOption 
          ? `(${item.selectedOption})`
          : item.description.replace('Botellita 50cc.', '').trim();
        
        msg += `   ➤ ${description} (${qty}u)\n`;
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
    } else if (formData.paymentMethod === "pos") {
      msg += `*Tipo:* 💳 Pago con Máquina (Débito/Crédito)\n`;
      msg += `_(El repartidor lleva la máquina)_\n`;
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
    // 1. Guardar el método de pago antes de cambiar la vista
    setLastPaymentMethod(formData.paymentMethod);
    
    // 2. Abrir WhatsApp
    window.open(
      `https://wa.me/${LOCAL_PHONE_NUMBER}?text=${generateWhatsAppMessage(
        formData
      )}`,
      "_blank"
    );
    
    // 3. Cambiar vista y limpiar carrito
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
    <div className="min-h-screen bg-[#EFEEEE] text-gray-900 font-inter flex flex-col">
      {/* --- INICIO: ESTILOS PARA OCULTAR SCROLLBAR --- */}
      <style>
        {`
          .hide-scrollbar {
            -ms-overflow-style: none;  /* IE and Edge */
            scrollbar-width: none;  /* Firefox */
          }
          .hide-scrollbar::-webkit-scrollbar {
            display: none; /* Chrome, Safari and Opera */
          }
          .custom-scrollbar::-webkit-scrollbar {
            width: 8px;
            height: 8px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background-color: #F91250;
            border-radius: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: #e5e7eb;
          }
          /* Nueva animación para pulso suave (RE-ACTIVADA) */
          @keyframes pulse-slow {
              0%, 100% { opacity: 1; transform: scale(1); }
              50% { opacity: 0.85; transform: scale(1.02); } /* Pulso más sutil */
          }
          .animate-pulse-slow {
              animation: pulse-slow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          }
          /* Animación de parpadeo para "¡SÍGUENOS!" */
          @keyframes flash-attention {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.2; }
          }
          .animate-flash-attention {
              animation: flash-attention 1.5s step-end infinite;
          }
        `}
      </style>
      {/* --- FIN: ESTILOS PARA OCULTAR SCROLLBAR --- */}

      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-200 px-4 sm:px-6 py-4">
        <div className="container mx-auto max-w-6xl flex justify-between items-center relative"> {/* <-- Added relative here */}
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setView("MENU")}
          >
            <div className="w-8 h-8 bg-[#F91250] rounded-lg rotate-45 flex items-center justify-center shadow-lg">
              <span className="-rotate-45 font-bold text-white text-xl">N</span>
            </div>
            {/* --- CAMBIO 2: LOGO EN MÓVIL --- */}
            <h1 className="text-xl font-black tracking-wider text-gray-900">
              <span className="text-[#494949]">NEO</span>
              <span className="text-[#F91250]">SUSHI</span>
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
              className="text-gray-600 hover:text-[#494949] transition-colors"
            >
              Inicio
            </a>

            {/* --- INICIO: DROPDOWN DE MENÚ (RESTAURADO) --- */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setIsMenuDropdownOpen(!isMenuDropdownOpen)}
                className="text-gray-600 hover:text-[#494949] transition-colors flex items-center gap-1"
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
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-64 bg-white border border-gray-200 rounded-xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-200">
                  <a
                    href="#menu-estaticas" // Actualizado para el nuevo orden
                    onClick={(e) => {
                      e.preventDefault();
                      setView("MENU");
                      scrollTo("menu-estaticas"); // Actualizado para el nuevo orden
                    }}
                    className="block px-4 py-2 rounded-lg text-sm text-gray-800 hover:bg-[#F91250]/10 hover:text-[#F91250]"
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
                    className="block px-4 py-2 rounded-lg text-sm text-gray-800 hover:bg-[#F91250]/10 hover:text-[#F91250]"
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
                    className="block px-4 py-2 rounded-lg text-sm text-gray-800 hover:bg-[#F91250]/10 hover:text-[#F91250]"
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
                    className="block px-4 py-2 rounded-lg text-sm text-gray-800 hover:bg-[#F91250]/10 hover:text-[#F91250]"
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
                    className="block px-4 py-2 rounded-lg text-sm text-gray-800 hover:bg-[#F91250]/10 hover:text-[#F91250]"
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
              className="text-gray-600 hover:text-[#494949] transition-colors"
            >
              Nosotros
            </a>
          </div>

          <div className="flex items-center gap-3">
            
            {/* --- Nuevo Mensaje Siguenos aquí (Solo Desktop: hidden sm:block) --- */}
            <div className="relative hidden sm:block">
               <FloatingFollowUs /> 
            </div>
            
            <a
              href="https://www.instagram.com/appneosushi"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-gray-600 hover:text-[#F91250] transition-colors hidden sm:block"
            >
              <Instagram size={20} />
            </a>
            <a
              href="https://www.facebook.com/neosushiapp"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-gray-600 hover:text-blue-600 transition-colors hidden sm:block"
            >
              <Facebook size={20} />
            </a>

            {view === "MENU" && (
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-3 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all flex items-center gap-3 shadow-sm"
              >
                <ShoppingCart className="text-[#494949]" size={22} />
                {cartItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#F91250] text-white text-[10px] font-bold h-5 min-w-[20px] px-1 flex items-center justify-center rounded-full">
                    {cartItems.length}
                  </span>
                )}
                <span className="text-sm font-bold text-[#F91250]">
                  {formatPrice(cartTotal)}
                </span>
              </button>
            )}
             {/* El FloatingFollowUs ya está posicionado absolutamente en el nav */}

            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 bg-gray-100 rounded-xl text-gray-600 hover:text-[#494949] md:hidden"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </nav>

      {/* --- INICIO: Modal Menú Móvil (CORREGIDO) --- */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[100] bg-white md:hidden animate-in fade-in duration-300">
          <div className="flex justify-end p-4">
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 bg-gray-100 rounded-full text-gray-600 hover:bg-gray-200"
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
              className="text-2xl font-bold text-gray-900 hover:text-[#F91250]"
            >
              Inicio
            </a>

            {/* --- INICIO: ENLACES DE MENÚ MÓVIL (CORREGIDO) --- */}
            <div className="flex flex-col items-center gap-8">
              <a
                href="#menu-estaticas" // Actualizado para el nuevo orden
                onClick={(e) => {
                  e.preventDefault();
                  setView("MENU");
                  scrollTo("menu-estaticas"); // Actualizado para el nuevo orden
                }}
                className="text-2xl font-bold text-gray-900 hover:text-[#F91250]"
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
                className="text-2xl font-bold text-gray-900 hover:text-[#F91250]"
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
                className="text-2xl font-bold text-gray-900 hover:text-[#F91250]"
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
                className="text-2xl font-bold text-gray-900 hover:text-[#F91250]"
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
                className="text-2xl font-bold text-gray-900 hover:text-[#F91250]"
              >
                Bebidas y Otros
              </a>
            </div>
            {/* --- FIN: ENLACES DE MENÚ MÓVIL --- */}
            
            {/* INCLUIDO EN EL MENÚ MÓVIL (Versión centrada y grande) */}
            <div className="mt-8">
              {/* CAMBIO 1: Posicionado debajo de Nosotros en el modal móvil */}
              <a
                href="#nosotros"
                onClick={(e) => {
                  e.preventDefault();
                  setView("MENU");
                  scrollTo("nosotros");
                  setIsMobileMenuOpen(false);
                }}
                className="text-2xl font-bold text-gray-900 hover:text-[#F91250] mb-8 block"
              >
                Nosotros
              </a>
              <div className="mb-8"> {/* Agregamos margen inferior para separación */}
                <FloatingFollowUs isMobile={true} />
              </div>
            </div>

            <div className="flex gap-6 mt-8">
              <a
                href="https://www.instagram.com/appneosushi"
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 bg-gray-100 rounded-full text-gray-600 hover:text-[#F91250]"
              >
                <Instagram size={32} />
              </a>
              <a
                href="https://www.facebook.com/neosushiapp"
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 bg-gray-100 rounded-full text-gray-600 hover:text-blue-600"
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

            {/* --- ORDEN DE SECCIONES --- */}
            <section
              id="menu"
              className="container mx-auto max-w-6xl px-4 sm:px-6 py-20"
            >
              <h2
                id="menu-estaticas"
                className="text-3xl font-black text-gray-900 mb-4 border-l-4 border-[#F91250] pl-4"
              >
                Promociones Estáticas
              </h2>
              <p className="text-gray-600 text-sm mb-4 max-w-2xl pl-5">
                Promociones con rolls fijos a un precio especial. No se pueden
                modificar.
              </p>

              {/* --- FILTROS DE PIEZAS --- */}
              <div className="flex flex-wrap gap-2 mb-8 pl-5">
                {uniquePieces.map((pieces) => (
                  <button
                    key={pieces}
                    onClick={() => setStaticFilter(pieces.toString())}
                    className={`px-4 py-2 rounded-full text-sm font-semibold transition-all shadow-sm ${
                      staticFilter === pieces.toString()
                        ? "bg-[#F91250] text-white"
                        : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-100"
                    }`}
                  >
                    {pieces === "Todos" ? "Todas" : `${pieces}p`}
                  </button>
                ))}
              </div>
              {/* --- FIN FILTROS DE PIEZAS --- */}

              {/* --- INICIO CARRUSEL ESTATICO (ENVUELTO EN RELATIVE) --- */}
              <div className="relative">
                <div
                  ref={staticPromosRef}
                  className="flex overflow-x-auto space-x-6 mb-16 pb-4 hide-scrollbar cursor-grab active:cursor-grabbing"
                >
                  {filteredStaticPromos.map((promo) => (
                    <div
                      key={promo.id}
                      className="bg-white border border-gray-200 rounded-3xl overflow-hidden hover:border-[#F91250]/50 transition-all flex flex-col group shadow-md w-80 md:w-96 flex-shrink-0"
                    >
                      <div className="h-48 overflow-hidden relative">
                        <div className="absolute inset-0 bg-gradient-to-t from-white/90 to-transparent z-10" />
                        <img
                          src={promo.image}
                          alt={promo.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src =
                              "https://placehold.co/800x400/eeeeee/494949?text=Sin+Imagen";
                          }}
                        />
                        <div className="absolute bottom-0 left-0 p-4 z-20">
                          <span className="px-3 py-1 rounded-full bg-[#F91250] text-white text-xs font-bold backdrop-blur-md">
                            {promo.rolls.reduce((acc, r) => acc + r.pieces, 0)}{" "}
                            Piezas
                          </span>
                        </div>
                      </div>
                      <div className="p-5 flex flex-col grow">
                        <h4 className="text-xl font-bold text-gray-900 mb-2">
                          {promo.name}
                        </h4>
                        <p className="text-gray-600 text-sm mb-4 grow">
                          {promo.description}
                        </p>
                        <div className="flex justify-between items-end">
                          <div>
                            <p className="text-xs text-gray-500 uppercase">
                              Precio
                            </p>
                            <p className="text-2xl font-bold text-[#494949]">
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
                {/* INDICADOR DE SCROLL AÑADIDO */}
                <HorizontalScrollIndicator
                  targetRef={staticPromosRef}
                  id="static"
                  color="primary"
                />
              </div>
              {/* --- FIN CARRUSEL ESTATICO --- */}

              <h2
                id="menu-modificables"
                className="text-3xl font-black text-gray-900 mb-4 border-l-4 border-[#494949] pl-4"
              >
                Promociones Modificables
              </h2>
              <p className="text-gray-600 text-sm mb-8 max-w-2xl pl-5">
                Aquí puedes cambiar los ingredientes de cada roll. (Cualquier
                cambio tiene un costo extra).
              </p>
              {/* --- INICIO CARRUSEL MODIFICABLE (ENVUELTO EN RELATIVE) --- */}
              <div className="relative">
                <div
                  ref={modifiablePromosRef}
                  className="flex overflow-x-auto space-x-6 mb-16 pb-4 hide-scrollbar cursor-grab active:cursor-grabbing"
                >
                  {MODIFIABLE_PROMOS.map((promo) => (
                    <div
                      key={promo.id}
                      className="bg-white border border-gray-200 rounded-3xl overflow-hidden hover:border-[#F91250]/50 transition-all flex flex-col group shadow-md w-80 md:w-96 flex-shrink-0"
                    >
                      <div className="h-48 overflow-hidden relative">
                        <div className="absolute inset-0 bg-gradient-to-t from-white/90 to-transparent z-10" />
                        <img
                          src={promo.image}
                          alt={promo.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src =
                              "https://placehold.co/800x400/eeeeee/494949?text=Sin+Imagen";
                          }}
                        />
                        <div className="absolute bottom-0 left-0 p-4 z-20">
                          <span className="px-3 py-1 rounded-full bg-[#F91250] text-white text-xs font-bold backdrop-blur-md">
                            {promo.rolls.reduce((acc, r) => acc + r.pieces, 0)}{" "}
                            Piezas
                          </span>
                        </div>
                      </div>
                      <div className="p-5 flex flex-col grow">
                        <h4 className="text-xl font-bold text-gray-900 mb-2">
                          {promo.name}
                        </h4>
                        <p className="text-gray-600 text-sm mb-4 grow">
                          {promo.description}
                        </p>
                        <div className="flex justify-between items-end">
                          <div>
                            <p className="text-xs text-gray-500 uppercase">
                              Base
                            </p>
                            <p className="text-2xl font-bold text-[#494949]">
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
                {/* INDICADOR DE SCROLL AÑADIDO */}
                <HorizontalScrollIndicator
                  targetRef={modifiablePromosRef}
                  id="modifiable"
                  color="secondary"
                />
              </div>
              {/* --- FIN CARRUSEL MODIFICABLE --- */}

              <h2
                id="neolab"
                className="text-3xl font-black text-gray-900 mb-4 border-l-4 border-[#F91250] pl-4"
              >
                Crea tu Roll (Neo-Lab)
              </h2>
              <p className="text-gray-600 text-sm mb-8 max-w-2xl pl-5">
                ¿No encuentras tu roll perfecto? Diséñalo aquí con cualquier
                ingrediente.
              </p>
              <div
                // ESTILO ORIGINAL SIN HOVER:
                className="bg-white border border-[#F91250]/20 rounded-[3rem] shadow-lg p-8 sm:p-12 flex flex-col sm:flex-row items-center justify-between gap-8 mb-16"
              >
                <div className="relative z-10">
                  <h3 className="text-3xl font-black text-gray-900 mb-4 flex items-center gap-3">
                    {/* ICONO CON ANIMACIÓN CONSTANTE (CORREGIDO className) */}
                    <Zap className="text-[#F91250] animate-pulse-slow shrink-0" size={28} /> Laboratorio
                  </h3>
                  <p className="text-gray-700 max-w-md">
                    Diseña un roll único de 10 piezas desde cero. Elige
                    envoltura y 3 rellenos (Básico, Medio y Especial).
                  </p>
                </div>
                <GlowingButton
                  variant="primary"
                  className="min-w-[200px]"
                  onClick={() => setIsNeoLabOpen(true)}
                >
                  Entrar al Lab
                </GlowingButton>
              </div>

              {/* --- INICIO: NUEVA SECCIÓN VEGETARIANA --- */}
              <h2
                id="veggielab"
                className="text-3xl font-black text-gray-900 mb-4 border-l-4 border-green-600 pl-4" // Borde Verde
              >
                Roll Vegetariano
              </h2>
              <p className="text-gray-600 text-sm mb-8 max-w-2xl pl-5">
                Crea tu roll perfecto usando solo ingredientes de nuestra
                selección vegetariana.
              </p>
              <div
                // Color de borde más sutil y sin hover
                className="bg-white border border-green-300/50 rounded-[3rem] shadow-lg p-8 sm:p-12 flex flex-col sm:flex-row items-center justify-between gap-8 mb-16"
              >
                <div className="relative z-10">
                  <h3 className="text-3xl font-black text-gray-900 mb-4 flex items-center gap-3">
                    {/* ICONO DE HOJA CON ANIMACIÓN CONSTANTE (CORREGIDO className) */}
                    <Leaf className="text-green-600 animate-pulse-slow shrink-0" size={28} /> Sección Vegetariana
                  </h3>
                  <p className="text-gray-700 max-w-md">
                    Diseña un roll veggie de 10 piezas. Elige tu envoltura y 3
                    ingredientes de la lista vegetariana.
                  </p>
                </div>
                <GlowingButton
                  variant="secondary" // Botón Gris
                  className="min-w-[200px]"
                  onClick={() => setIsVeggieLabOpen(true)}
                >
                  Crear Roll Veggie
                </GlowingButton>
              </div>
              {/* --- FIN: NUEVA SECCIÓN VEGETARIANA --- */}

              <h2
                id="menu-bebidas"
                className="text-3xl font-black text-gray-900 mb-4 border-l-4 border-[#F91250] pl-4"
              >
                Bebidas y Otros
              </h2>
              <p className="text-gray-600 text-sm mb-8 max-w-2xl pl-5">
                ¡No te olvides de la bebida o un extra!
              </p>
              {/* --- INICIO CARRUSEL EXTRAS (ENVUELTO EN RELATIVE) --- */}
              <div className="relative">
                <div
                  ref={extrasRef}
                  className="flex overflow-x-auto space-x-6 mb-16 pb-4 hide-scrollbar cursor-grab active:cursor-grabbing"
                >
                  {EXTRAS.map((extra) => (
                    <div
                      key={extra.id}
                      className="bg-white border border-gray-200 rounded-3xl overflow-hidden flex flex-col group hover:border-gray-300 transition-all shadow-md w-72 flex-shrink-0"
                    >
                      <div className="h-32 overflow-hidden relative">
                        <img
                          src={extra.image}
                          alt={extra.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src =
                              "https://placehold.co/800x400/eeeeee/494949?text=Sin+Imagen";
                          }}
                        />
                      </div>
                      <div className="p-5 flex flex-col justify-between grow">
                        <div>
                          <h4 className="text-lg font-bold text-gray-900 mb-1">
                            {extra.name}
                          </h4>
                          <p className="text-gray-600 text-xs mb-4">
                            {extra.description}
                          </p>
                        </div>
                        <div className="flex justify-between items-end">
                          <p className="text-xl font-bold text-[#494949]">
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
                {/* INDICADOR DE SCROLL AÑADIDO */}
                <HorizontalScrollIndicator
                  targetRef={extrasRef}
                  id="extras"
                  color="primary"
                />
              </div>
              {/* --- FIN CARRUSEL EXTRAS --- */}
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
          <ThankYouView onReset={() => setView("MENU")} paymentMethod={lastPaymentMethod} />
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

          {/* --- RENDERIZADO MODAL EXTRA CONFIGURABLE --- */}
          {selectedExtra && (
            <ExtraConfigModal
              extra={selectedExtra}
              onClose={() => setSelectedExtra(null)}
              onAddToCart={handleModalAddToCart}
            />
          )}
          {/* --- FIN RENDERIZADO MODAL EXTRA CONFIGURABLE --- */}


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