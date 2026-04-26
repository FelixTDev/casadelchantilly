import axiosInstance from "../lib/axiosInstance";

export interface CarritoItemApi {
  id: number;
  productoId: number;
  nombreProducto: string;
  imagenUrl?: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
  notas?: string;
}

export interface CarritoApi {
  id: number;
  usuarioId: number;
  items: CarritoItemApi[];
  subtotal: number;
  totalItems: number;
}

export interface AgregarCarritoItemRequest {
  productoId: number;
  cantidad: number;
  notas?: string;
}

export const carritoService = {
  getCarrito: () => axiosInstance.get<CarritoApi>("/carrito"),
  agregarItem: (item: AgregarCarritoItemRequest) => axiosInstance.post<CarritoApi>("/carrito/items", item),
  actualizarCantidad: (itemId: number, cantidad: number) =>
    axiosInstance.put<CarritoApi>(`/carrito/items/${itemId}`, { cantidad }),
  eliminarItem: (itemId: number) => axiosInstance.delete<CarritoApi>(`/carrito/items/${itemId}`),
  vaciarCarrito: () => axiosInstance.delete("/carrito"),
};
