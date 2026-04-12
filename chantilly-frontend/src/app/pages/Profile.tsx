import React, { useState } from "react";
import { User, MapPin, Plus, Trash2, Edit2, Check } from "lucide-react";
import { BtnPrimary, BtnSecondary } from "../components/shared";
import { useApp } from "../context/AppContext";

const SAVED_ADDRESSES = [
  { id: 1, label: "Casa", address: "Av. Larco 345, Miraflores, Lima", phone: "987654321" },
  { id: 2, label: "Oficina", address: "Jr. de la Unión 520, Lima Centro", phone: "912345678" },
];

export default function Profile() {
  const { user, setUser } = useApp();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(user);
  const [addresses, setAddresses] = useState(SAVED_ADDRESSES);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setUser(form);
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] py-10 px-4" style={{ fontFamily: "Poppins" }}>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-[#333] mb-6" style={{ fontWeight: 700, fontSize: 28 }}>Mi Perfil</h1>

        {saved && (
          <div className="bg-green-50 text-green-700 p-3 rounded-lg mb-4 flex items-center gap-2">
            <Check className="w-5 h-5" /> Datos actualizados correctamente
          </div>
        )}

        {/* Personal Info */}
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
                <label className="block text-[#333] mb-1" style={{ fontSize: 14, fontWeight: 600 }}>Correo</label>
                <input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-[#F5F5F5] focus:border-[#D32F2F] focus:outline-none" />
              </div>
              <div>
                <label className="block text-[#333] mb-1" style={{ fontSize: 14, fontWeight: 600 }}>Teléfono</label>
                <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-[#F5F5F5] focus:border-[#D32F2F] focus:outline-none" />
              </div>
              <div className="flex gap-3">
                <BtnPrimary onClick={handleSave}>Guardar Cambios</BtnPrimary>
                <BtnSecondary onClick={() => { setEditing(false); setForm(user); }}>Cancelar</BtnSecondary>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[#333]" style={{ fontSize: 14 }}>
              <div><span className="text-gray-500">Nombre:</span> <span style={{ fontWeight: 600 }}>{user.name} {user.lastName}</span></div>
              <div><span className="text-gray-500">Email:</span> <span style={{ fontWeight: 600 }}>{user.email}</span></div>
              <div><span className="text-gray-500">Teléfono:</span> <span style={{ fontWeight: 600 }}>{user.phone}</span></div>
            </div>
          )}
        </div>

        {/* Addresses */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[#333]" style={{ fontWeight: 700, fontSize: 18 }}>Direcciones Guardadas</h2>
            <button className="text-[#D32F2F] flex items-center gap-1 hover:underline" style={{ fontSize: 14, fontWeight: 600 }}>
              <Plus className="w-4 h-4" /> Agregar
            </button>
          </div>
          <div className="space-y-3">
            {addresses.map(a => (
              <div key={a.id} className="flex items-start gap-3 p-4 bg-[#F5F5F5] rounded-lg">
                <MapPin className="w-5 h-5 text-[#D32F2F] mt-0.5 shrink-0" />
                <div className="flex-1">
                  <p className="text-[#333]" style={{ fontWeight: 600 }}>{a.label}</p>
                  <p className="text-gray-500" style={{ fontSize: 14 }}>{a.address}</p>
                  <p className="text-gray-400" style={{ fontSize: 13 }}>Tel: {a.phone}</p>
                </div>
                <button onClick={() => setAddresses(addresses.filter(x => x.id !== a.id))} className="text-gray-400 hover:text-[#D32F2F]">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
