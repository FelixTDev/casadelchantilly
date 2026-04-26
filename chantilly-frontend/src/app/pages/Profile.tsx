import React, { useState, useEffect } from "react";
import { User, MapPin, Plus, Trash2, Edit2, Check, X } from "lucide-react";
import { BtnPrimary, BtnSecondary } from "../components/shared";
import { useApp } from "../context/AppContext";
import { usuarioService, DireccionApi } from "../../services/usuarioService";

export default function Profile() {
  const { user, setUser } = useApp();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: "", lastName: "", email: "", phone: "" });
  const [addresses, setAddresses] = useState<DireccionApi[]>([]);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [newAddress, setNewAddress] = useState({ etiqueta: "", direccion: "", telefono: "" });
  const [savingAddress, setSavingAddress] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<number | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const [perfilRes, direccionesRes] = await Promise.all([
        usuarioService.getPerfil(),
        usuarioService.getDirecciones(),
      ]);

      const perfil = perfilRes.data;
      setForm({
        name: perfil.nombre || user.name,
        lastName: perfil.apellido || user.lastName,
        email: perfil.email || user.email,
        phone: perfil.telefono || "",
      });
      setAddresses(direccionesRes.data || []);
    } catch (err) {
      console.error("Error cargando perfil", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      await usuarioService.updatePerfil({
        nombre: form.name,
        apellido: form.lastName,
        email: form.email,
        telefono: form.phone,
      });
      setUser({ ...user, name: form.name, lastName: form.lastName, phone: form.phone });
      setEditing(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error("Error guardando perfil", err);
      alert("Hubo un error al guardar los cambios");
    }
  };

  const handleSaveAddress = async () => {
    if (!newAddress.etiqueta || !newAddress.direccion) {
      alert("La etiqueta y direccion son obligatorias");
      return;
    }
    setSavingAddress(true);
    try {
      if (editingAddressId) {
        const { data } = await usuarioService.updateDireccion(editingAddressId, newAddress);
        setAddresses(addresses.map(a => a.id === editingAddressId ? data : a));
      } else {
        const { data } = await usuarioService.addDireccion(newAddress);
        setAddresses([...addresses, data]);
      }
      setShowModal(false);
      setNewAddress({ etiqueta: "", direccion: "", telefono: "" });
      setEditingAddressId(null);
    } catch (err) {
      console.error("Error guardando direccion", err);
      alert("Hubo un error al guardar la direccion");
    } finally {
      setSavingAddress(false);
    }
  };

  const handleDeleteAddress = async (id: number) => {
    if (!confirm("Seguro que deseas eliminar esta direccion?")) return;
    try {
      await usuarioService.deleteDireccion(id);
      setAddresses(addresses.filter((a) => a.id !== id));
    } catch (err) {
      console.error("Error eliminando direccion", err);
      alert("Error al eliminar");
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-[#F5F5F5] py-10 px-4 text-center">Cargando perfil...</div>;
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5] py-10 px-4" style={{ fontFamily: "Poppins" }}>
      <div className="max-w-3xl mx-auto relative">
        <h1 className="text-[#333] mb-6" style={{ fontWeight: 700, fontSize: 28 }}>Mi Perfil</h1>

        {saved && (
          <div className="bg-green-50 text-green-700 p-3 rounded-lg mb-4 flex items-center gap-2">
            <Check className="w-5 h-5" /> Datos actualizados correctamente
          </div>
        )}

        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 bg-[#D32F2F] rounded-full flex items-center justify-center">
                <User className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-[#333]" style={{ fontWeight: 700 }}>{user.name} {user.lastName}</h2>
                <p className="text-gray-500" style={{ fontSize: 14 }}>{user.email}</p>
              </div>
            </div>
            <button onClick={() => setEditing(!editing)} className="text-[#D32F2F] hover:bg-red-50 p-2 rounded-lg">
              <Edit2 className="w-5 h-5" />
            </button>
          </div>

          {editing ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#333] mb-1" style={{ fontSize: 14, fontWeight: 600 }}>Nombre</label>
                  <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-[#F5F5F5] focus:border-[#D32F2F] focus:outline-none" />
                </div>
                <div>
                  <label className="block text-[#333] mb-1" style={{ fontSize: 14, fontWeight: 600 }}>Apellido</label>
                  <input value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-[#F5F5F5] focus:border-[#D32F2F] focus:outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-[#333] mb-1" style={{ fontSize: 14, fontWeight: 600 }}>Telefono</label>
                <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="Ej: 987654321" className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-[#F5F5F5] focus:border-[#D32F2F] focus:outline-none" />
              </div>
              <div className="flex gap-3">
                <BtnPrimary onClick={handleSave}>Guardar Cambios</BtnPrimary>
                <BtnSecondary onClick={() => { setEditing(false); fetchProfile(); }}>Cancelar</BtnSecondary>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[#333]" style={{ fontSize: 14 }}>
              <div><span className="text-gray-500">Nombre:</span> <span style={{ fontWeight: 600 }}>{form.name} {form.lastName}</span></div>
              <div><span className="text-gray-500">Email:</span> <span style={{ fontWeight: 600 }}>{form.email || user.email}</span></div>
              <div><span className="text-gray-500">Telefono:</span> <span style={{ fontWeight: 600 }}>{form.phone || "-"}</span></div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[#333]" style={{ fontWeight: 700, fontSize: 18 }}>Direcciones Guardadas</h2>
            <button onClick={() => { setEditingAddressId(null); setNewAddress({ etiqueta: "", direccion: "", telefono: "" }); setShowModal(true); }} className="text-[#D32F2F] flex items-center gap-1 hover:underline" style={{ fontSize: 14, fontWeight: 600 }}>
              <Plus className="w-4 h-4" /> Agregar
            </button>
          </div>
          <div className="space-y-3">
            {addresses.length === 0 ? (
              <p className="text-gray-500 text-sm italic">No tienes direcciones guardadas.</p>
            ) : (
              addresses.map((a) => (
                <div key={a.id} className="flex items-start gap-3 p-4 bg-[#F5F5F5] rounded-lg">
                  <MapPin className="w-5 h-5 text-[#D32F2F] mt-0.5 shrink-0" />
                  <div className="flex-1">
                    <p className="text-[#333]" style={{ fontWeight: 600 }}>{a.etiqueta}</p>
                    <p className="text-gray-500" style={{ fontSize: 14 }}>{a.direccion}</p>
                    {a.telefono && <p className="text-gray-400" style={{ fontSize: 13 }}>Tel: {a.telefono}</p>}
                  </div>
                  <div className="flex justify-end gap-1">
                    <button onClick={() => {
                        setEditingAddressId(a.id || null);
                        setNewAddress({ etiqueta: a.etiqueta, direccion: a.direccion, telefono: a.telefono || "" });
                        setShowModal(true);
                      }} className="text-gray-400 hover:text-[#1976D2] p-2">
                       <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDeleteAddress(a.id || 0)} className="text-gray-400 hover:text-[#D32F2F] p-2">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-[#333]">{editingAddressId ? "Editar Direccion" : "Nueva Direccion"}</h3>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-[#D32F2F]"><X className="w-6 h-6"/></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">Etiqueta (Ej: Casa, Trabajo)</label>
                  <input value={newAddress.etiqueta} onChange={e => setNewAddress({...newAddress, etiqueta: e.target.value})} className="w-full border p-2 rounded" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Direccion Completa</label>
                  <input value={newAddress.direccion} onChange={e => setNewAddress({...newAddress, direccion: e.target.value})} className="w-full border p-2 rounded" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Telefono C/Recibe (Opcional)</label>
                  <input value={newAddress.telefono} onChange={e => setNewAddress({...newAddress, telefono: e.target.value})} className="w-full border p-2 rounded" />
                </div>
                <BtnPrimary onClick={handleSaveAddress} disabled={savingAddress}>
                  {savingAddress ? "Guardando..." : "Guardar Direccion"}
                </BtnPrimary>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
