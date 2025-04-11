import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import PageWrapper from "../components/PageWrapper"
import ProjectItem from "../components/ProjectItem"

function Dashboard() {
  const [projects, setProjects] = useState([])
  const [newProjectName, setNewProjectName] = useState("")

  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem("token")

    // Si no hay token, redirigir
    if (!token || token.split(".").length !== 3) {
      navigate("/")
      return
    }

    fetch(`${import.meta.env.VITE_API_URL}/projects`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(async (res) => {
        if (res.status === 401 || res.status === 422) {
          localStorage.removeItem("token")
          navigate("/")
          return
        }

        const data = await res.json()
        setProjects(data)
      })
      .catch(() => navigate("/"))
  }, [navigate])

  return (
    <PageWrapper>
      <div className="max-w-4xl mx-auto pt-8">
        <h2 className="text-2xl font-bold mb-6">Tus Proyectos</h2>

        {projects.length === 0 ? (
          <p>No tienes proyectos todavía.</p>
        ) : (
          <ul className="space-y-4">
            {projects.map((project) => (
              <ProjectItem project={project} key={project.id}/>
            ))}
          </ul>
        )}
        <form className="mb-6 flex flex-col md:flex-row gap-4 pt-4 justify-center max-w-xs md:max-w-xl mx-auto"
          onSubmit={(e) => {
            e.preventDefault()

            fetch(`${import.meta.env.VITE_API_URL}/projects`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`
              },
              body: JSON.stringify({ name: newProjectName })
            })
              .then((res) => res.json())
              .then((data) => {
                // Recargar lista de proyectos después de crear uno
                setProjects((prev) => [...prev, data.project])
                setNewProjectName("")
              })
              .catch((err) => console.error("Error al crear proyecto:", err))
          }}
        >
          <input
            type="text"
            placeholder="Nombre del proyecto"
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
            className="border px-4 py-2 rounded"
            required
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Crear proyecto
          </button>
        </form>
      </div>
    </PageWrapper>
  )
}

export default Dashboard
