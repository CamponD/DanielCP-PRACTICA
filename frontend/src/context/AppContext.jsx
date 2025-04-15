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

    const register = async (registerData) => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(registerData),
            })

            const data = await res.json()

            if (res.ok) {
                const loginData = {
                    username: registerData.username,
                    password: registerData.password,
                }

                const loginResult = await login(loginData)
                if (!loginResult.success) {
                    return {
                        success: false,
                        message: "Registro exitoso, pero el login falló. Intenta acceder manualmente.",
                    }
                }
                return { success: true }

            } else {
                return { success: false, message: data.error || "Error durante el registro." }
            }
        } catch (err) {
            return { success: false, message: "Error de conexión con el servidor." }
        }
    }


    const login = async (credentials) => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(credentials),
            })

            const data = await res.json()

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

    const logout = () => {
        localStorage.removeItem("token")
        localStorage.removeItem("username")
        setToken(null)
        setUser(null)
        setProjects([])
        navigate("/")
    }

    const getProjects = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/projects`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            if (!res.ok) throw new Error("Token inválido o expirado")

            const data = await res.json()
            setProjects(data)
            return true

        } catch (error) {
            logout()
            return false
        }
    }

    const createProject = async () => {
        return { success: true }
    }

    return (
        <AppContext.Provider
            value={{ token, user, projects, register, login, logout, getProjects, createProject }}
        >
            {children}
        </AppContext.Provider>
    )
}

export const useAppContext = () => useContext(AppContext)