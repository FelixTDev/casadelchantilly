import React, { useEffect, useState } from "react";
import { Tag, Plus, Trash2 } from "lucide-react";
import { BtnPrimary } from "../../components/shared";
import { productoService, PromocionApi, CategoriaApi } from "../../../services/productoService";

export default function Promotions() {
  const [promos, setPromos] = useState<PromocionApi[]>([]);
  const [categorias, setCategorias] = useState<CategoriaApi[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ nombre: "", descripcion: "", tipo: "PORCENTAJE", valor: "", fechaInicio: "", fechaFin: "" });

  const loadData = async () => {
    try {
      const [promoRes, catRes] = await Promise.all([
        productoService.getPromociones(),
        productoService.getCategorias(),
      ]);
      setPromos(promoRes.data);
      setCategorias(catRes.data);
    } catch (error) {
      console.error("Error cargando promociones", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAdd = async () => {
    if (!form.nombre || !form.valor || !form.fechaInicio || !form.fechaFin) return;
    try {
      await productoService.crearPromocion({
        nombre: form.nombre,
        descripcion: form.descripcion,
        tipo: form.tipo,
        valor: Number(form.valor),
        fechaInicio: form.fechaInicio,
        fechaFin: form.fechaFin,
      });
      setForm({ nombre: "", descripcion: "", tipo: "PORCENTAJE", valor: "", fechaInicio: "", fechaFin: "" });
      setShowForm(false);
      await loadData();
    } catch (error) {
      console.error("Error creando promocion", error);
      const msg = (error as any)?.response?.data?.mensaje || "No se pudo crear la promoción";
      alert(msg);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await productoService.desactivarPromocion(id);
      await loadData();
    } catch (error) {
      console.error("Error eliminando promocion", error);
      alert("No se pudo eliminar la promoción");
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center py-20" style={{ fontFamily: "Poppins" }}>
      <p className="text-gray-500">Cargando promociones...</p>
    </div>
  );

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
          <h3 className="text-[#333] mb-4" style={{ fontWeight: 700 }}>Crear Promoción</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#333] mb-1" style={{ fontSize: 13, fontWeight: 600 }}>Nombre</label>
              <input value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} placeholder="Ej: Promo Verano"
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 bg-[#F5F5F5] focus:border-[#D32F2F] focus:outline-none" style={{ fontSize: 14 }} />
            </div>
            <div>
              <label className="block text-[#333] mb-1" style={{ fontSize: 13, fontWeight: 600 }}>Descripción</label>
              <input value={form.descripcion} onChange={e => setForm({ ...form, descripcion: e.target.value })} placeholder="Descripción breve"
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 bg-[#F5F5F5] focus:border-[#D32F2F] focus:outline-none" style={{ fontSize: 14 }} />
            </div>
            <div>
              <label className="block text-[#333] mb-1" style={{ fontSize: 13, fontWeight: 600 }}>Descuento</label>
              <input type="number" value={form.valor} onChange={e => setForm({ ...form, valor: e.target.value })} placeholder="20"
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 bg-[#F5F5F5] focus:border-[#D32F2F] focus:outline-none" style={{ fontSize: 14 }} />
            </div>
            <div>
              <label className="block text-[#333] mb-1" style={{ fontSize: 13, fontWeight: 600 }}>Tipo</label>
              <select value={form.tipo} onChange={e => setForm({ ...form, tipo: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 bg-[#F5F5F5] focus:border-[#D32F2F] focus:outline-none" style={{ fontSize: 14 }}>
                <option value="PORCENTAJE">Porcentaje (%)</option>
                <option value="MONTO">Monto fijo (S/)</option>
              </select>
            </div>
            <div>
              <label className="block text-[#333] mb-1" style={{ fontSize: 13, fontWeight: 600 }}>Fecha inicio</label>
              <input type="date" value={form.fechaInicio} onChange={e => setForm({ ...form, fechaInicio: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 bg-[#F5F5F5] focus:border-[#D32F2F] focus:outline-none" style={{ fontSize: 14 }} />
            </div>
            <div>
              <label className="block text-[#333] mb-1" style={{ fontSize: 13, fontWeight: 600 }}>Fecha fin</label>
              <input type="date" value={form.fechaFin} onChange={e => setForm({ ...form, fechaFin: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 bg-[#F5F5F5] focus:border-[#D32F2F] focus:outline-none" style={{ fontSize: 14 }} />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <BtnPrimary className="py-2" onClick={handleAdd}>Crear Promoción</BtnPrimary>
            <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-[#333]" style={{ fontSize: 14 }}>Cancelar</button>
          </div>
        </div>
      )}

      {promos.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-10 text-center">
          <Tag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-[#333]" style={{ fontWeight: 600 }}>No hay promociones activas</p>
          <p className="text-gray-400" style={{ fontSize: 14 }}>Crea una nueva promoción para empezar</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {promos.map(p => (
            <div key={p.id} className="bg-white rounded-xl shadow-sm p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Tag className="w-5 h-5 text-[#F5C518]" />
                  <h3 className="text-[#333]" style={{ fontWeight: 700 }}>{p.nombre}</h3>
                </div>
                <span className={`px-2 py-0.5 rounded-full ${p.activo ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`} style={{ fontSize: 12, fontWeight: 600 }}>
                  {p.activo ? "Activa" : "Inactiva"}
                </span>
              </div>
              <p className="text-[#D32F2F] mb-2" style={{ fontWeight: 700, fontSize: 24 }}>
                {p.tipo === "PORCENTAJE" ? `${p.valor}%` : `S/ ${p.valor}`} OFF
              </p>
              {p.descripcion && <p className="text-gray-500 mb-1" style={{ fontSize: 13 }}>{p.descripcion}</p>}
              <p className="text-gray-400" style={{ fontSize: 12 }}>{p.fechaInicio} → {p.fechaFin}</p>
              <div className="flex justify-end mt-3">
                <button onClick={() => p.id && handleDelete(p.id)} className="text-gray-400 hover:text-[#D32F2F]">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
