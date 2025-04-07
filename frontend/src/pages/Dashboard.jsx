import { useState, useEffect } from "react"


function Dashboard() {
    const [user, setUser] = useState(null)
    const [message, setMessage] = useState("")
  
    useEffect(() => {
      const token = localStorage.getItem("token")
  
      if (!token) {
        setMessage("No estás autenticado.")
        return
      }
  
      fetch(`${import.meta.env.VITE_API_URL}/dashboard`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then(res => res.json())
        .then(data => {
          if (data.error) {
            setMessage(data.error)
          } else {
            setUser(data)
          }
        })
        .catch(() => setMessage("Error al conectar con el servidor."))
    }, [])
  
    return (
      <div>
        <h2>Mi perfil</h2>
        {message && <p>{message}</p>}
        {user && (
          <div>
            <p>ID: {user.id}</p>
            <p>Username: {user.username}</p>
            <p>Email: {user.email}</p>
          </div>
        )}
      </div>
    )
  }
  
  export default Dashboard