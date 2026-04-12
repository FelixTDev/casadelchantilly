import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Home, Eye, EyeOff } from "lucide-react";
import { BtnPrimary } from "../components/shared";
import { useApp } from "../context/AppContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const { login, loading } = useApp();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Completa todos los campos");
      return;
    }

    setError("");
    const success = await login(email, password);
    if (!success) {
      setError("Credenciales incorrectas. Intenta de nuevo.");
      return;
    }
    const userRaw = localStorage.getItem("chantilly_user");
    const rol = userRaw ? JSON.parse(userRaw).rol : "CLIENTE";
    rol === "ADMIN" ? navigate("/admin") : navigate("/catalogo");
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center px-4 py-10" style={{ fontFamily: "Poppins" }}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <div className="text-center mb-6">
          <Home className="w-10 h-10 text-[#F5C518] mx-auto mb-2" />
          <h1 className="text-[#333]" style={{ fontWeight: 700, fontSize: 24 }}>Iniciar Sesión</h1>
          <p className="text-gray-500" style={{ fontSize: 14 }}>Ingresa a tu cuenta de La Casa del Chantilly</p>
        </div>

        {error && <p className="bg-red-50 text-[#D32F2F] p-3 rounded-lg mb-4 text-center" style={{ fontSize: 14 }}>{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[#333] mb-1" style={{ fontSize: 14, fontWeight: 600 }}>Correo electrónico</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="tu@correo.com"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-[#F5F5F5] focus:border-[#D32F2F] focus:outline-none transition" />
          </div>
          <div>
            <label className="block text-[#333] mb-1" style={{ fontSize: 14, fontWeight: 600 }}>Contraseña</label>
            <div className="relative">
              <input type={showPw ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-[#F5F5F5] focus:border-[#D32F2F] focus:outline-none transition pr-12" />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-3 text-gray-400">
                {showPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
          <div className="text-right">
            <Link to="/recuperar" className="text-[#D32F2F] hover:underline" style={{ fontSize: 14 }}>¿Olvidaste tu contraseña?</Link>
          </div>
          <BtnPrimary type="submit" className="w-full" disabled={loading}>Ingresar</BtnPrimary>
        </form>

        <p className="text-center mt-6 text-gray-500" style={{ fontSize: 14 }}>
          ¿No tienes cuenta? <Link to="/registro" className="text-[#D32F2F] hover:underline" style={{ fontWeight: 600 }}>Regístrate aquí</Link>
        </p>

        <div className="mt-4 pt-4 border-t text-center">
          <p className="text-gray-400 mb-2" style={{ fontSize: 12 }}>Demo: usa cualquier email para cliente</p>
          <p className="text-gray-400" style={{ fontSize: 12 }}>admin@chantilly.com para panel admin</p>
        </div>
      </div>
    </div>
  );
}
