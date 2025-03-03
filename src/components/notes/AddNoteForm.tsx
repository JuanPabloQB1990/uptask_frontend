import { NoteFormDate } from "@/types/index";
import { useForm } from "react-hook-form";
import ErrorMessage from "../ErrorMessage";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNote } from "@/api/NoteApi";
import { toast } from "react-toastify";
import { useLocation, useParams } from "react-router-dom";
import { useState } from "react";
import io from "socket.io-client";

const AddNoteForm = () => {

    const params = useParams()
    const projectId = params.projectId!

    const location = useLocation()
    const queryParams = new URLSearchParams(location.search)
    const taskId = queryParams.get("viewTask")!
    
    const queryClient = useQueryClient()

    const [socket, setSocket] = useState(io(import.meta.env.VITE_API_URL_SOCKET));
    
    const initialValues: NoteFormDate = {
        content: "",
    };
    
    const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
} = useForm({ defaultValues: initialValues });

const {  mutate } = useMutation({
    mutationFn: createNote,
    onError: (error) => {
        toast.error(error.message)
    },
    onSuccess: (data) => {
        toast.success(data?.message)
        reset()
        queryClient.invalidateQueries({queryKey: ["task", taskId]})

        // emitir a socket.io backend
        socket.emit("new note", taskId)
    }
})

const handleAddNote = (formData : NoteFormDate) => mutate({projectId, formData, taskId})

  return (
    <form onSubmit={handleSubmit(handleAddNote)} className="space-y-3" noValidate>
      <div className="flex flex-col gap-2">
        <label className="font-bold" htmlFor="content">
          Crear Nota
        </label>
        <input
          type="text"
          id="content"
          placeholder="contenido de la nota"
          className="w-full p-3 border border-gray-300"
          {...register("content", { required: "El contenido de la nota es obligatorio"
          })}
        />
        {errors.content && <ErrorMessage >{errors.content.message}</ErrorMessage>}
      </div>
      <input
        type="submit"
        value="crear nota"
        className="bg-fuchsia-600 hover:bg-fuchsia-700 w-full p-2 text-white font-black cursor-pointer"
        
      />

    </form>
  );
};

export default AddNoteForm;
