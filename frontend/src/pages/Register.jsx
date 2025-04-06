import { useState } from "react"
import PageWrapper from "../components/PageWrapper"

function Register() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  })

  const [message, setMessage] = useState("")

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const res = await fetch("http://127.0.0.1:5000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })

      const data = await res.json()

      if (res.ok) {
        setMessage("Registro exitoso, ahora puedes iniciar sesión.")
      } else if(res.status === 409){
        setMessage(data.error || "Usuario o email ya registrado.")
      } else {
        setMessage(data.error || "Algo salió mal.")
      }
    } catch (error) {
      setMessage("Error al conectar con el servidor.")
    }
  }

  return (
    <PageWrapper>
      <h2 className="text-4xl font-bold mb-4 text-gray-800">Registro</h2>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
          <div>
            <label className="mb-2 text-sm font-medium text-gray-900">Username</label>
            <input type="text" name="username" placeholder="Usuario" onChange={handleChange} required
              className="border border-gray-300 px-4 py-2 rounded-md block" />
          </div>
          <div>
            <label className="mb-2 text-sm font-medium text-gray-900">Email</label>
            <input type="email" name="email" placeholder="Correo" onChange={handleChange} required
              className="border border-gray-300 px-4 py-2 rounded-md block" />
          </div>
          <div>
            <label className="mb-2 text-sm font-medium text-gray-900">Password</label>
            <input type="password" name="password" placeholder="Contraseña" onChange={handleChange} required
              className="border border-gray-300 px-4 py-2 rounded-md block" />
          </div>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 mt-4 rounded-full" type="submit">Registrarse</button>
      </form>
      <p className="text-red-500">{message}</p>
    </PageWrapper>
  )
}

export default Register