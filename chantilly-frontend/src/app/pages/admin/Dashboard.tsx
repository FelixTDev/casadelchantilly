import React, { useEffect, useState } from "react";
import { DollarSign, ShoppingBag, AlertTriangle, Users } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { StatusBadge, toUiStatus } from "../../components/shared";
import { reporteService, DashboardApi } from "../../../services/reporteService";
import { pedidoService, PedidoApi } from "../../../services/pedidoService";

export default function Dashboard() {
  const [data, setData] = useState<DashboardApi | null>(null);
  const [orders, setOrders] = useState<PedidoApi[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [dashRes, ordersRes] = await Promise.all([
          reporteService.getDashboard(),
          pedidoService.getTodos(),
        ]);
        setData(dashRes.data);
        setOrders(ordersRes.data.slice(0, 5));
      } catch (error) {
        console.error("Error cargando dashboard", error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const metrics = [
    { label: "Ventas del Día", value: data ? `S/ ${Number(data.ventasHoyTotal).toFixed(2)}` : "—", icon: DollarSign, color: "#4CAF50", bg: "#E8F5E9" },
    { label: "Pedidos Pendientes", value: data ? String(data.pedidosPendientes) : "—", icon: ShoppingBag, color: "#F5C518", bg: "#FFF8E1" },
    { label: "Alertas Stock", value: data ? String(data.alertasStockActivas) : "—", icon: AlertTriangle, color: "#D32F2F", bg: "#FFEBEE" },
    { label: "Clientes", value: data ? String(data.totalClientes) : "—", icon: Users, color: "#1976D2", bg: "#E3F2FD" },
  ];

  const chartData = (data?.ventasSemana || []).map(d => ({
    date: d.fecha.slice(5),
    ventas: Number(d.total),
  }));

  if (loading) return (
    <div className="flex items-center justify-center py-20" style={{ fontFamily: "Poppins" }}>
      <p className="text-gray-500">Cargando dashboard...</p>
    </div>
  );

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
        {chartData.length === 0 ? (
          <p className="text-gray-400 text-center py-10" style={{ fontSize: 14 }}>Sin datos de ventas esta semana</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey="date" style={{ fontSize: 12 }} />
              <YAxis style={{ fontSize: 12 }} />
              <Tooltip formatter={(v: number) => [`S/ ${v.toFixed(2)}`, "Ventas"]} />
              <Bar dataKey="ventas" fill="#D32F2F" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-[#333] mb-4" style={{ fontWeight: 700 }}>Pedidos Recientes</h2>
        {orders.length === 0 ? (
          <p className="text-gray-400 text-center py-6" style={{ fontSize: 14 }}>No hay pedidos aún</p>
        ) : (
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
                {orders.map(o => (
                  <tr key={o.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="py-3 px-2" style={{ fontWeight: 600 }}>{o.codigoPedido}</td>
                    <td className="py-3 px-2 text-gray-500">{o.creadoEn?.slice(0, 10)}</td>
                    <td className="py-3 px-2 text-[#D32F2F]" style={{ fontWeight: 600 }}>S/ {Number(o.total || 0).toFixed(2)}</td>
                    <td className="py-3 px-2"><StatusBadge status={toUiStatus(o.estado)} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
