import { useState } from "react"
import { useAppContext } from "../context/AppContext"
import { useNavigate } from "react-router-dom"
import PageWrapper from "../components/PageWrapper"


function CreateProject() {
    const  { createProject }  = useAppContext()
    const [form, setForm] = useState({
        name: "",
        description: ""
    })
    const [message, setMessage] = useState("")
    const navigate = useNavigate()

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        const result = await createProject(form)

        if (result.success) {
            navigate("/dashboard")
        } else {
            setMessage(result.message)
        }
    }

    return (
        <PageWrapper>
            <div className="max-w-4xl mx-auto pt-8">
                <h2 className="text-2xl font-bold mb-6">Nuevo Proyecto</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Nombre del proyecto</label>
                        <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            required
                            className="w-full border px-4 py-2 rounded"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Descripción</label>
                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            rows="3"
                            className="w-full border px-4 py-2 rounded"
                        />
                    </div>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded" type="submit">
                        Crear proyecto
                    </button>
                </form>

                {message && <p className="text-red-500 mt-4">{message}</p>}
            </div>
        </PageWrapper>
    )
}

export default CreateProject