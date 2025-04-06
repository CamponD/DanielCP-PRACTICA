import { Link } from "react-router-dom"

function Home() {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100 px-4 pb-32 text-center">
      <h1 className="text-4xl font-bold mb-4 text-gray-800">Bienvenido a la Plataforma</h1>
      <p className="text-gray-600 mb-8">Gestiona tus proyectos y colabora con otros usuarios.</p>

      <div className="flex gap-4">
        <Link to="/register">
          <button className="bg-red-500 hover:bg-blue-700 text-white px-6 py-2 rounded-full">
            Registrarse
          </button>
        </Link>
        <Link to="/login">
          <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded-full">
            Iniciar sesión
          </button>
        </Link>
      </div>
    </div>
  )
}

export default Home