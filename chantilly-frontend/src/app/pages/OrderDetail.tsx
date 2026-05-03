import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router";
import { ArrowLeft, Check, Clock, ChefHat, Package, Truck, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { BtnPrimary, StatusBadge, toUiStatus } from "../components/shared";
import { pedidoService, PedidoApi } from "../../services/pedidoService";

const TIMELINE = [
  { status: "PENDIENTE", icon: Clock, label: "Pedido recibido" },
  { status: "EN_PREPARACION", icon: ChefHat, label: "En preparación" },
  { status: "LISTO", icon: Package, label: "Listo para envío" },
  { status: "EN_RUTA", icon: Truck, label: "En camino" },
  { status: "ENTREGADO", icon: CheckCircle, label: "Entregado" },
];

const STATUS_ORDER = ["PENDIENTE", "EN_PREPARACION", "LISTO", "EN_RUTA", "ENTREGADO"];

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState<PedidoApi | null>(null);

  const loadOrder = async () => {
    if (!id) return;
    try {
      const response = await pedidoService.getById(id);
      setOrder(response.data);
    } catch (error) {
      console.error("Error cargando pedido", error);
    }
  };

  useEffect(() => {
    loadOrder();
  }, [id]);

  const currentIdx = useMemo(() => STATUS_ORDER.indexOf(order?.estado || ""), [order]);

  const handleCancelar = async () => {
    if (!id) return;
    try {
      await pedidoService.cancelar(id);
      await loadOrder();
    } catch (error) {
      console.error("Error cancelando pedido", error);
      alert("No se pudo cancelar el pedido");
    }
  };

  if (!order) return (
    <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center" style={{ fontFamily: "Poppins" }}>
      <div className="text-center">
        <h1 className="text-[#333] mb-4" style={{ fontWeight: 700, fontSize: 24 }}>Pedido no encontrado</h1>
        <Link to="/mis-pedidos"><BtnPrimary>Ver Mis Pedidos</BtnPrimary></Link>
      </div>
    </div>
  );

  const isCancelled = order.estado === "CANCELADO";

  return (
    <div className="min-h-screen bg-[#F5F5F5] py-8 px-4" style={{ fontFamily: "Poppins" }}>
      <div className="max-w-3xl mx-auto">
        <Link to="/mis-pedidos" className="inline-flex items-center gap-2 text-[#D32F2F] hover:underline mb-6" style={{ fontSize: 14, fontWeight: 600 }}>
          <ArrowLeft className="w-4 h-4" /> Volver a mis pedidos
        </Link>

        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <h1 className="text-[#333]" style={{ fontWeight: 700, fontSize: 24 }}>{order.codigoPedido || `Pedido #${order.id}`}</h1>
              <p className="text-gray-500" style={{ fontSize: 14 }}>Fecha: {order.creadoEn?.slice(0, 10)}</p>
            </div>
            <StatusBadge status={toUiStatus(order.estado)} />
          </div>

          {!isCancelled ? (
            <div className="mb-8">
              <h2 className="text-[#333] mb-4" style={{ fontWeight: 700 }}>Seguimiento</h2>
              <div className="relative">
                {TIMELINE.map((step, i) => {
                  const done = i <= currentIdx;
                  return (
                    <div key={step.status} className="flex items-start gap-4 mb-6 last:mb-0">
                      <div className="relative flex flex-col items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center z-10 ${done ? "bg-[#4CAF50]" : "bg-gray-200"}`}>
                          {done ? <Check className="w-5 h-5 text-white" /> : <step.icon className="w-5 h-5 text-gray-400" />}
                        </div>
                        {i < TIMELINE.length - 1 && <div className={`absolute top-10 w-0.5 h-6 ${i < currentIdx ? "bg-[#4CAF50]" : "bg-gray-200"}`} />}
                      </div>
                      <div>
                        <p className={done ? "text-[#333]" : "text-gray-400"} style={{ fontWeight: 600 }}>{step.label}</p>
                        <p className="text-gray-400" style={{ fontSize: 13 }}>{done ? "Completado" : "Pendiente"}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 bg-red-50 p-4 rounded-lg mb-6">
              <XCircle className="w-6 h-6 text-[#D32F2F]" />
              <p className="text-[#D32F2F]" style={{ fontWeight: 600 }}>Este pedido fue cancelado</p>
            </div>
          )}

          <h2 className="text-[#333] mb-3" style={{ fontWeight: 700 }}>Productos</h2>
          <div className="space-y-2 mb-4">
            {order.items?.map((item) => (
              <div key={item.id} className="flex justify-between p-3 bg-[#F5F5F5] rounded-lg" style={{ fontSize: 14 }}>
                <span>{item.nombreProducto} <span className="text-gray-400">x{item.cantidad}</span></span>
                <span style={{ fontWeight: 600 }}>S/ {Number(item.subtotal || 0).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="border-t pt-3 flex justify-between items-center">
            <span className="text-[#333]" style={{ fontWeight: 700 }}>Total</span>
            <span className="text-[#D32F2F]" style={{ fontWeight: 700, fontSize: 22 }}>S/ {Number(order.total || 0).toFixed(2)}</span>
          </div>

          {order.estado === "PENDIENTE" && (
            <BtnPrimary className="mt-4" onClick={handleCancelar}>Cancelar pedido</BtnPrimary>
          )}
        </div>

        {order.estado === "ENTREGADO" && (
          <Link to="/reclamo" className="inline-flex items-center gap-2 text-[#D32F2F] hover:underline" style={{ fontSize: 14 }}>
            <AlertTriangle className="w-4 h-4" /> ¿Problema con tu pedido? Presenta un reclamo
          </Link>
        )}
      </div>
    </div>
  );
}

