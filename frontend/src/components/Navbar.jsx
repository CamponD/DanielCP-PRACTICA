import { Link } from "react-router-dom"

export default function Navbar() {
  return (
    <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center">
      <h1 className="text-md md:text-xl font-bold">Mi Plataforma</h1>
      <div className="space-x-2 md:space-x-5">
        <Link to="/" className="hover:underline">Inicio</Link>
        <Link to="/register" className="hover:underline">Registro</Link>
        <Link to="/login" className="hover:underline">Login</Link>
      </div>
    </nav>
  )
}