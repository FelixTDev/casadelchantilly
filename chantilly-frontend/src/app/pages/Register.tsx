import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router";
import { Home } from "lucide-react";
import { BtnPrimary } from "../components/shared";
import { useApp } from "../context/AppContext";

export default function Register() {
  const [form, setForm] = useState({ name: "", apellido: "", email: "", phone: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const { register, loading } = useApp();
  const navigate = useNavigate();
  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (Object.values(form).some(v => !v)) { setError("Completa todos los campos"); return; }
    if (form.password !== form.confirm) { setError("Las contraseñas no coinciden"); return; }

    setError("");
    try {
      const response = await register({
        nombre: form.name,
        apellido: form.apellido,
        email: form.email,
        password: form.password,
        telefono: form.phone,
      });
      navigate("/login");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.mensaje ?? "No se pudo registrar la cuenta");
      } else {
        setError("No se pudo registrar la cuenta");
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center px-4 py-10" style={{ fontFamily: "Poppins" }}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <div className="text-center mb-6">
          <Home className="w-10 h-10 text-[#F5C518] mx-auto mb-2" />
          <h1 className="text-[#333]" style={{ fontWeight: 700, fontSize: 24 }}>Crear Cuenta</h1>
          <p className="text-gray-500" style={{ fontSize: 14 }}>Únete a La Casa del Chantilly</p>
        </div>
        {error && <p className="bg-red-50 text-[#D32F2F] p-3 rounded-lg mb-4 text-center" style={{ fontSize: 14 }}>{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[#333] mb-1" style={{ fontSize: 14, fontWeight: 600 }}>Nombre</label>
              <input value={form.name} onChange={e => set("name", e.target.value)} placeholder="María" className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-[#F5F5F5] focus:border-[#D32F2F] focus:outline-none" />
            </div>
            <div>
              <label className="block text-[#333] mb-1" style={{ fontSize: 14, fontWeight: 600 }}>Apellido</label>
              <input value={form.apellido} onChange={e => set("apellido", e.target.value)} placeholder="García" className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-[#F5F5F5] focus:border-[#D32F2F] focus:outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-[#333] mb-1" style={{ fontSize: 14, fontWeight: 600 }}>Correo electrónico</label>
            <input type="email" value={form.email} onChange={e => set("email", e.target.value)} placeholder="tu@correo.com" className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-[#F5F5F5] focus:border-[#D32F2F] focus:outline-none" />
          </div>
          <div>
            <label className="block text-[#333] mb-1" style={{ fontSize: 14, fontWeight: 600 }}>Teléfono</label>
            <input value={form.phone} onChange={e => set("phone", e.target.value)} placeholder="987 654 321" className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-[#F5F5F5] focus:border-[#D32F2F] focus:outline-none" />
          </div>
          <div>
            <label className="block text-[#333] mb-1" style={{ fontSize: 14, fontWeight: 600 }}>Contraseña</label>
            <input type="password" value={form.password} onChange={e => set("password", e.target.value)} placeholder="••••••••" className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-[#F5F5F5] focus:border-[#D32F2F] focus:outline-none" />
          </div>
          <div>
            <label className="block text-[#333] mb-1" style={{ fontSize: 14, fontWeight: 600 }}>Confirmar contraseña</label>
            <input type="password" value={form.confirm} onChange={e => set("confirm", e.target.value)} placeholder="••••••••" className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-[#F5F5F5] focus:border-[#D32F2F] focus:outline-none" />
          </div>
          <BtnPrimary type="submit" className="w-full" disabled={loading}>Registrarme</BtnPrimary>
        </form>
        <p className="text-center mt-6 text-gray-500" style={{ fontSize: 14 }}>
          ¿Ya tienes cuenta? <Link to="/login" className="text-[#D32F2F] hover:underline" style={{ fontWeight: 600 }}>Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
}
