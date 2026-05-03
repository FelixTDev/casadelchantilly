import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import axios from "axios";
import { CartItem, Product } from "../data/mock-data";
import { authService, RegisterData } from "../../services/authService";
import { carritoService, CarritoApi } from "../../services/carritoService";

interface User {
  name: string;
  lastName: string;
  email: string;
  phone: string;
}

interface AppState {
  cart: CartItem[];
  isCartOpen: boolean;
  isLoggedIn: boolean;
  isAdmin: boolean;
  user: User;
  loading: boolean;
  addToCart: (p: Product, qty?: number, customization?: string) => Promise<void>;
  removeFromCart: (id: number) => Promise<void>;
  updateQty: (id: number, qty: number) => Promise<void>;
  clearCart: () => Promise<void>;
  setCartOpen: (v: boolean) => void;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  loginAdmin: () => void;
  logout: () => void;
  setUser: (u: User) => void;
  register: (data: RegisterData) => Promise<{ mensaje: string }>;
  recuperarPassword: (email: string) => Promise<{ mensaje: string }>;
}

const AppContext = createContext<AppState>({} as AppState);
export const useApp = () => useContext(AppContext);

function mapCarritoApiToLocal(cartApi: CarritoApi): CartItem[] {
  return (cartApi.items || []).map((item) => ({
    id: item.id,
    name: item.nombreProducto,
    price: Number(item.precioUnitario ?? 0),
    category: "",
    image: item.imagenUrl || "",
    description: "",
    stock: 0,
    quantity: item.cantidad,
    customization: item.notas,
  }));
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setCartOpen] = useState(false);
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User>({ name: "Maria", lastName: "Garcia", email: "maria@email.com", phone: "987654321" });

  const doLocalLogout = () => {
    setLoggedIn(false);
    setIsAdmin(false);
    setCart([]);
    localStorage.removeItem("chantilly_token");
    localStorage.removeItem("chantilly_user");
  };

  const syncCartFromApi = async () => {
    try {
      const response = await carritoService.getCarrito();
      setCart(mapCarritoApiToLocal(response.data));
      return true;
    } catch {
      setCart([]);
      return false;
    }
  };

  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem("chantilly_token");
      const userStr = localStorage.getItem("chantilly_user");
      if (!token || !userStr) return;

      const userData = JSON.parse(userStr);
      setLoggedIn(true);
      setIsAdmin(userData.rol === "ADMIN");
      setUser({ name: userData.nombre, lastName: "", email: userData.email, phone: "" });

      if (userData.rol !== "ADMIN") {
        const ok = await syncCartFromApi();
        if (!ok) {
          doLocalLogout();
        }
      }
    };

    init();
  }, []);

  const addToCart = async (p: Product, qty = 1, customization?: string) => {
    if (!isLoggedIn || isAdmin) {
      setCart((prev) => {
        const existing = prev.find((i) => i.id === p.id);
        if (existing) return prev.map((i) => (i.id === p.id ? { ...i, quantity: i.quantity + qty } : i));
        return [...prev, { ...p, quantity: qty, customization }];
      });
      setCartOpen(true);
      return;
    }

    try {
      const response = await carritoService.agregarItem({
        productoId: p.id,
        cantidad: qty,
        notas: customization,
      });
      setCart(mapCarritoApiToLocal(response.data));
      setCartOpen(true);
    } catch (error) {
      console.error("Error agregando al carrito", error);
    }
  };

  const removeFromCart = async (id: number) => {
    if (!isLoggedIn || isAdmin) {
      setCart((prev) => prev.filter((i) => i.id !== id));
      return;
    }
    try {
      const response = await carritoService.eliminarItem(id);
      setCart(mapCarritoApiToLocal(response.data));
    } catch (error) {
      console.error("Error eliminando item", error);
    }
  };

  const updateQty = async (id: number, qty: number) => {
    if (!isLoggedIn || isAdmin) {
      if (qty <= 0) {
        setCart((prev) => prev.filter((i) => i.id !== id));
        return;
      }
      setCart((prev) => prev.map((i) => (i.id === id ? { ...i, quantity: qty } : i)));
      return;
    }

    try {
      if (qty <= 0) {
        await removeFromCart(id);
      } else {
        const response = await carritoService.actualizarCantidad(id, qty);
        setCart(mapCarritoApiToLocal(response.data));
      }
    } catch (error) {
      console.error("Error actualizando cantidad", error);
    }
  };

  const clearCart = async () => {
    if (!isLoggedIn || isAdmin) {
      setCart([]);
      return;
    }
    try {
      await carritoService.vaciarCarrito();
      setCart([]);
    } catch (error) {
      console.error("Error vaciando carrito", error);
    }
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setLoading(true);
    try {
      const response = await authService.login({ email, password });
      const data = response.data;
      localStorage.setItem("chantilly_token", data.token);
      localStorage.setItem("chantilly_user", JSON.stringify(data));
      setLoggedIn(true);
      setIsAdmin(data.rol === "ADMIN");
      setUser({ name: data.nombre, lastName: "", email: data.email, phone: "" });
      if (data.rol !== "ADMIN") {
        await syncCartFromApi();
      }
      return { success: true };
    } catch (err) {
      let errorMsg = "Credenciales incorrectas. Intenta de nuevo.";
      if (axios.isAxiosError(err) && err.response?.data?.mensaje) {
        errorMsg = err.response.data.mensaje;
      }
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const loginAdmin = () => {
    setIsAdmin(true);
    setLoggedIn(true);
  };

  const logout = () => {
    const token = localStorage.getItem("chantilly_token");
    if (token) {
      authService.logout().catch(() => undefined);
    }
    doLocalLogout();
  };

  const register = async (data: RegisterData) => {
    setLoading(true);
    try {
      const response = await authService.register(data);
      return response.data;
    } finally {
      setLoading(false);
    }
  };

  const recuperarPassword = async (email: string) => {
    setLoading(true);
    try {
      const response = await authService.recuperarPassword(email);
      return response.data;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppContext.Provider value={{ cart, isCartOpen, isLoggedIn, isAdmin, user, loading, addToCart, removeFromCart, updateQty, clearCart, setCartOpen, login, loginAdmin, logout, setUser, register, recuperarPassword }}>
      {children}
    </AppContext.Provider>
  );
}
