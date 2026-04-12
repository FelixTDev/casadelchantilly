import React, { useState } from "react";
import { Link, useSearchParams } from "react-router";
import { Search, X } from "lucide-react";
import { BtnYellow } from "../components/shared";
import { PRODUCTS, CATEGORIES } from "../data/mock-data";
import { useApp } from "../context/AppContext";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

export default function Catalog() {
  const [params] = useSearchParams();
  const initialCat = params.get("cat") || "";
  const [selectedCat, setSelectedCat] = useState(initialCat);
  const [search, setSearch] = useState("");
  const { addToCart } = useApp();

  const filtered = PRODUCTS.filter(p => {
    const matchCat = !selectedCat || p.category === selectedCat;
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="min-h-screen bg-[#F5F5F5]" style={{ fontFamily: "Poppins" }}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-[#333] mb-6" style={{ fontWeight: 700, fontSize: 28 }}>Nuestro Catálogo</h1>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar productos..."
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 bg-white focus:border-[#D32F2F] focus:outline-none shadow-sm" />
          {search && <button onClick={() => setSearch("")} className="absolute right-4 top-3.5 text-gray-400"><X className="w-5 h-5" /></button>}
        </div>

        {/* Chips */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button onClick={() => setSelectedCat("")}
            className={`px-4 py-2 rounded-full transition ${!selectedCat ? "bg-[#D32F2F] text-white" : "bg-white text-[#333] border border-gray-200 hover:border-[#D32F2F]"}`}
            style={{ fontSize: 14, fontWeight: 600 }}>
            Todos
          </button>
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setSelectedCat(selectedCat === c ? "" : c)}
              className={`px-4 py-2 rounded-full transition ${selectedCat === c ? "bg-[#F5C518] text-[#333]" : "bg-white text-[#333] border border-gray-200 hover:border-[#F5C518]"}`}
              style={{ fontSize: 14, fontWeight: 600 }}>
              {c}
            </button>
          ))}
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <p className="text-center text-gray-500 py-20">No se encontraron productos</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map(p => (
              <div key={p.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow">
                <Link to={`/producto/${p.id}`}>
                  <div className="aspect-square overflow-hidden">
                    <ImageWithFallback src={p.image} alt={p.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                  </div>
                </Link>
                <div className="p-4">
                  <span className="text-[#D32F2F] bg-red-50 px-2 py-0.5 rounded" style={{ fontSize: 12, fontWeight: 600 }}>{p.category}</span>
                  <p className="text-[#333] mt-2 mb-1" style={{ fontWeight: 600 }}>{p.name}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-[#D32F2F]" style={{ fontWeight: 700, fontSize: 20 }}>S/ {p.price.toFixed(2)}</p>
                    <span className="text-gray-400" style={{ fontSize: 12 }}>Stock: {p.stock}</span>
                  </div>
                  <BtnYellow className="w-full py-2 mt-3" onClick={() => addToCart(p)}>Agregar</BtnYellow>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
