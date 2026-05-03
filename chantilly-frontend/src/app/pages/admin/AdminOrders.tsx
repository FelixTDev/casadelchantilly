import React, { useEffect, useMemo, useState } from "react";
import { StatusBadge, toUiStatus } from "../../components/shared";
import { pedidoService, PedidoApi } from "../../../services/pedidoService";

const ALL_STATUSES = ["PENDIENTE", "EN_PREPARACION", "LISTO", "EN_RUTA", "ENTREGADO", "CANCELADO", "RECHAZADO"];

export default function AdminOrders() {
  const [orders, setOrders] = useState<PedidoApi[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>("");

  const loadOrders = async () => {
    try {
      const response = await pedidoService.getTodos();
      setOrders(response.data);
    } catch (error) {
      console.error("Error cargando pedidos admin", error);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const filtered = useMemo(() => orders.filter(o => !filterStatus || o.estado === filterStatus), [orders, filterStatus]);

  const changeStatus = async (id: number, newStatus: string) => {
    try {
      await pedidoService.cambiarEstado(id, newStatus);
      await loadOrders();
    } catch (error) {
      console.error("Error cambiando estado", error);
      alert("No se pudo cambiar estado");
    }
  };

  return (
    <div style={{ fontFamily: "Poppins" }}>
      <div className="flex flex-wrap gap-2 mb-6">
        <button onClick={() => setFilterStatus("")}
          className={`px-4 py-2 rounded-full transition ${!filterStatus ? "bg-[#D32F2F] text-white" : "bg-white text-[#333] border border-gray-200"}`}
          style={{ fontSize: 13, fontWeight: 600 }}>Todos</button>
        {ALL_STATUSES.map(s => (
          <button key={s} onClick={() => setFilterStatus(filterStatus === s ? "" : s)}
            className={`px-4 py-2 rounded-full transition border ${filterStatus === s ? "bg-red-50 border-[#D32F2F]" : "bg-white border-gray-200"}`}
            style={{ fontSize: 13, fontWeight: 600, color: filterStatus === s ? "#D32F2F" : "#333" }}>
            {s}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full" style={{ fontSize: 14 }}>
            <thead className="bg-[#F5F5F5]">
              <tr>
                <th className="text-left py-3 px-4 text-gray-500" style={{ fontWeight: 600 }}>Orden</th>
                <th className="text-left py-3 px-4 text-gray-500 hidden sm:table-cell" style={{ fontWeight: 600 }}>Fecha</th>
                <th className="text-left py-3 px-4 text-gray-500" style={{ fontWeight: 600 }}>Total</th>
                <th className="text-left py-3 px-4 text-gray-500" style={{ fontWeight: 600 }}>Estado</th>
                <th className="text-left py-3 px-4 text-gray-500" style={{ fontWeight: 600 }}>Acción</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(o => (
                <tr key={o.id} className="border-t hover:bg-gray-50">
                  <td className="py-3 px-4" style={{ fontWeight: 600 }}>{o.codigoPedido}</td>
                  <td className="py-3 px-4 text-gray-500 hidden sm:table-cell">{o.creadoEn?.slice(0, 10)}</td>
                  <td className="py-3 px-4 text-[#D32F2F]" style={{ fontWeight: 600 }}>S/ {Number(o.total || 0).toFixed(2)}</td>
                  <td className="py-3 px-4"><StatusBadge status={toUiStatus(o.estado)} /></td>
                  <td className="py-3 px-4">
                    <select value={o.estado} onChange={e => changeStatus(o.id, e.target.value)}
                      className="border border-gray-200 rounded-lg px-2 py-1.5 bg-white focus:border-[#D32F2F] focus:outline-none" style={{ fontSize: 13 }}>
                      {ALL_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

