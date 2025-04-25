import { Outlet, createFileRoute, redirect, useMatchRoute } from "@tanstack/react-router"

import Navbar from "@/components/Common/Navbar"
import Sidebar from "@/components/Common/Sidebar"
import { isLoggedIn } from "@/hooks/useAuth"

export const Route = createFileRoute("/_layout")({
  component: Layout,
  beforeLoad: async ({ location }) => {
    // Si no está autenticado y no está tratando de acceder a la raíz (landing page),
    // redirigir a login
    if (!isLoggedIn() && location.pathname !== "/") {
      console.log("redirecting to login")
      throw redirect({
        to: "/login",
      })
    }
  },
})

function Layout() {
  const matchRoute = useMatchRoute()
  // Verificar si estamos en la ruta raíz
  const isRootPath = matchRoute({ to: "/" })
  
  // Si estamos en la ruta raíz, solo mostrar el Outlet (la landing page)
  if (isRootPath) {
    return <Outlet />
  }
  
  // En otras rutas, mostrar el layout completo con navegación y sidebar
  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex flex-1 overflow-auto">
        <Sidebar />
        <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden min-h-0">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default Layout
