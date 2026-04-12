import React from "react";
import { Link } from "react-router";
import { Package, ChevronRight } from "lucide-react";
import { StatusBadge } from "../components/shared";
import { ORDERS } from "../data/mock-data";

export default function MyOrders() {
  return (
    <div className="min-h-screen bg-[#F5F5F5] py-8 px-4" style={{ fontFamily: "Poppins" }}>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-[#333] mb-6" style={{ fontWeight: 700, fontSize: 28 }}>Mis Pedidos</h1>
        <div className="space-y-4">
          {ORDERS.map(order => (
            <Link to={`/pedido/${order.id}`} key={order.id} className="block bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition-shadow">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center shrink-0">
                    <Package className="w-6 h-6 text-[#D32F2F]" />
                  </div>
                  <div>
                    <p className="text-[#333]" style={{ fontWeight: 700 }}>{order.id}</p>
                    <p className="text-gray-500" style={{ fontSize: 13 }}>{order.date} · {order.items.length} producto(s)</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <StatusBadge status={order.status} />
                  <span className="text-[#D32F2F]" style={{ fontWeight: 700 }}>S/ {order.total.toFixed(2)}</span>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
