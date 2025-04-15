import { useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import PageWrapper from "../components/PageWrapper"
import ProjectItem from "../components/ProjectItem"
import { useAppContext } from "../context/AppContext"

function Dashboard() {
  const { getProjects, projects } = useAppContext()

  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem("token")

    // Si no hay token, redirigir
    if (!token || token.split(".").length !== 3) {
      navigate("/")
      return
    }

    getProjects()

  }, [navigate])

  return (
    <PageWrapper>
      <div className="max-w-4xl mx-auto pt-8">
        <div className="relative mb-6">
          <h2 className="text-2xl font-bold text-center">Tus Proyectos</h2>
          <Link
            to="/projects/new"
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            <span className="block md:hidden text-xl font-bold">+</span>
            <span className="hidden md:block">+ Nuevo proyecto</span>
          </Link>
        </div>

        {projects.length === 0 ? (
          <p>No tienes proyectos todavía.</p>
        ) : (
          <ul className="space-y-4 mb-5">
            {projects.map((project) => (
              <ProjectItem project={project} key={project.id} />
            ))}
          </ul>
        )}
      </div>
    </PageWrapper>
  )
}

export default Dashboard
