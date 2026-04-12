import React, { useState } from "react";
import { Plus, Edit2, Trash2, Search } from "lucide-react";
import { BtnPrimary } from "../../components/shared";
import { PRODUCTS, Product } from "../../data/mock-data";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";

export default function AdminProducts() {
  const [products, setProducts] = useState(PRODUCTS);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);

  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  const handleDelete = (id: number) => setProducts(products.filter(p => p.id !== id));

  return (
    <div style={{ fontFamily: "Poppins" }}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar productos..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 bg-white focus:border-[#D32F2F] focus:outline-none" style={{ fontSize: 14 }} />
        </div>
        <BtnPrimary className="flex items-center gap-2 py-2.5" onClick={() => setShowForm(!showForm)}>
          <Plus className="w-4 h-4" /> Nuevo Producto
        </BtnPrimary>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h3 className="text-[#333] mb-4" style={{ fontWeight: 700 }}>Nuevo Producto</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input placeholder="Nombre" className="border border-gray-200 rounded-lg px-4 py-2.5 bg-[#F5F5F5] focus:border-[#D32F2F] focus:outline-none" style={{ fontSize: 14 }} />
            <input placeholder="Categoría" className="border border-gray-200 rounded-lg px-4 py-2.5 bg-[#F5F5F5] focus:border-[#D32F2F] focus:outline-none" style={{ fontSize: 14 }} />
            <input placeholder="Precio" type="number" className="border border-gray-200 rounded-lg px-4 py-2.5 bg-[#F5F5F5] focus:border-[#D32F2F] focus:outline-none" style={{ fontSize: 14 }} />
            <input placeholder="Stock" type="number" className="border border-gray-200 rounded-lg px-4 py-2.5 bg-[#F5F5F5] focus:border-[#D32F2F] focus:outline-none" style={{ fontSize: 14 }} />
          </div>
          <textarea placeholder="Descripción" rows={3} className="w-full mt-4 border border-gray-200 rounded-lg px-4 py-2.5 bg-[#F5F5F5] focus:border-[#D32F2F] focus:outline-none resize-none" style={{ fontSize: 14 }} />
          <div className="flex gap-3 mt-4">
            <BtnPrimary className="py-2" onClick={() => setShowForm(false)}>Guardar</BtnPrimary>
            <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-[#333]" style={{ fontSize: 14 }}>Cancelar</button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full" style={{ fontSize: 14 }}>
            <thead className="bg-[#F5F5F5]">
              <tr>
                <th className="text-left py-3 px-4 text-gray-500" style={{ fontWeight: 600 }}>Producto</th>
                <th className="text-left py-3 px-4 text-gray-500 hidden sm:table-cell" style={{ fontWeight: 600 }}>Categoría</th>
                <th className="text-left py-3 px-4 text-gray-500" style={{ fontWeight: 600 }}>Precio</th>
                <th className="text-left py-3 px-4 text-gray-500" style={{ fontWeight: 600 }}>Stock</th>
                <th className="text-right py-3 px-4 text-gray-500" style={{ fontWeight: 600 }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p: Product) => (
                <tr key={p.id} className="border-t hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <ImageWithFallback src={p.image} alt={p.name} className="w-10 h-10 rounded-lg object-cover" />
                      <span style={{ fontWeight: 600 }}>{p.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-500 hidden sm:table-cell">{p.category}</td>
                  <td className="py-3 px-4 text-[#D32F2F]" style={{ fontWeight: 600 }}>S/ {p.price.toFixed(2)}</td>
                  <td className="py-3 px-4">
                    <span className={p.stock <= 5 ? "text-[#D32F2F]" : "text-[#333]"} style={{ fontWeight: 600 }}>{p.stock}</span>
                    {p.stock <= 5 && <span className="ml-1 text-[#D32F2F]" style={{ fontSize: 11 }}>⚠️</span>}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex justify-end gap-2">
                      <button className="p-2 hover:bg-blue-50 rounded-lg text-[#1976D2]"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(p.id)} className="p-2 hover:bg-red-50 rounded-lg text-[#D32F2F]"><Trash2 className="w-4 h-4" /></button>
                    </div>
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
