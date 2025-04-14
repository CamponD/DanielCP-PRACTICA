import { createContext, useContext, useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

const AppContext = createContext()

export const AppProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem("token"))
    const [user, setUser] = useState(null)
    const [projects, setProjects] = useState([])

    const navigate = useNavigate()

    useEffect(() => {
        if (!token) return

        // Decodificar token para obtener datos del usuario
        try {
            const payload = JSON.parse(atob(token.split(".")[1]))
            setUser({
                username: payload.username,
                id: payload.sub,
                exp: payload.exp
            })
        } catch (error) {
            logout()
        }
    }, [token])


    const login = async (credentials) => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(credentials),
            })

            const data = await res.json()
            console.log("Respuesta del backend:", data);

            if (res.ok) {
                localStorage.setItem("token", data.access_token)
                localStorage.setItem("username", data.username)

                setToken(data.access_token)

                setUser({
                    username: data.username
                })
                navigate("/dashboard")
                return { success: true }
            } else {
                return { success: false, message: data.error || "Usuario o contraseña incorrectos." }
            }
        } catch (err) {
            return { success: false, message: "Error de conexión con el servidor." }
        }
    }

    return (
        <AppContext.Provider
            value={{ token, user, projects, setProjects, login, logout, getProjects }}
        >
            {children}
        </AppContext.Provider>
    )
}

export const useAppContext = () => useContext(AppContext)