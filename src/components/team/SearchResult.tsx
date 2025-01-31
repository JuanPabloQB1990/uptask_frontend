import { addMemberToProject } from "@/api/TeamApi"
import { TeamMember } from "@/types/index"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "react-toastify"
import io from "socket.io-client";

type SearchResultProps = {
    user: TeamMember
    reset: () => void
}

const SearchResult = ({ user, reset } : SearchResultProps) => {
    
    const [socket, setSocket] = useState(io(import.meta.env.VITE_API_URL_SOCKET));
    
    const params = useParams()
    const projectId = params.projectId!
    const navigate = useNavigate()
    
    const queryClient = useQueryClient()
    const { mutate } = useMutation({
        mutationFn: addMemberToProject,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            toast.success(data?.message)
            reset()
            navigate(location.pathname, {replace: true})
            queryClient.invalidateQueries({queryKey: ["projectTeam", projectId]})

            // emitir a socket.io backend
            socket.emit("new member", user._id)
        },
    })

    const handleAddUserToProject = () => {
        mutate({ projectId, id: user._id })
    }
    
  return (
    <div>
        <p className="mt-10 text-center font-bold">Resultado:</p>
        <div className="flex justify-between items-center">
            <p>{user.name}</p>
            <button
                onClick={handleAddUserToProject}
                className="text-purple-600 hover:bg-purple-100 px-10 py-3 font-bold cursor-pointer">
                Agregar
            </button>
        </div>
    </div>
  )
}

export default SearchResult