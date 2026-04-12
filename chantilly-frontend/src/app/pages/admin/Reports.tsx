import React, { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { SALES_DATA, MONTHLY } from "../../data/mock-data";

export default function Reports() {
  const [view, setView] = useState<"semanal" | "mensual" | "anual">("semanal");

  return (
    <div style={{ fontFamily: "Poppins" }}>
      <div className="flex flex-wrap gap-2 mb-6">
        {(["semanal", "mensual", "anual"] as const).map(v => (
          <button key={v} onClick={() => setView(v)}
            className={`px-4 py-2 rounded-lg transition ${view === v ? "bg-[#D32F2F] text-white" : "bg-white text-[#333] border border-gray-200"}`}
            style={{ fontSize: 14, fontWeight: 600, textTransform: "capitalize" }}>{v}</button>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <h2 className="text-[#333] mb-4" style={{ fontWeight: 700 }}>
          Ventas {view === "semanal" ? "de la Semana" : "del Año"}
        </h2>
        <ResponsiveContainer width="100%" height={350}>
          {view === "semanal" ? (
            <BarChart data={SALES_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey="date" style={{ fontSize: 12 }} />
              <YAxis style={{ fontSize: 12 }} />
              <Tooltip formatter={(v: number) => [`S/ ${v}`, "Ventas"]} />
              <Bar dataKey="ventas" fill="#D32F2F" radius={[6, 6, 0, 0]} />
            </BarChart>
          ) : (
            <LineChart data={MONTHLY}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey="month" style={{ fontSize: 12 }} />
              <YAxis style={{ fontSize: 12 }} />
              <Tooltip formatter={(v: number) => [`S/ ${v.toLocaleString()}`, "Ventas"]} />
              <Line type="monotone" dataKey="ventas" stroke="#D32F2F" strokeWidth={3} dot={{ fill: "#F5C518", r: 5 }} />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-5 text-center">
          <p className="text-gray-500" style={{ fontSize: 13 }}>Total Semana</p>
          <p className="text-[#333]" style={{ fontWeight: 700, fontSize: 28 }}>S/ 10,000</p>
          <p className="text-[#4CAF50]" style={{ fontSize: 13 }}>↑ 15% vs semana anterior</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5 text-center">
          <p className="text-gray-500" style={{ fontSize: 13 }}>Pedidos Semana</p>
          <p className="text-[#333]" style={{ fontWeight: 700, fontSize: 28 }}>47</p>
          <p className="text-[#4CAF50]" style={{ fontSize: 13 }}>↑ 8% vs semana anterior</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5 text-center">
          <p className="text-gray-500" style={{ fontSize: 13 }}>Ticket Promedio</p>
          <p className="text-[#333]" style={{ fontWeight: 700, fontSize: 28 }}>S/ 213</p>
          <p className="text-[#F5C518]" style={{ fontSize: 13 }}>→ Sin cambio</p>
        </div>
      </div>
    </div>
  );
}
