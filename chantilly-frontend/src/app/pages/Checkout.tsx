import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { MapPin, CreditCard, Calendar, Truck } from "lucide-react";
import { BtnPrimary } from "../components/shared";
import { useApp } from "../context/AppContext";
import { usuarioService, DireccionApi } from "../../services/usuarioService";
import { pedidoService } from "../../services/pedidoService";
import { pagoService } from "../../services/pagoService";

const PAYMENT_OPTIONS = [
  { value: "EFECTIVO", label: "Efectivo" },
  { value: "YAPE", label: "Yape" },
  { value: "PLIN", label: "Plin" },
  { value: "TRANSFERENCIA", label: "Transferencia Bancaria" },
];

export default function Checkout() {
  const { cart, clearCart } = useApp();
  const navigate = useNavigate();

  const [direcciones, setDirecciones] = useState<DireccionApi[]>([]);
  const [modalidad, setModalidad] = useState<"DELIVERY" | "RECOJO_TIENDA">("DELIVERY");
  const [direccionId, setDireccionId] = useState<number | null>(null);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [payment, setPayment] = useState("EFECTIVO");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadDirecciones = async () => {
      try {
        const response = await usuarioService.getDirecciones();
        setDirecciones(response.data);
        if (response.data.length > 0) {
          setDireccionId(response.data[0].id || null);
        }
      } catch (error) {
        console.error("Error cargando direcciones", error);
      }
    };
    loadDirecciones();
  }, []);

  const subtotal = useMemo(() => cart.reduce((s, i) => s + i.price * i.quantity, 0), [cart]);
  const delivery = modalidad === "DELIVERY" ? 5 : 0;
  const total = subtotal + delivery;

  const handleOrder = async () => {
    try {
      setLoading(true);
      const pedidoRes = await pedidoService.crear({
        modalidadEntrega: modalidad,
        idDireccion: modalidad === "DELIVERY" ? direccionId : null,
        fechaEntrega: date,
        horaEntrega: null,
        notasCliente: "",
      });

      await pagoService.registrar(pedidoRes.data.id, {
        metodoPago: payment,
      });

      await clearCart();
      navigate("/confirmacion", { state: { pedidoId: pedidoRes.data.id } });
    } catch (error) {
      console.error("Error creando pedido", error);
      const msg = (error as any)?.response?.data?.mensaje || "No se pudo confirmar el pedido";
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) return (
    <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center" style={{ fontFamily: "Poppins" }}>
      <div className="text-center">
        <h1 className="text-[#333] mb-4" style={{ fontWeight: 700, fontSize: 24 }}>Tu carrito está vacío</h1>
        <BtnPrimary onClick={() => navigate("/catalogo")}>Ir al Catálogo</BtnPrimary>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F5F5F5] py-8 px-4" style={{ fontFamily: "Poppins" }}>
      <div className="max-w-5xl mx-auto">
        <h1 className="text-[#333] mb-6" style={{ fontWeight: 700, fontSize: 28 }}>Finalizar Compra</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-5 h-5 text-[#D32F2F]" />
                <h2 className="text-[#333]" style={{ fontWeight: 700 }}>Entrega</h2>
              </div>
              <div className="space-y-3">
                <label className="flex items-center gap-2">
                  <input type="radio" checked={modalidad === "DELIVERY"} onChange={() => setModalidad("DELIVERY")} /> Delivery
                </label>
                <label className="flex items-center gap-2">
                  <input type="radio" checked={modalidad === "RECOJO_TIENDA"} onChange={() => setModalidad("RECOJO_TIENDA")} /> Recojo en tienda
                </label>
              </div>

              {modalidad === "DELIVERY" && (
                <select
                  value={direccionId ?? ""}
                  onChange={e => setDireccionId(Number(e.target.value))}
                  className="w-full mt-4 border border-gray-300 rounded-lg px-4 py-3 bg-[#F5F5F5] focus:border-[#D32F2F] focus:outline-none"
                >
                  {direcciones.map(d => <option key={d.id} value={d.id}>{d.etiqueta} - {d.direccion}</option>)}
                </select>
              )}
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-5 h-5 text-[#D32F2F]" />
                <h2 className="text-[#333]" style={{ fontWeight: 700 }}>Fecha de Entrega</h2>
              </div>
              <input type="date" value={date} onChange={e => setDate(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-[#F5F5F5] focus:border-[#D32F2F] focus:outline-none" />
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center gap-2 mb-4">
                <CreditCard className="w-5 h-5 text-[#D32F2F]" />
                <h2 className="text-[#333]" style={{ fontWeight: 700 }}>Método de Pago</h2>
              </div>
              <div className="space-y-3">
                {PAYMENT_OPTIONS.map(m => (
                  <label key={m.value} className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer border transition ${payment === m.value ? "border-[#D32F2F] bg-red-50" : "border-gray-200"}`}>
                    <input type="radio" name="payment" value={m.value} checked={payment === m.value} onChange={() => setPayment(m.value)} className="accent-[#D32F2F]" />
                    <span className="text-[#333]" style={{ fontSize: 14, fontWeight: payment === m.value ? 600 : 400 }}>{m.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 h-fit sticky top-20">
            <h2 className="text-[#333] mb-4 pb-4 border-b" style={{ fontWeight: 700 }}>Resumen del Pedido</h2>
            <div className="space-y-3 mb-4">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between" style={{ fontSize: 14 }}>
                  <span className="text-gray-600">{item.name} x{item.quantity}</span>
                  <span className="text-[#333]" style={{ fontWeight: 600 }}>S/ {(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="border-t pt-3 space-y-2" style={{ fontSize: 14 }}>
              <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span>S/ {subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between">
                <span className="text-gray-500 flex items-center gap-1"><Truck className="w-4 h-4" /> Delivery</span>
                <span>{`S/ ${delivery.toFixed(2)}`}</span>
              </div>
            </div>
            <div className="border-t mt-3 pt-3 flex justify-between">
              <span className="text-[#333]" style={{ fontWeight: 700, fontSize: 18 }}>Total</span>
              <span className="text-[#D32F2F]" style={{ fontWeight: 700, fontSize: 22 }}>S/ {total.toFixed(2)}</span>
            </div>
            <BtnPrimary className="w-full mt-6" onClick={handleOrder} disabled={loading || (modalidad === "DELIVERY" && !direccionId)}>
              {loading ? "Procesando..." : "Confirmar Pedido"}
            </BtnPrimary>
          </div>
        </div>
      </div>
    </div>
  );
}




