import React, { useEffect, useState } from "react";
import { AlertTriangle, Package, Check } from "lucide-react";
import { reporteService, AlertaStockApi } from "../../../services/reporteService";

export default function StockAlerts() {
  const [alertas, setAlertas] = useState<AlertaStockApi[]>([]);
  const [loading, setLoading] = useState(true);

  const loadAlertas = async () => {
    try {
      const response = await reporteService.getAlertasStock();
      setAlertas(response.data);
    } catch (error) {
      console.error("Error cargando alertas", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAlertas();
  }, []);

  const marcarAtendida = async (id: number) => {
    try {
      await reporteService.marcarAlertaAtendida(id);
      setAlertas(prev => prev.filter(a => a.id !== id));
    } catch (error) {
      console.error("Error marcando alerta", error);
      alert("No se pudo marcar la alerta");
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center py-20" style={{ fontFamily: "Poppins" }}>
      <p className="text-gray-500">Cargando alertas...</p>
    </div>
  );

  return (
    <div style={{ fontFamily: "Poppins" }}>
      <div className="flex items-center gap-2 mb-6">
        <AlertTriangle className="w-6 h-6 text-[#D32F2F]" />
        <h2 className="text-[#333]" style={{ fontWeight: 700, fontSize: 20 }}>Productos con Stock Crítico</h2>
        <span className="bg-[#D32F2F] text-white px-2 py-0.5 rounded-full ml-2" style={{ fontSize: 12, fontWeight: 600 }}>{alertas.length}</span>
      </div>

      {alertas.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-10 text-center">
          <Check className="w-12 h-12 text-[#4CAF50] mx-auto mb-3" />
          <p className="text-[#333]" style={{ fontWeight: 600, fontSize: 16 }}>Sin alertas de stock</p>
          <p className="text-gray-400" style={{ fontSize: 14 }}>Todos los productos tienen stock suficiente</p>
        </div>
      ) : (
        <div className="space-y-3">
          {alertas.map(a => {
            const critical = a.stockActual <= 0;
            return (
              <div key={a.id} className={`bg-white rounded-xl shadow-sm p-4 flex items-center gap-4 border-l-4 ${critical ? "border-[#D32F2F]" : "border-[#FF9800]"}`}>
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${critical ? "bg-red-50" : "bg-orange-50"}`}>
                  <Package className={`w-6 h-6 ${critical ? "text-[#D32F2F]" : "text-[#FF9800]"}`} />
                </div>
                <div className="flex-1">
                  <p className="text-[#333]" style={{ fontWeight: 600 }}>{a.nombreProducto}</p>
                  <p className="text-gray-400" style={{ fontSize: 13 }}>Mínimo: {a.stockMinimo} unidades</p>
                </div>
                <div className="text-right mr-4">
                  <span className={`${critical ? "text-[#D32F2F]" : "text-[#FF9800]"}`} style={{ fontWeight: 700, fontSize: 20 }}>{a.stockActual}</span>
                  <p className={`${critical ? "text-[#D32F2F]" : "text-[#FF9800]"}`} style={{ fontSize: 12, fontWeight: 600 }}>
                    {critical ? "Agotado" : "Bajo"}
                  </p>
                </div>
                <button onClick={() => marcarAtendida(a.id)}
                  className="bg-[#4CAF50] text-white px-4 py-2 rounded-lg hover:bg-[#388E3C] transition-colors shrink-0"
                  style={{ fontSize: 13, fontWeight: 600 }}>
                  Atendida
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
