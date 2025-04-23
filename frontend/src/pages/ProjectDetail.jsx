import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import PageWrapper from "../components/PageWrapper"
import { useAppContext } from "../context/AppContext"

function ProjectDetail() {
    const { id } = useParams()
    const { projects, getProjects } = useAppContext()

    const [project, setProject] = useState(null)
    const [message, setMessage] = useState("")

    // Buscar el proyecto si ya está en contexto
    useEffect(() => {
        const searchProject = async () => {
            const projectId = parseInt(id)

            const existing = projects.find(p => p.id === projectId)
            if (existing) {
                setProject(existing)
            } else {
                // Si no existe, intentar cargar proyectos desde el servidor
                const allProjects = await getProjects()

                if (allProjects) {
                    const findProject = allProjects.find(p => p.id === projectId)
                    if (findProject) {
                        setProject(findProject)
                    } else {
                        setMessage("Proyecto no encontrado.")
                    }
                }
            }
        }

        searchProject()

    }, [id, projects, getProjects])

    if (message) {
        return (
            <PageWrapper>
                <p className="text-red-500">{message}</p>
            </PageWrapper>
        )
    }

    if (!project) {
        return (
            <PageWrapper>
                <p>Cargando proyecto...</p>
            </PageWrapper>
        )
    }

    // Vista del proyecto igual que antes
    return (
        <PageWrapper>
            <div className="max-w-3xl mx-auto py-8">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h2 className="text-3xl font-bold mb-2">{project.name}</h2>
                        {project.description && (
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
                            <button onClick={() => alert("Eliminar")} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm">
                                Eliminar
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