import React, { useState } from "react";
import { useParams, Link } from "react-router";
import { ArrowLeft, ShoppingCart, Package, Minus, Plus } from "lucide-react";
import { BtnPrimary, BtnYellow } from "../components/shared";
import { PRODUCTS } from "../data/mock-data";
import { useApp } from "../context/AppContext";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

export default function ProductDetail() {
  const { id } = useParams();
  const product = PRODUCTS.find(p => p.id === Number(id));
  const { addToCart } = useApp();
  const [qty, setQty] = useState(1);
  const [custom, setCustom] = useState("");

  if (!product) return (
    <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center" style={{ fontFamily: "Poppins" }}>
      <div className="text-center">
        <h1 className="text-[#333] mb-4" style={{ fontWeight: 700, fontSize: 24 }}>Producto no encontrado</h1>
        <Link to="/catalogo"><BtnPrimary>Volver al Catálogo</BtnPrimary></Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F5F5F5] py-8 px-4" style={{ fontFamily: "Poppins" }}>
      <div className="max-w-6xl mx-auto">
        <Link to="/catalogo" className="inline-flex items-center gap-2 text-[#D32F2F] hover:underline mb-6" style={{ fontSize: 14, fontWeight: 600 }}>
          <ArrowLeft className="w-4 h-4" /> Volver al catálogo
        </Link>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="aspect-square">
              <ImageWithFallback src={product.image} alt={product.name} className="w-full h-full object-cover" />
            </div>
            <div className="p-8 flex flex-col">
              <span className="text-[#D32F2F] bg-red-50 px-3 py-1 rounded-full w-fit mb-3" style={{ fontSize: 13, fontWeight: 600 }}>{product.category}</span>
              <h1 className="text-[#333] mb-2" style={{ fontWeight: 700, fontSize: 28 }}>{product.name}</h1>
              <p className="text-[#D32F2F] mb-4" style={{ fontWeight: 700, fontSize: 32 }}>S/ {product.price.toFixed(2)}</p>
              <p className="text-gray-600 mb-6 flex-1" style={{ fontSize: 15, lineHeight: 1.7 }}>{product.description}</p>

              <div className="flex items-center gap-2 mb-4">
                <Package className="w-5 h-5 text-[#4CAF50]" />
                <span className={product.stock > 5 ? "text-[#4CAF50]" : "text-[#FF9800]"} style={{ fontSize: 14, fontWeight: 600 }}>
                  {product.stock > 5 ? `${product.stock} en stock` : `¡Solo quedan ${product.stock}!`}
                </span>
              </div>

              <div className="mb-4">
                <label className="block text-[#333] mb-2" style={{ fontSize: 14, fontWeight: 600 }}>Personalización (opcional)</label>
                <textarea value={custom} onChange={e => setCustom(e.target.value)} rows={3} placeholder="Ej: Escribir 'Feliz Cumpleaños María', color rosado..."
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-[#F5F5F5] focus:border-[#D32F2F] focus:outline-none resize-none" />
              </div>

              <div className="flex items-center gap-4 mb-6">
                <span className="text-[#333]" style={{ fontSize: 14, fontWeight: 600 }}>Cantidad:</span>
                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                  <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-3 py-2 hover:bg-gray-100"><Minus className="w-4 h-4" /></button>
                  <span className="px-4 py-2 border-x border-gray-300" style={{ fontWeight: 600 }}>{qty}</span>
                  <button onClick={() => setQty(Math.min(product.stock, qty + 1))} className="px-3 py-2 hover:bg-gray-100"><Plus className="w-4 h-4" /></button>
                </div>
              </div>

              <div className="flex gap-3">
                <BtnPrimary className="flex-1 flex items-center justify-center gap-2" onClick={() => addToCart(product, qty, custom)}>
                  <ShoppingCart className="w-5 h-5" /> Agregar al Carrito
                </BtnPrimary>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
