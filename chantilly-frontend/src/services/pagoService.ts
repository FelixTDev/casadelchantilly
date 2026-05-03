import axiosInstance from "../lib/axiosInstance";

export interface PagoApi {
  id?: number;
  pedidoId?: number;
  metodoPago: string;
  estadoPago?: string;
  monto?: number;
  referencia?: string;
  fechaPago?: string;
}

export const pagoService = {
  registrar: (pedidoId: number, data: PagoApi) =>
    axiosInstance.post<PagoApi>(`/pagos?pedidoId=${pedidoId}`, data),
  getPorPedido: (pedidoId: number | string) => axiosInstance.get<PagoApi>(`/pagos/pedido/${pedidoId}`),
};

