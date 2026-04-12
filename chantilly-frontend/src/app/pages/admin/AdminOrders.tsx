import React, { useState } from "react";
import { StatusBadge } from "../../components/shared";
import { ORDERS, Order, OrderStatus, STATUS_COLORS } from "../../data/mock-data";

const ALL_STATUSES: OrderStatus[] = ["Pendiente", "En preparación", "Listo", "En ruta", "Entregado", "Cancelado"];

export default function AdminOrders() {
  const [orders, setOrders] = useState(ORDERS);
  const [filterStatus, setFilterStatus] = useState<string>("");

  const filtered = orders.filter(o => !filterStatus || o.status === filterStatus);

  const changeStatus = (id: string, newStatus: OrderStatus) => {
    setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
  };

  return (
    <div style={{ fontFamily: "Poppins" }}>
      <div className="flex flex-wrap gap-2 mb-6">
        <button onClick={() => setFilterStatus("")}
          className={`px-4 py-2 rounded-full transition ${!filterStatus ? "bg-[#D32F2F] text-white" : "bg-white text-[#333] border border-gray-200"}`}
          style={{ fontSize: 13, fontWeight: 600 }}>Todos</button>
        {ALL_STATUSES.map(s => (
          <button key={s} onClick={() => setFilterStatus(filterStatus === s ? "" : s)}
            className={`px-4 py-2 rounded-full transition border`}
            style={{ fontSize: 13, fontWeight: 600, backgroundColor: filterStatus === s ? STATUS_COLORS[s].bg : "white", color: filterStatus === s ? STATUS_COLORS[s].text : "#333", borderColor: filterStatus === s ? STATUS_COLORS[s].bg : "#e5e7eb" }}>
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
                <th className="text-left py-3 px-4 text-gray-500 hidden md:table-cell" style={{ fontWeight: 600 }}>Dirección</th>
                <th className="text-left py-3 px-4 text-gray-500" style={{ fontWeight: 600 }}>Total</th>
                <th className="text-left py-3 px-4 text-gray-500" style={{ fontWeight: 600 }}>Estado</th>
                <th className="text-left py-3 px-4 text-gray-500" style={{ fontWeight: 600 }}>Acción</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(o => (
                <tr key={o.id} className="border-t hover:bg-gray-50">
                  <td className="py-3 px-4" style={{ fontWeight: 600 }}>{o.id}</td>
                  <td className="py-3 px-4 text-gray-500 hidden sm:table-cell">{o.date}</td>
                  <td className="py-3 px-4 text-gray-500 hidden md:table-cell" style={{ fontSize: 13 }}>{o.address}</td>
                  <td className="py-3 px-4 text-[#D32F2F]" style={{ fontWeight: 600 }}>S/ {o.total.toFixed(2)}</td>
                  <td className="py-3 px-4"><StatusBadge status={o.status} /></td>
                  <td className="py-3 px-4">
                    <select value={o.status} onChange={e => changeStatus(o.id, e.target.value as OrderStatus)}
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
