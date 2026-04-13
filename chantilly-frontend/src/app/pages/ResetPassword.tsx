import React, { useState } from "react";
import axios from "axios";
import { Link, useParams, useNavigate } from "react-router"; // Fixed to use 'react-router-dom' standard but checking other files they use 'react-router'
import { Home, KeyRound, CheckCircle } from "lucide-react";
import { BtnPrimary } from "../components/shared";
import axiosInstance from "../../lib/axiosInstance";

export default function ResetPassword() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setError("");
    setLoading(true);

    try {
      await axiosInstance.post("/auth/reset-password", {
        token,
        newPassword: password
      });
      setSuccess(true);
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.mensaje ?? "Enlace inválido o expirado");
      } else {
        setError("No se pudo restablecer la contraseña");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center px-4 py-10" style={{ fontFamily: "Poppins" }}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <div className="text-center mb-6">
          <Home className="w-10 h-10 text-[#F5C518] mx-auto mb-2" />
          <h1 className="text-[#333]" style={{ fontWeight: 700, fontSize: 24 }}>Restablecer Contraseña</h1>
        </div>

        {success ? (
          <div className="text-center py-6">
            <CheckCircle className="w-16 h-16 text-[#4CAF50] mx-auto mb-4" />
            <h2 className="text-[#333] mb-2" style={{ fontWeight: 700, fontSize: 20 }}>¡Contraseña Actualizada!</h2>
            <p className="text-gray-500 mb-6" style={{ fontSize: 14 }}>Tu contraseña ha sido cambiada con éxito. Serás redirigido al Login.</p>
            <Link to="/login"><BtnPrimary>Ir al Login</BtnPrimary></Link>
          </div>
        ) : (
          <>
            <p className="text-gray-500 text-center mb-6" style={{ fontSize: 14 }}>Ingresa tu nueva contraseña para tu cuenta.</p>
            
            {error && <p className="bg-red-50 text-[#D32F2F] p-3 rounded-lg mb-4 text-center" style={{ fontSize: 14 }}>{error}</p>}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[#333] mb-1" style={{ fontSize: 14, fontWeight: 600 }}>Nueva Contraseña</label>
                <input 
                  type="password" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-[#F5F5F5] focus:border-[#D32F2F] focus:outline-none" 
                  placeholder="Mínimo 6 caracteres"
                />
              </div>
              <div>
                <label className="block text-[#333] mb-1" style={{ fontSize: 14, fontWeight: 600 }}>Confirmar Contraseña</label>
                <input 
                  type="password" 
                  value={confirmPassword} 
                  onChange={e => setConfirmPassword(e.target.value)} 
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-[#F5F5F5] focus:border-[#D32F2F] focus:outline-none" 
                  placeholder="Repite la contraseña"
                />
              </div>
              <BtnPrimary type="submit" className="w-full" disabled={loading}>
                {loading ? "Guardando..." : "Guardar Contraseña"}
              </BtnPrimary>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
