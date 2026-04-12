import React from "react";
import { useParams, Link } from "react-router";
import { ArrowLeft, Check, Clock, ChefHat, Package, Truck, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { BtnPrimary, BtnSecondary, StatusBadge } from "../components/shared";
import { ORDERS, OrderStatus } from "../data/mock-data";

const TIMELINE: { status: OrderStatus; icon: React.ElementType; label: string }[] = [
  { status: "Pendiente", icon: Clock, label: "Pedido recibido" },
  { status: "En preparación", icon: ChefHat, label: "En preparación" },
  { status: "Listo", icon: Package, label: "Listo para envío" },
  { status: "En ruta", icon: Truck, label: "En camino" },
  { status: "Entregado", icon: CheckCircle, label: "Entregado" },
];

const STATUS_ORDER = ["Pendiente", "En preparación", "Listo", "En ruta", "Entregado"];

export default function OrderDetail() {
  const { id } = useParams();
  const order = ORDERS.find(o => o.id === id);

  if (!order) return (
    <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center" style={{ fontFamily: "Poppins" }}>
      <div className="text-center">
        <h1 className="text-[#333] mb-4" style={{ fontWeight: 700, fontSize: 24 }}>Pedido no encontrado</h1>
        <Link to="/mis-pedidos"><BtnPrimary>Ver Mis Pedidos</BtnPrimary></Link>
      </div>
    </div>
  );

  const currentIdx = STATUS_ORDER.indexOf(order.status);
  const isCancelled = order.status === "Cancelado";

  return (
    <div className="min-h-screen bg-[#F5F5F5] py-8 px-4" style={{ fontFamily: "Poppins" }}>
      <div className="max-w-3xl mx-auto">
        <Link to="/mis-pedidos" className="inline-flex items-center gap-2 text-[#D32F2F] hover:underline mb-6" style={{ fontSize: 14, fontWeight: 600 }}>
          <ArrowLeft className="w-4 h-4" /> Volver a mis pedidos
        </Link>

        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <h1 className="text-[#333]" style={{ fontWeight: 700, fontSize: 24 }}>{order.id}</h1>
              <p className="text-gray-500" style={{ fontSize: 14 }}>Fecha: {order.date}</p>
            </div>
            <StatusBadge status={order.status} />
          </div>

          {/* Timeline */}
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

          {/* Items */}
          <h2 className="text-[#333] mb-3" style={{ fontWeight: 700 }}>Productos</h2>
          <div className="space-y-2 mb-4">
            {order.items.map((item, i) => (
              <div key={i} className="flex justify-between p-3 bg-[#F5F5F5] rounded-lg" style={{ fontSize: 14 }}>
                <span>{item.name} <span className="text-gray-400">x{item.qty}</span></span>
                <span style={{ fontWeight: 600 }}>S/ {(item.price * item.qty).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="border-t pt-3 flex justify-between items-center">
            <span className="text-[#333]" style={{ fontWeight: 700 }}>Total</span>
            <span className="text-[#D32F2F]" style={{ fontWeight: 700, fontSize: 22 }}>S/ {order.total.toFixed(2)}</span>
          </div>

          <p className="text-gray-500 mt-4" style={{ fontSize: 13 }}>📍 {order.address}</p>
        </div>

        {!isCancelled && order.status === "Entregado" && (
          <Link to="/reclamo" className="inline-flex items-center gap-2 text-[#D32F2F] hover:underline" style={{ fontSize: 14 }}>
            <AlertTriangle className="w-4 h-4" /> ¿Problema con tu pedido? Presenta un reclamo
          </Link>
        )}
      </div>
    </div>
  );
}
