import { useEffect, useState } from "react"
import PageWrapper from "../components/PageWrapper"

function Dashboard() {
  const [projects, setProjects] = useState([])
  const [newProjectName, setNewProjectName] = useState("")

  useEffect(() => {
    const token = localStorage.getItem("token")

    fetch(`${import.meta.env.VITE_API_URL}/projects`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        setProjects(data)
      })
      .catch(error => {
        console.error("Error al obtener proyectos:", error)
      })
  }, [])

  return (
    <PageWrapper>
      <div className="max-w-4xl mx-auto pt-8">
        <h2 className="text-2xl font-bold mb-6">Tus Proyectos</h2>

        {projects.length === 0 ? (
          <p>No tienes proyectos todavía.</p>
        ) : (
          <ul className="space-y-4">
            {projects.map((project) => (
              <li
                key={project.id}
                className="border p-4 rounded shadow bg-white flex justify-between items-center"
              >
                <div>
                  <h3 className="text-lg font-semibold">{project.name}</h3>
                  <p className="text-sm text-gray-600">Rol: {project.role}</p>
                </div>
              </li>
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
