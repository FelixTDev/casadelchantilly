import React from "react";
import { Link } from "react-router";
import { Home } from "lucide-react";
import { BtnPrimary } from "../components/shared";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center px-4" style={{ fontFamily: "Poppins" }}>
      <div className="text-center">
        <p className="text-[#D32F2F]" style={{ fontWeight: 800, fontSize: 120, lineHeight: 1 }}>404</p>
        <h1 className="text-[#333] mb-2" style={{ fontWeight: 700, fontSize: 28 }}>Página no encontrada</h1>
        <p className="text-gray-500 mb-8" style={{ fontSize: 16 }}>Lo sentimos, la página que buscas no existe o fue movida.</p>
        <Link to="/">
          <BtnPrimary className="inline-flex items-center gap-2">
            <Home className="w-5 h-5" /> Volver al inicio
          </BtnPrimary>
        </Link>
      </div>
    </div>
  );
}
