import React from "react";
import { AlertTriangle, Package } from "lucide-react";
import { PRODUCTS } from "../../data/mock-data";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";

export default function StockAlerts() {
  const lowStock = PRODUCTS.filter(p => p.stock <= 10).sort((a, b) => a.stock - b.stock);

  return (
    <div style={{ fontFamily: "Poppins" }}>
      <div className="flex items-center gap-2 mb-6">
        <AlertTriangle className="w-6 h-6 text-[#D32F2F]" />
        <h2 className="text-[#333]" style={{ fontWeight: 700, fontSize: 20 }}>Productos con Stock Crítico</h2>
        <span className="bg-[#D32F2F] text-white px-2 py-0.5 rounded-full ml-2" style={{ fontSize: 12, fontWeight: 600 }}>{lowStock.length}</span>
      </div>

      <div className="space-y-3">
        {lowStock.map(p => {
          const critical = p.stock <= 5;
          return (
            <div key={p.id} className={`bg-white rounded-xl shadow-sm p-4 flex items-center gap-4 border-l-4 ${critical ? "border-[#D32F2F]" : "border-[#FF9800]"}`}>
              <ImageWithFallback src={p.image} alt={p.name} className="w-14 h-14 rounded-lg object-cover" />
              <div className="flex-1">
                <p className="text-[#333]" style={{ fontWeight: 600 }}>{p.name}</p>
                <p className="text-gray-500" style={{ fontSize: 13 }}>{p.category}</p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-gray-400" />
                  <span className={`${critical ? "text-[#D32F2F]" : "text-[#FF9800]"}`} style={{ fontWeight: 700, fontSize: 20 }}>{p.stock}</span>
                </div>
                <p className={`${critical ? "text-[#D32F2F]" : "text-[#FF9800]"}`} style={{ fontSize: 12, fontWeight: 600 }}>
                  {critical ? "⚠️ Crítico" : "⚡ Bajo"}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
