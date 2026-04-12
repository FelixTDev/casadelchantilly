import React, { useState } from "react";
import { Link } from "react-router";
import { ArrowLeft, Upload, CheckCircle } from "lucide-react";
import { BtnPrimary } from "../components/shared";

export default function Claim() {
  const [type, setType] = useState("");
  const [desc, setDesc] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (submitted) return (
    <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center px-4" style={{ fontFamily: "Poppins" }}>
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 text-center">
        <CheckCircle className="w-16 h-16 text-[#4CAF50] mx-auto mb-4" />
        <h1 className="text-[#333] mb-2" style={{ fontWeight: 700, fontSize: 24 }}>Reclamo Enviado</h1>
        <p className="text-gray-500 mb-6" style={{ fontSize: 14 }}>Hemos recibido tu reclamo. Te contactaremos en un plazo de 24 horas.</p>
        <Link to="/mis-pedidos"><BtnPrimary>Volver a Mis Pedidos</BtnPrimary></Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F5F5F5] py-8 px-4" style={{ fontFamily: "Poppins" }}>
      <div className="max-w-2xl mx-auto">
        <Link to="/mis-pedidos" className="inline-flex items-center gap-2 text-[#D32F2F] hover:underline mb-6" style={{ fontSize: 14, fontWeight: 600 }}>
          <ArrowLeft className="w-4 h-4" /> Volver
        </Link>
        <div className="bg-white rounded-xl shadow-md p-6">
          <h1 className="text-[#333] mb-6" style={{ fontWeight: 700, fontSize: 24 }}>Formulario de Reclamo</h1>
          <div className="space-y-5">
            <div>
              <label className="block text-[#333] mb-2" style={{ fontSize: 14, fontWeight: 600 }}>Tipo de problema</label>
              <select value={type} onChange={e => setType(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-[#F5F5F5] focus:border-[#D32F2F] focus:outline-none">
                <option value="">Selecciona...</option>
                <option>Producto dañado</option>
                <option>Producto incorrecto</option>
                <option>Pedido incompleto</option>
                <option>Demora en entrega</option>
                <option>Otro</option>
              </select>
            </div>
            <div>
              <label className="block text-[#333] mb-2" style={{ fontSize: 14, fontWeight: 600 }}>Descripción</label>
              <textarea value={desc} onChange={e => setDesc(e.target.value)} rows={5} placeholder="Describe el problema con detalle..."
                className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-[#F5F5F5] focus:border-[#D32F2F] focus:outline-none resize-none" />
            </div>
            <div>
              <label className="block text-[#333] mb-2" style={{ fontSize: 14, fontWeight: 600 }}>Adjuntar imagen (opcional)</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#D32F2F] transition cursor-pointer">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500" style={{ fontSize: 14 }}>Haz clic o arrastra una imagen aquí</p>
                <p className="text-gray-400" style={{ fontSize: 12 }}>PNG, JPG hasta 5MB</p>
              </div>
            </div>
            <BtnPrimary onClick={() => setSubmitted(true)} disabled={!type || !desc} className="w-full">Enviar Reclamo</BtnPrimary>
          </div>
        </div>
      </div>
    </div>
  );
}
