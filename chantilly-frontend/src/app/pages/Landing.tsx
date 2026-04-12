import React from "react";
import { Link } from "react-router";
import { Home, Cake, Gift, Truck, Star, ChevronRight } from "lucide-react";
import { BtnPrimary, BtnYellow } from "../components/shared";
import { PRODUCTS, CATEGORIES, IMAGES } from "../data/mock-data";
import { useApp } from "../context/AppContext";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

const FEATURED_CATS = [
  { name: "Tortas", icon: Cake, img: IMAGES.birthday },
  { name: "Cupcakes", icon: Gift, img: IMAGES.cupcakes },
  { name: "Postres", icon: Star, img: IMAGES.cheesecake },
  { name: "Panes", icon: Home, img: IMAGES.bread },
];

export default function Landing() {
  const { addToCart } = useApp();
  const featured = PRODUCTS.slice(0, 4);

  return (
    <div style={{ fontFamily: "Poppins" }}>
      {/* HERO */}
      <section className="bg-[#D32F2F] text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1 text-center md:text-left">
            <p className="text-[#F5C518] mb-2" style={{ fontWeight: 600 }}>🏠 Pastelería Artesanal Peruana</p>
            <h1 className="text-3xl md:text-5xl mb-4" style={{ fontWeight: 700, lineHeight: 1.2 }}>
              Endulzamos tus <span className="text-[#F5C518]">momentos</span> más especiales
            </h1>
            <p className="text-white/80 mb-8 max-w-lg" style={{ fontSize: 16 }}>
              Desde 1998 horneamos con amor tortas, pasteles y bocaditos para toda ocasión. Ingredientes de primera calidad y recetas tradicionales peruanas.
            </p>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <Link to="/catalogo">
                <BtnYellow>Ver Catálogo <ChevronRight className="w-4 h-4 inline ml-1" /></BtnYellow>
              </Link>
              <Link to="/registro">
                <button className="border-2 border-white text-white px-6 py-3 rounded-lg hover:bg-white hover:text-[#D32F2F] transition">
                  Crear Cuenta
                </button>
              </Link>
            </div>
          </div>
          <div className="flex-1 max-w-md">
            <ImageWithFallback src={IMAGES.wedding} alt="Torta especial" className="rounded-2xl shadow-2xl w-full object-cover aspect-square" />
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="bg-[#F5F5F5] py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-center text-[#333] mb-2" style={{ fontWeight: 700, fontSize: 28 }}>Nuestras Categorías</h2>
          <div className="w-16 h-1 bg-[#F5C518] mx-auto mb-10 rounded" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {FEATURED_CATS.map(cat => (
              <Link to={`/catalogo?cat=${cat.name}`} key={cat.name} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow group">
                <div className="aspect-square overflow-hidden">
                  <ImageWithFallback src={cat.img} alt={cat.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
                <div className="p-4 text-center">
                  <cat.icon className="w-6 h-6 text-[#F5C518] mx-auto mb-1" />
                  <p className="text-[#333]" style={{ fontWeight: 600 }}>{cat.name}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-center text-[#333] mb-2" style={{ fontWeight: 700, fontSize: 28 }}>Productos Destacados</h2>
          <div className="w-16 h-1 bg-[#F5C518] mx-auto mb-10 rounded" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.map(p => (
              <div key={p.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow">
                <Link to={`/producto/${p.id}`}>
                  <div className="aspect-square overflow-hidden">
                    <ImageWithFallback src={p.image} alt={p.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                  </div>
                </Link>
                <div className="p-4">
                  <p className="text-[#333] mb-1" style={{ fontWeight: 600 }}>{p.name}</p>
                  <p className="text-[#D32F2F] mb-3" style={{ fontWeight: 700, fontSize: 20 }}>S/ {p.price.toFixed(2)}</p>
                  <BtnYellow className="w-full py-2" onClick={() => addToCart(p)}>Agregar</BtnYellow>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/catalogo"><BtnPrimary>Ver Todo el Catálogo</BtnPrimary></Link>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="bg-[#F5F5F5] py-16">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: Truck, title: "Delivery Lima", desc: "Envío a todo Lima Metropolitana. Llega fresco a tu puerta." },
            { icon: Star, title: "Calidad Premium", desc: "Ingredientes seleccionados y recetas artesanales de tradición." },
            { icon: Gift, title: "Personalización", desc: "Diseñamos tu torta soñada. Consulta sin compromiso." },
          ].map(f => (
            <div key={f.title} className="bg-white rounded-xl p-8 text-center shadow-md">
              <div className="w-16 h-16 bg-[#D32F2F] rounded-full flex items-center justify-center mx-auto mb-4">
                <f.icon className="w-8 h-8 text-[#F5C518]" />
              </div>
              <h3 className="text-[#333] mb-2" style={{ fontWeight: 700 }}>{f.title}</h3>
              <p className="text-gray-500" style={{ fontSize: 14 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
