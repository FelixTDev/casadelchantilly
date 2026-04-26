import React, { useEffect, useMemo, useState } from "react";
import { Plus, Edit2, Trash2, Search, AlertTriangle } from "lucide-react";
import { BtnPrimary } from "../../components/shared";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import { productoService, ProductoApi, CategoriaApi } from "../../../services/productoService";

type ViewProduct = {
  id: number;
  nombre: string;
  categoriaId: number;
  categoriaNombre: string;
  precio: number;
  stock: number;
  descripcion: string;
  imagenUrl: string;
};

const emptyForm = {
  nombre: "",
  categoriaId: "",
  precio: "",
  stock: "",
  descripcion: "",
  imagenUrl: "",
};

export default function AdminProducts() {
  const [products, setProducts] = useState<ViewProduct[]>([]);
  const [categories, setCategories] = useState<CategoriaApi[]>([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);

  const loadData = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        productoService.getAll(),
        productoService.getCategorias(),
      ]);
      setProducts(productsRes.data.map((p) => ({
        id: p.id || 0,
        nombre: p.nombre,
        categoriaId: p.categoriaId,
        categoriaNombre: p.categoriaNombre || "Sin categoria",
        precio: Number(p.precio ?? 0),
        stock: p.stock ?? 0,
        descripcion: p.descripcion || "",
        imagenUrl: p.imagenUrl || "",
      })));
      setCategories(categoriesRes.data);
    } catch (error) {
      console.error("Error cargando productos admin", error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filtered = useMemo(
    () => products.filter((p) => p.nombre.toLowerCase().includes(search.toLowerCase())),
    [products, search]
  );

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async () => {
    if (!form.nombre || !form.categoriaId || !form.precio || !form.stock) return;

    const payload: ProductoApi = {
      nombre: form.nombre,
      descripcion: form.descripcion,
      precio: Number(form.precio),
      precioOferta: null,
      stock: Number(form.stock),
      stockMinimo: 5,
      imagenUrl: form.imagenUrl,
      disponible: true,
      enOferta: false,
      tiempoPreparacion: 0,
      categoriaId: Number(form.categoriaId),
    };

    try {
      if (editingId) {
        await productoService.actualizar(editingId, payload);
      } else {
        await productoService.crear(payload);
      }
      await loadData();
      resetForm();
    } catch (error) {
      console.error("Error guardando producto", error);
      alert("No se pudo guardar el producto");
    }
  };

  const handleEdit = (product: ViewProduct) => {
    setEditingId(product.id);
    setForm({
      nombre: product.nombre,
      categoriaId: String(product.categoriaId),
      precio: String(product.precio),
      stock: String(product.stock),
      descripcion: product.descripcion,
      imagenUrl: product.imagenUrl,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await productoService.desactivar(id);
      await loadData();
    } catch (error) {
      console.error("Error desactivando producto", error);
      alert("No se pudo desactivar el producto");
    }
  };

  return (
    <div style={{ fontFamily: "Poppins" }}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar productos..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 bg-white focus:border-[#D32F2F] focus:outline-none" style={{ fontSize: 14 }} />
        </div>
        <BtnPrimary className="flex items-center gap-2 py-2.5" onClick={() => setShowForm(!showForm)}>
          <Plus className="w-4 h-4" /> {editingId ? "Editar Producto" : "Nuevo Producto"}
        </BtnPrimary>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h3 className="text-[#333] mb-4" style={{ fontWeight: 700 }}>{editingId ? "Editar Producto" : "Nuevo Producto"}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#333] mb-1" style={{ fontSize: 14, fontWeight: 600 }}>Nombre del producto</label>
              <input value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} placeholder="Ej: Torta de Chocolate" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 bg-[#F5F5F5] focus:border-[#D32F2F] focus:outline-none" style={{ fontSize: 14 }} />
            </div>
            <div>
              <label className="block text-[#333] mb-1" style={{ fontSize: 14, fontWeight: 600 }}>Categoría</label>
              <select value={form.categoriaId} onChange={(e) => setForm({ ...form, categoriaId: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 bg-[#F5F5F5] focus:border-[#D32F2F] focus:outline-none" style={{ fontSize: 14 }}>
                <option value="">Seleccione una categoría</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[#333] mb-1" style={{ fontSize: 14, fontWeight: 600 }}>Precio de venta</label>
              <input value={form.precio} onChange={(e) => setForm({ ...form, precio: e.target.value })} placeholder="Ej: 45.50" type="number" step="0.01" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 bg-[#F5F5F5] focus:border-[#D32F2F] focus:outline-none" style={{ fontSize: 14 }} />
              <p className="text-gray-500 mt-1" style={{ fontSize: 12 }}>Ingrese el precio en soles.</p>
            </div>
            <div>
              <label className="block text-[#333] mb-1" style={{ fontSize: 14, fontWeight: 600 }}>Stock disponible</label>
              <input value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} placeholder="Ej: 10" type="number" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 bg-[#F5F5F5] focus:border-[#D32F2F] focus:outline-none" style={{ fontSize: 14 }} />
              <p className="text-gray-500 mt-1" style={{ fontSize: 12 }}>Indique la cantidad disponible para venta.</p>
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-[#333] mb-1" style={{ fontSize: 14, fontWeight: 600 }}>URL de imagen del producto</label>
            <input value={form.imagenUrl} onChange={(e) => setForm({ ...form, imagenUrl: e.target.value })} placeholder="https://ejemplo.com/imagen.jpg" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 bg-[#F5F5F5] focus:border-[#D32F2F] focus:outline-none" style={{ fontSize: 14 }} />
            <p className="text-gray-500 mt-1" style={{ fontSize: 12 }}>Pegue una URL válida de imagen.</p>
          </div>
          <div className="mt-4">
            <label className="block text-[#333] mb-1" style={{ fontSize: 14, fontWeight: 600 }}>Descripción del producto</label>
            <textarea value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} placeholder="Describa brevemente el producto..." rows={3} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 bg-[#F5F5F5] focus:border-[#D32F2F] focus:outline-none resize-none" style={{ fontSize: 14 }} />
          </div>
          <div className="flex gap-3 mt-6">
            <BtnPrimary className="py-2 px-6" onClick={handleSubmit}>Guardar Producto</BtnPrimary>
            <button onClick={resetForm} className="text-gray-500 hover:text-[#333] font-semibold" style={{ fontSize: 14 }}>Cancelar</button>
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
              {filtered.map((p) => (
                <tr key={p.id} className="border-t hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <ImageWithFallback src={p.imagenUrl} alt={p.nombre} className="w-10 h-10 rounded-lg object-cover" />
                      <span style={{ fontWeight: 600 }}>{p.nombre}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-500 hidden sm:table-cell">{p.categoriaNombre}</td>
                  <td className="py-3 px-4 text-[#D32F2F]" style={{ fontWeight: 600 }}>S/ {p.precio.toFixed(2)}</td>
                  <td className="py-3 px-4">
                    <span className={p.stock <= 5 ? "text-[#D32F2F]" : "text-[#333]"} style={{ fontWeight: 600 }}>{p.stock}</span>
                    {p.stock <= 5 && <AlertTriangle className="w-3 h-3 inline ml-1 text-[#D32F2F] -mt-0.5" />}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => handleEdit(p)} className="p-2 hover:bg-blue-50 rounded-lg text-[#1976D2]"><Edit2 className="w-4 h-4" /></button>
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
