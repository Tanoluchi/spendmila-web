import React from 'react';
import { createFileRoute, redirect } from "@tanstack/react-router";
import useAuth, { isLoggedIn } from "@/hooks/useAuth";

export const Route = createFileRoute("/_layout/dashboard")({
  component: Dashboard,
  beforeLoad: async () => {
    // Redirigir a login si el usuario no está autenticado
    if (!isLoggedIn()) {
      throw redirect({
        to: "/login",
      });
    }
  },
});

function Dashboard() {
  const { user: currentUser } = useAuth();

  return (
    <div className="container mx-auto">
      <div className="pt-12 m-4">
        <h1 className="text-2xl font-semibold max-w-sm truncate">
          Hi, {currentUser?.full_name || currentUser?.email} 👋🏼
        </h1>
        <p>Welcome back, nice to see you again!</p>
      </div>
    </div>
  );
}

export default Dashboard; 