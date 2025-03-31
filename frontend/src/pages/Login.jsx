import { useState } from "react"

function Login() {
    const [form, setForm] = useState({
        username: "",
        password: "",
    })

    const [message, setMessage] = useState("")

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const res = await fetch("http://127.0.0.1:5000/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            })

            const data = await res.json()
            console.log("Respuesta del backend:", data);

            if (res.ok) {
                localStorage.setItem("token", data.access_token)
                localStorage.setItem("username", data.username)
                setMessage("inicio de sesión exitoso.")
            } else {
                setMessage(data.error || "Algo salió mal.")
            }
        } catch (error) {
            setMessage("Error al conectar con el servidor.")
        }
    }

    return (
        <div>
            <h2>Loging</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" name="username" placeholder="Usuario" onChange={handleChange} required />
                <input type="password" name="password" placeholder="Contraseña" onChange={handleChange} required />
                <button type="submit">Iniciar Sesión</button>
            </form>
            <p>{message}</p>
        </div>
    )

}

export default Login