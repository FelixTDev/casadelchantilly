import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { reporteService, VentasReporteApi, ProductoVentaApi } from "../../../services/reporteService";

export default function Reports() {
  const today = new Date().toISOString().slice(0, 10);
  const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10);

  const [desde, setDesde] = useState(weekAgo);
  const [hasta, setHasta] = useState(today);
  const [reporte, setReporte] = useState<VentasReporteApi | null>(null);
  const [topProductos, setTopProductos] = useState<ProductoVentaApi[]>([]);
  const [loading, setLoading] = useState(true);

  const loadReporte = async () => {
    setLoading(true);
    try {
      const [ventasRes, prodRes] = await Promise.all([
        reporteService.getReporteVentas(desde, hasta),
        reporteService.getProductosVendidos(),
      ]);
      setReporte(ventasRes.data);
      setTopProductos(prodRes.data);
    } catch (error) {
      console.error("Error cargando reportes", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReporte();
  }, [desde, hasta]);

  const chartData = (reporte?.detallePorFecha || []).map(d => ({
    date: d.fecha.slice(5),
    ventas: Number(d.total),
  }));

  return (
    <div style={{ fontFamily: "Poppins" }}>
      <div className="flex flex-wrap items-end gap-4 mb-6">
        <div>
          <label className="block text-[#333] mb-1" style={{ fontSize: 13, fontWeight: 600 }}>Desde</label>
          <input type="date" value={desde} onChange={e => setDesde(e.target.value)}
            className="border border-gray-200 rounded-lg px-4 py-2.5 bg-white focus:border-[#D32F2F] focus:outline-none" style={{ fontSize: 14 }} />
        </div>
        <div>
          <label className="block text-[#333] mb-1" style={{ fontSize: 13, fontWeight: 600 }}>Hasta</label>
          <input type="date" value={hasta} onChange={e => setHasta(e.target.value)}
            className="border border-gray-200 rounded-lg px-4 py-2.5 bg-white focus:border-[#D32F2F] focus:outline-none" style={{ fontSize: 14 }} />
        </div>
      </div>

      {loading ? (
        <p className="text-gray-400 text-center py-10">Cargando reporte...</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-xl shadow-sm p-5 text-center">
              <p className="text-gray-500" style={{ fontSize: 13 }}>Total Pedidos</p>
              <p className="text-[#333]" style={{ fontWeight: 700, fontSize: 28 }}>{reporte?.totalPedidos ?? 0}</p>
              <p className="text-gray-400" style={{ fontSize: 12 }}>
                {reporte?.pedidosEntregados ?? 0} entregados · {reporte?.pedidosCancelados ?? 0} cancelados
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-5 text-center">
              <p className="text-gray-500" style={{ fontSize: 13 }}>Ingresos Totales</p>
              <p className="text-[#D32F2F]" style={{ fontWeight: 700, fontSize: 28 }}>S/ {Number(reporte?.ingresosTotal ?? 0).toFixed(2)}</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-5 text-center">
              <p className="text-gray-500" style={{ fontSize: 13 }}>Ticket Promedio</p>
              <p className="text-[#333]" style={{ fontWeight: 700, fontSize: 28 }}>S/ {Number(reporte?.ticketPromedio ?? 0).toFixed(2)}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <h2 className="text-[#333] mb-4" style={{ fontWeight: 700 }}>Ventas por Día</h2>
            {chartData.length === 0 ? (
              <p className="text-gray-400 text-center py-10" style={{ fontSize: 14 }}>Sin datos en el rango seleccionado</p>
            ) : (
              <ResponsiveContainer width="100%" height={350}>
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
            <h2 className="text-[#333] mb-4" style={{ fontWeight: 700 }}>Top Productos Más Vendidos</h2>
            {topProductos.length === 0 ? (
              <p className="text-gray-400 text-center py-6" style={{ fontSize: 14 }}>Sin datos de productos vendidos</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full" style={{ fontSize: 14 }}>
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-2 text-gray-500" style={{ fontWeight: 600 }}>#</th>
                      <th className="text-left py-3 px-2 text-gray-500" style={{ fontWeight: 600 }}>Producto</th>
                      <th className="text-left py-3 px-2 text-gray-500 hidden sm:table-cell" style={{ fontWeight: 600 }}>Categoría</th>
                      <th className="text-right py-3 px-2 text-gray-500" style={{ fontWeight: 600 }}>Vendidos</th>
                      <th className="text-right py-3 px-2 text-gray-500" style={{ fontWeight: 600 }}>Ingresos</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topProductos.map((p, i) => (
                      <tr key={p.id} className="border-b last:border-0 hover:bg-gray-50">
                        <td className="py-3 px-2 text-gray-400">{i + 1}</td>
                        <td className="py-3 px-2" style={{ fontWeight: 600 }}>{p.nombre}</td>
                        <td className="py-3 px-2 text-gray-500 hidden sm:table-cell">{p.categoria}</td>
                        <td className="py-3 px-2 text-right" style={{ fontWeight: 600 }}>{p.totalVendido}</td>
                        <td className="py-3 px-2 text-right text-[#D32F2F]" style={{ fontWeight: 600 }}>S/ {Number(p.ingresosGenerados).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
