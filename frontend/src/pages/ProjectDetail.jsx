import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import PageWrapper from "../components/PageWrapper"
import { useAppContext } from "../context/AppContext"

function ProjectDetail() {
    const { id } = useParams()
    const { projects, getProjects, deleteProject } = useAppContext()
    const [project, setProject] = useState(null)

    const navigate = useNavigate()
    const [deleting, setDeleting] = useState(false)

    const handleDelete = async () => {
        const confirmed = confirm("¿Seguro que quieres eliminar este proyecto?")

        if (!confirmed) return

        setDeleting(true)

        const result = await deleteProject(project.id)

        setDeleting(false)

        if (result.success) {
            navigate("/dashboard")
        } else {
            alert(result.message || "Error al eliminar el proyecto")
        }
    }

    // Buscar el proyecto si ya está en contexto
    useEffect(() => {
        const projectId = parseInt(id)

        if (isNaN(projectId)) {
            navigate("/dashboard")
            return
        }

        const searchProject = async () => {
            const existing = projects.find(p => p.id === projectId)

            if (existing) {
                setProject(existing)
            } else {
                // Si no existe, intentar cargar proyectos desde el servidor
                if (projects.length === 0) {
                    const allProjects = await getProjects()

                    if (allProjects) {
                        const findProject = allProjects.find(p => p.id === projectId)
                        if (findProject) {
                            setProject(findProject)
                        }
                    }
                } else {
                    navigate("/dashboard")
                }
            }
        }

        searchProject()

    }, [id, projects, getProjects])


    if (!project) {
        return (
            <PageWrapper>
                <p>Cargando proyecto...</p>
            </PageWrapper>
        )
    }

    return (
        <PageWrapper>
            <div className="max-w-3xl mx-auto py-8">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h2 className="text-3xl font-bold mb-2">{project.name}</h2>
                        {project.description?.trim() && (
                            <p className="text-gray-700 mb-2">{project.description}</p>
                        )}
                        <p className="text-sm text-gray-500">
                            Tu rol: <strong>{project.role}</strong>
                        </p>
                    </div>

                    <div className="flex gap-2">
                        <button onClick={() => alert("Editar")} className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm">
                            Editar
                        </button>
                        {project.role === "owner" && (
                            <button
                                onClick={handleDelete}
                                disabled={deleting}
                                className={`bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm ${deleting ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {deleting ? "Eliminando..." : "Eliminar"}
                            </button>
                        )}
                        {project.role !== "owner" && (
                            <button onClick={() => alert("Salir")} className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm">
                                Salir
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </PageWrapper>
    )
}

export default ProjectDetail