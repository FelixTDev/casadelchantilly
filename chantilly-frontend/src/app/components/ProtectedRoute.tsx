import React from 'react';
import { Navigate } from 'react-router';
import { useApp } from '../context/AppContext';

interface Props {
  children: React.ReactNode;
  adminOnly?: boolean;
  clientOnly?: boolean;
}

export default function ProtectedRoute({ children, adminOnly = false, clientOnly = false }: Props) {
  const { isLoggedIn, isAdmin } = useApp();

  if (!isLoggedIn) return <Navigate to="/login" replace />;
  if (adminOnly && !isAdmin) return <Navigate to="/catalogo" replace />;
  if (clientOnly && isAdmin) return <Navigate to="/admin" replace />;

  return <>{children}</>;
}
