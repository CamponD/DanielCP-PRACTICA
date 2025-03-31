import { useState, useEffect } from "react"


function User() {
    const [user, setUser] = useState(null)
    const [message, setMessage] = useState("")
  
    useEffect(() => {
      const token = localStorage.getItem("token")
  
      if (!token) {
        setMessage("No estás autenticado.")
        return
      }
  
      fetch("http://127.0.0.1:5000/me", {
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
  
  export default User