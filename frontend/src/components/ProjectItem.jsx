function ProjectItem({ project }) {
    return (
        < li
            key={project.id}
            className="border p-4 rounded shadow bg-white flex justify-between items-center"
        >
            <div>
                <h3 className="text-lg font-semibold">{project.name}</h3>
                <p className="text-sm text-gray-600">Rol: {project.role}</p>
            </div>
        </li >
    )
}

export default ProjectItem