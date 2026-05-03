import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";
import { CheckCircle, Package } from "lucide-react";
import { BtnPrimary, BtnSecondary, StatusBadge, toUiStatus } from "../components/shared";
import { pedidoService, PedidoApi } from "../../services/pedidoService";

export default function Confirmation() {
  const location = useLocation();
  const pedidoId = location.state?.pedidoId as number | undefined;
  const [pedido, setPedido] = useState<PedidoApi | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!pedidoId) return;
      try {
        const response = await pedidoService.getById(pedidoId);
        setPedido(response.data);
      } catch (error) {
        console.error("Error cargando pedido", error);
      }
    };
    load();
  }, [pedidoId]);

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center px-4 py-10" style={{ fontFamily: "Poppins" }}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-8 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-10 h-10 text-[#4CAF50]" />
        </div>
        <h1 className="text-[#333] mb-2" style={{ fontWeight: 700, fontSize: 24 }}>Pedido Confirmado</h1>
        <p className="text-gray-500 mb-6" style={{ fontSize: 14 }}>Tu pedido ha sido registrado exitosamente</p>

        {pedido && (
          <div className="bg-[#F5F5F5] rounded-xl p-6 mb-6 text-left">
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-500" style={{ fontSize: 14 }}>Número de orden:</span>
              <span className="text-[#333]" style={{ fontWeight: 700 }}>{pedido.codigoPedido}</span>
            </div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-500" style={{ fontSize: 14 }}>Fecha:</span>
              <span className="text-[#333]" style={{ fontWeight: 600, fontSize: 14 }}>{pedido.creadoEn?.slice(0, 10)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500" style={{ fontSize: 14 }}>Estado:</span>
              <StatusBadge status={toUiStatus(pedido.estado)} />
            </div>
          </div>
        )}

        <div className="flex items-center gap-2 bg-yellow-50 p-4 rounded-lg mb-6 text-left">
          <Package className="w-5 h-5 text-[#F5C518] shrink-0" />
          <p className="text-[#333]" style={{ fontSize: 13 }}>Te notificaremos cuando tu pedido cambie de estado.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link to="/mis-pedidos" className="flex-1"><BtnPrimary className="w-full">Ver Mis Pedidos</BtnPrimary></Link>
          <Link to="/catalogo" className="flex-1"><BtnSecondary className="w-full">Seguir Comprando</BtnSecondary></Link>
        </div>
      </div>
    </div>
  );
}

