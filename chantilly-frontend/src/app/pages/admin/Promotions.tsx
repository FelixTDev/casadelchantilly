import React, { useState } from "react";
import { Tag, Plus, Trash2 } from "lucide-react";
import { BtnPrimary } from "../../components/shared";
import { CATEGORIES } from "../../data/mock-data";

interface Promo { id: number; name: string; discount: number; type: string; category: string; start: string; end: string; active: boolean; }

const INITIAL: Promo[] = [
  { id: 1, name: "Día de la Madre", discount: 20, type: "porcentaje", category: "Tortas", start: "2026-05-01", end: "2026-05-12", active: true },
  { id: 2, name: "2x1 Cupcakes", discount: 50, type: "porcentaje", category: "Cupcakes", start: "2026-04-10", end: "2026-04-20", active: true },
  { id: 3, name: "Descuento Panes", discount: 5, type: "monto", category: "Panes", start: "2026-04-01", end: "2026-04-30", active: false },
];

export default function Promotions() {
  const [promos, setPromos] = useState(INITIAL);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", discount: "", type: "porcentaje", category: "", start: "", end: "" });

  const handleAdd = () => {
    if (!form.name || !form.discount) return;
    setPromos([...promos, { ...form, id: Date.now(), discount: Number(form.discount), active: true }]);
    setForm({ name: "", discount: "", type: "porcentaje", category: "", start: "", end: "" });
    setShowForm(false);
  };

  return (
    <div style={{ fontFamily: "Poppins" }}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-[#333]" style={{ fontWeight: 700, fontSize: 20 }}>Promociones</h2>
        <BtnPrimary className="flex items-center gap-2 py-2.5" onClick={() => setShowForm(!showForm)}>
          <Plus className="w-4 h-4" /> Nueva Promoción
        </BtnPrimary>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h3 className="text-[#333] mb-4" style={{ fontWeight: 700 }}>Crear Descuento</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#333] mb-1" style={{ fontSize: 13, fontWeight: 600 }}>Nombre</label>
              <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Ej: Promo Verano"
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 bg-[#F5F5F5] focus:border-[#D32F2F] focus:outline-none" style={{ fontSize: 14 }} />
            </div>
            <div>
              <label className="block text-[#333] mb-1" style={{ fontSize: 13, fontWeight: 600 }}>Categoría</label>
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 bg-[#F5F5F5] focus:border-[#D32F2F] focus:outline-none" style={{ fontSize: 14 }}>
                <option value="">Todas</option>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[#333] mb-1" style={{ fontSize: 13, fontWeight: 600 }}>Descuento</label>
              <input type="number" value={form.discount} onChange={e => setForm({ ...form, discount: e.target.value })} placeholder="20"
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 bg-[#F5F5F5] focus:border-[#D32F2F] focus:outline-none" style={{ fontSize: 14 }} />
            </div>
            <div>
              <label className="block text-[#333] mb-1" style={{ fontSize: 13, fontWeight: 600 }}>Tipo</label>
              <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 bg-[#F5F5F5] focus:border-[#D32F2F] focus:outline-none" style={{ fontSize: 14 }}>
                <option value="porcentaje">Porcentaje (%)</option>
                <option value="monto">Monto fijo (S/)</option>
              </select>
            </div>
            <div>
              <label className="block text-[#333] mb-1" style={{ fontSize: 13, fontWeight: 600 }}>Fecha inicio</label>
              <input type="date" value={form.start} onChange={e => setForm({ ...form, start: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 bg-[#F5F5F5] focus:border-[#D32F2F] focus:outline-none" style={{ fontSize: 14 }} />
            </div>
            <div>
              <label className="block text-[#333] mb-1" style={{ fontSize: 13, fontWeight: 600 }}>Fecha fin</label>
              <input type="date" value={form.end} onChange={e => setForm({ ...form, end: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 bg-[#F5F5F5] focus:border-[#D32F2F] focus:outline-none" style={{ fontSize: 14 }} />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <BtnPrimary className="py-2" onClick={handleAdd}>Crear Promoción</BtnPrimary>
            <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-[#333]" style={{ fontSize: 14 }}>Cancelar</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {promos.map(p => (
          <div key={p.id} className="bg-white rounded-xl shadow-sm p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <Tag className="w-5 h-5 text-[#F5C518]" />
                <h3 className="text-[#333]" style={{ fontWeight: 700 }}>{p.name}</h3>
              </div>
              <span className={`px-2 py-0.5 rounded-full ${p.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`} style={{ fontSize: 12, fontWeight: 600 }}>
                {p.active ? "Activa" : "Inactiva"}
              </span>
            </div>
            <p className="text-[#D32F2F] mb-2" style={{ fontWeight: 700, fontSize: 24 }}>
              {p.type === "porcentaje" ? `${p.discount}%` : `S/ ${p.discount}`} OFF
            </p>
            <p className="text-gray-500 mb-1" style={{ fontSize: 13 }}>Categoría: {p.category || "Todas"}</p>
            <p className="text-gray-400" style={{ fontSize: 12 }}>{p.start} → {p.end}</p>
            <div className="flex justify-end mt-3">
              <button onClick={() => setPromos(promos.filter(x => x.id !== p.id))} className="text-gray-400 hover:text-[#D32F2F]">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
