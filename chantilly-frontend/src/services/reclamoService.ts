import axiosInstance from "../lib/axiosInstance";

export interface ReclamoApi {
  id?: number;
  pedidoId: number;
  tipo: string;
  descripcion: string;
  estado?: string;
  resolucion?: string;
  tipoSolucion?: string;
  creadoEn?: string;
  resueltoEn?: string;
}

export const reclamoService = {
  crear: (data: ReclamoApi) => axiosInstance.post<ReclamoApi>("/reclamos", data),
  getMisReclamos: () => axiosInstance.get<ReclamoApi[]>("/reclamos/mis-reclamos"),
  getTodos: () => axiosInstance.get<ReclamoApi[]>("/reclamos"),
  resolver: (id: number | string, data: { resolucion: string; tipoSolucion: string }) =>
    axiosInstance.put<ReclamoApi>(`/reclamos/${id}/resolver`, data),
};

