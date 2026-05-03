import axiosInstance from "../lib/axiosInstance";

export interface NotificacionApi {
  id: number;
  titulo: string;
  mensaje: string;
  tipo: string;
  leido: boolean;
  creadoEn?: string;
}

export const notificacionService = {
  getNotificaciones: () => axiosInstance.get<NotificacionApi[]>("/notificaciones"),
  marcarLeida: (id: number | string) => axiosInstance.put(`/notificaciones/${id}/leer`),
  marcarTodasLeidas: () => axiosInstance.put("/notificaciones/leer-todas"),
  getNoLeidas: () => axiosInstance.get<{ total: number }>("/notificaciones/no-leidas"),
};

