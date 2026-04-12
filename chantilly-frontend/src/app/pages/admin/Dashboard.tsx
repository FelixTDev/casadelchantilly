import React from "react";
import { DollarSign, ShoppingBag, AlertTriangle, TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { SALES_DATA, ORDERS } from "../../data/mock-data";

const metrics = [
  { label: "Ventas del Día", value: "S/ 2,340", icon: DollarSign, color: "#4CAF50", bg: "#E8F5E9" },
  { label: "Pedidos Pendientes", value: "3", icon: ShoppingBag, color: "#F5C518", bg: "#FFF8E1" },
  { label: "Stock Bajo", value: "4", icon: AlertTriangle, color: "#D32F2F", bg: "#FFEBEE" },
  { label: "Crecimiento", value: "+18%", icon: TrendingUp, color: "#1976D2", bg: "#E3F2FD" },
];

export default function Dashboard() {
  return (
    <div style={{ fontFamily: "Poppins" }}>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {metrics.map(m => (
          <div key={m.label} className="bg-white rounded-xl shadow-sm p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: m.bg }}>
              <m.icon className="w-6 h-6" style={{ color: m.color }} />
            </div>
            <div>
              <p className="text-gray-500" style={{ fontSize: 13 }}>{m.label}</p>
              <p className="text-[#333]" style={{ fontWeight: 700, fontSize: 22 }}>{m.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <h2 className="text-[#333] mb-4" style={{ fontWeight: 700 }}>Ventas de la Semana</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={SALES_DATA}>
            <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
            <XAxis dataKey="date" style={{ fontSize: 12 }} />
            <YAxis style={{ fontSize: 12 }} />
            <Tooltip formatter={(v: number) => [`S/ ${v}`, "Ventas"]} />
            <Bar dataKey="ventas" fill="#D32F2F" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-[#333] mb-4" style={{ fontWeight: 700 }}>Pedidos Recientes</h2>
        <div className="overflow-x-auto">
          <table className="w-full" style={{ fontSize: 14 }}>
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-2 text-gray-500" style={{ fontWeight: 600 }}>Orden</th>
                <th className="text-left py-3 px-2 text-gray-500" style={{ fontWeight: 600 }}>Fecha</th>
                <th className="text-left py-3 px-2 text-gray-500" style={{ fontWeight: 600 }}>Total</th>
                <th className="text-left py-3 px-2 text-gray-500" style={{ fontWeight: 600 }}>Estado</th>
              </tr>
            </thead>
            <tbody>
              {ORDERS.slice(0, 5).map(o => (
                <tr key={o.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="py-3 px-2" style={{ fontWeight: 600 }}>{o.id}</td>
                  <td className="py-3 px-2 text-gray-500">{o.date}</td>
                  <td className="py-3 px-2 text-[#D32F2F]" style={{ fontWeight: 600 }}>S/ {o.total.toFixed(2)}</td>
                  <td className="py-3 px-2">
                    <span className="px-2 py-1 rounded-full" style={{ fontSize: 12, fontWeight: 600, backgroundColor: `${({ "Pendiente": "#F5C518", "En preparación": "#1976D2", "Listo": "#4CAF50", "En ruta": "#FF9800", "Entregado": "#2E7D32", "Cancelado": "#D32F2F" } as Record<string, string>)[o.status]}20`, color: ({ "Pendiente": "#333", "En preparación": "#1976D2", "Listo": "#4CAF50", "En ruta": "#FF9800", "Entregado": "#2E7D32", "Cancelado": "#D32F2F" } as Record<string, string>)[o.status] }}>
                      {o.status}
                    </span>
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
