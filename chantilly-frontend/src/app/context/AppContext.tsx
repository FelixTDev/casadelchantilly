import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import axios from "axios";
import { CartItem, Product } from "../data/mock-data";
import { authService, RegisterData } from "../../services/authService";

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
  addToCart: (p: Product, qty?: number, customization?: string) => void;
  removeFromCart: (id: number) => void;
  updateQty: (id: number, qty: number) => void;
  clearCart: () => void;
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

export function AppProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setCartOpen] = useState(false);
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User>({ name: "María", lastName: "García", email: "maria@email.com", phone: "987654321" });

  useEffect(() => {
    const token = localStorage.getItem("chantilly_token");
    const userStr = localStorage.getItem("chantilly_user");
    if (token && userStr) {
      const userData = JSON.parse(userStr);
      setLoggedIn(true);
      setIsAdmin(userData.rol === "ADMIN");
      setUser({ name: userData.nombre, lastName: "", email: userData.email, phone: "" });
    }
  }, []);

  const addToCart = (p: Product, qty = 1, customization?: string) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === p.id);
      if (existing) return prev.map(i => i.id === p.id ? { ...i, quantity: i.quantity + qty } : i);
      return [...prev, { ...p, quantity: qty, customization }];
    });
    setCartOpen(true);
  };

  const removeFromCart = (id: number) => setCart(prev => prev.filter(i => i.id !== id));
  const updateQty = (id: number, qty: number) => {
    if (qty <= 0) return removeFromCart(id);
    setCart(prev => prev.map(i => i.id === id ? { ...i, quantity: qty } : i));
  };
  const clearCart = () => setCart([]);

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

  const loginAdmin = () => { setIsAdmin(true); setLoggedIn(true); };

  const logout = () => {
    setLoggedIn(false);
    setIsAdmin(false);
    localStorage.removeItem("chantilly_token");
    localStorage.removeItem("chantilly_user");
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
