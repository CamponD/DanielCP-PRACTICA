import { useState } from "react"
import PageWrapper from "../components/PageWrapper"
import { useAppContext } from "../context/AppContext"

function Login() {
    const { login } = useAppContext()
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
        const result = await login(form)

        if (!result.success) {
            setMessage(result.message)
        }
    }

    return (
        <PageWrapper>
            <h2 className="text-4xl font-bold mb-4 text-gray-800">Login</h2>
            <form onSubmit={handleSubmit}>
                <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                    <div>
                        <label className="mb-2 text-sm font-medium text-gray-900">Username</label>
                        <input type="text" name="username" placeholder="Usuario" onChange={handleChange} required
                            className="border border-gray-300 px-4 py-2 rounded-md block" />
                    </div>
                    <div>
                        <label className="mb-2 text-sm font-medium text-gray-900">Password</label>
                        <input type="password" name="password" placeholder="Contraseña" onChange={handleChange} required
                            className="border border-gray-300 px-4 py-2 rounded-md block" />
                    </div>
                </div>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 mt-4 rounded-full" type="submit">Iniciar Sesión</button>
            </form>
            <p className="text-red-500">{message}</p>
            {message && <p className="text-red-500 mt-4">{message}</p>}
        </PageWrapper>
    )

}

export default Login