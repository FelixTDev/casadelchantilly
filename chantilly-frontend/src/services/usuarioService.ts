import axiosInstance from "../lib/axiosInstance";

export interface PerfilApi {
  nombre: string;
  apellido: string;
  email: string;
  telefono?: string;
}

export interface DireccionApi {
  id?: number;
  etiqueta: string;
  direccion: string;
  telefono?: string;
}

export const usuarioService = {
  getPerfil: () => axiosInstance.get<PerfilApi>("/usuarios/perfil"),
  updatePerfil: (data: PerfilApi) => axiosInstance.put("/usuarios/perfil", data),
  getDirecciones: () => axiosInstance.get<DireccionApi[]>("/usuarios/direcciones"),
  addDireccion: (data: DireccionApi) => axiosInstance.post<DireccionApi>("/usuarios/direcciones", data),
  updateDireccion: (id: number, data: DireccionApi) => axiosInstance.put<DireccionApi>(`/usuarios/direcciones/${id}`, data),
  deleteDireccion: (id: number) => axiosInstance.delete(`/usuarios/direcciones/${id}`),
};
