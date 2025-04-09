import { useLocation } from "react-router-dom"
import Navbar from "./Navbar"
import AuthNavbar from "./AuthNavbar"

export default function PageWrapper({ children }) {
  const location = useLocation()

  // Rutas públicas con estilo más amplio y AuthNavbar
  const publicRoutes = ["/", "/login", "/register"]
  const isPublic = publicRoutes.includes(location.pathname)

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {isPublic ? <AuthNavbar /> : <Navbar />}

      <main className={`flex-grow px-4 text-center ${isPublic ? "pt-24" : "pt-0"}`}>
        {children}
      </main>
    </div>
  )
}