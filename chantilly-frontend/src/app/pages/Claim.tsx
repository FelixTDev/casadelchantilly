import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { BtnPrimary } from "../components/shared";
import { pedidoService, PedidoApi } from "../../services/pedidoService";
import { reclamoService } from "../../services/reclamoService";

export default function Claim() {
  const [type, setType] = useState("");
  const [desc, setDesc] = useState("");
  const [pedidoId, setPedidoId] = useState<number | null>(null);
  const [pedidos, setPedidos] = useState<PedidoApi[]>([]);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await pedidoService.getMisPedidos();
        const entregados = response.data.filter((p) => p.estado === "ENTREGADO");
        setPedidos(entregados);
        if (entregados.length > 0) {
          setPedidoId(entregados[0].id);
        }
      } catch (error) {
        console.error("Error cargando pedidos", error);
      }
    };
    load();
  }, []);

  const handleSubmit = async () => {
    if (!pedidoId || !type || !desc) return;
    try {
      await reclamoService.crear({ pedidoId, tipo: type, descripcion: desc });
      setSubmitted(true);
    } catch (error) {
      console.error("Error creando reclamo", error);
      alert("No se pudo registrar el reclamo");
    }
  };

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
              <label className="block text-[#333] mb-2" style={{ fontSize: 14, fontWeight: 600 }}>Pedido</label>
              <select value={pedidoId ?? ""} onChange={e => setPedidoId(Number(e.target.value))}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-[#F5F5F5] focus:border-[#D32F2F] focus:outline-none">
                {pedidos.map((p) => <option key={p.id} value={p.id}>{p.codigoPedido}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[#333] mb-2" style={{ fontSize: 14, fontWeight: 600 }}>Tipo de problema</label>
              <select value={type} onChange={e => setType(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-[#F5F5F5] focus:border-[#D32F2F] focus:outline-none">
                <option value="">Selecciona...</option>
                <option value="PRODUCTO_DANADO">Producto dañado</option>
                <option value="PRODUCTO_INCORRECTO">Producto incorrecto</option>
                <option value="RETRASO">Demora en entrega</option>
                <option value="OTRO">Otro</option>
              </select>
            </div>
            <div>
              <label className="block text-[#333] mb-2" style={{ fontSize: 14, fontWeight: 600 }}>Descripción</label>
              <textarea value={desc} onChange={e => setDesc(e.target.value)} rows={5} placeholder="Describe el problema con detalle..."
                className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-[#F5F5F5] focus:border-[#D32F2F] focus:outline-none resize-none" />
            </div>
            <BtnPrimary onClick={handleSubmit} disabled={!type || !desc || !pedidoId} className="w-full">Enviar Reclamo</BtnPrimary>
          </div>
        </div>
      </div>
    </div>
  );
}

