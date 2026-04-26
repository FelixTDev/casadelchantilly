import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router";
import { Home, CheckCircle, ArrowLeft } from "lucide-react";
import { BtnPrimary } from "../components/shared";
import { useApp } from "../context/AppContext";

export default function Recovery() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const { recuperarPassword, loading } = useApp();
  const isMockToken = /^[0-9a-fA-F-]{20,}$/.test(successMessage);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setError("");
    setSuccessMessage("");

    try {
      const response = await recuperarPassword(email);
      setSuccessMessage(response.mensaje);
      setSent(true);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.mensaje ?? "No se pudo procesar la solicitud");
      } else {
        setError("No se pudo procesar la solicitud");
      }
      setSent(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center px-4 py-10" style={{ fontFamily: "Poppins" }}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <div className="text-center mb-6">
          <Home className="w-10 h-10 text-[#F5C518] mx-auto mb-2" />
          <h1 className="text-[#333]" style={{ fontWeight: 700, fontSize: 24 }}>Recuperar Contraseña</h1>
        </div>
        {sent ? (
          <div className="text-center py-6">
            <CheckCircle className="w-16 h-16 text-[#4CAF50] mx-auto mb-4" />
            <h2 className="text-[#333] mb-2" style={{ fontWeight: 700, fontSize: 20 }}>¡Correo enviado!</h2>
            <p className="text-gray-500 mb-6" style={{ fontSize: 14 }}>Hemos enviado un enlace de recuperación a {email}. Revisa tu bandeja de entrada.</p>
            {isMockToken && (
              <Link to={`/reset-password/${successMessage}`}>
                <BtnPrimary className="w-full mb-3 bg-[#4CAF50] hover:bg-green-700">Ir al Enlace del Correo</BtnPrimary>
              </Link>
            )}
            <Link to="/login" className="text-[#D32F2F] hover:underline" style={{ fontSize: 14 }}>Volver al Login</Link>
          </div>
        ) : (
          <>
            <p className="text-gray-500 text-center mb-6" style={{ fontSize: 14 }}>Ingresa tu correo y te enviaremos un enlace para restablecer tu contraseña.</p>
            {error && <p className="bg-red-50 text-[#D32F2F] p-3 rounded-lg mb-4 text-center" style={{ fontSize: 14 }}>{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[#333] mb-1" style={{ fontSize: 14, fontWeight: 600 }}>Correo electrónico</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="tu@correo.com" className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-[#F5F5F5] focus:border-[#D32F2F] focus:outline-none" />
              </div>
              <BtnPrimary type="submit" className="w-full" disabled={loading}>Enviar Enlace</BtnPrimary>
            </form>
            <Link to="/login" className="flex items-center justify-center gap-2 mt-6 text-[#D32F2F] hover:underline" style={{ fontSize: 14 }}>
              <ArrowLeft className="w-4 h-4" /> Volver al Login
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
