import { deleteNote } from "@/api/NoteApi";
import { useAuth } from "@/hooks/useAuth";
import { Note } from "@/types/index"
import { formatDate } from "@/utils/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import io from "socket.io-client";

type NoteDetailsProps = {
    note: Note
}

const NoteDetails = ({note} : NoteDetailsProps) => {

    const [socket, setSocket] = useState(io(import.meta.env.VITE_API_URL_SOCKET));

    const params = useParams()
    const projectId = params.projectId!

    const location = useLocation()
    const queryParams = new URLSearchParams(location.search)
    const taskId = queryParams.get("viewTask")!
    
    const queryClient = useQueryClient()

    const { data, isLoading } = useAuth()
    const canDelete = useMemo(() => data._id === note.createdBy._id, [data, note.createdBy._id])

    const { mutate } = useMutation({
        mutationFn: deleteNote,
        onError: (error) => toast.error(error.message),
        onSuccess: (data) => {
            toast.success(data?.message)
            queryClient.invalidateQueries({queryKey: ["task", taskId]})

            // emitir a socket.io backend
            socket.emit("delete note", taskId)
        }
    })

const handleDeleteNote = (noteId: Note["_id"]) => mutate({projectId, taskId, noteId})
    
if (isLoading) return "Cargando..."

  return (
    <div className="flex justify-between items-center p-3">
        <div>
            <p>{note.content} por: <span className="font-bold">{note.createdBy.name}</span> </p>
            <p className="text-xs text-slate-500">{formatDate(note.createdAt)}</p>
        </div>
        {canDelete && <button onClick={() => handleDeleteNote(note._id)} className="bg-red-400 hover:bg-red-500 p-2 text-xs text-white font-bold cursor-pointer transition-colors">Eliminar</button>}
    </div>
  )
}

export default NoteDetails