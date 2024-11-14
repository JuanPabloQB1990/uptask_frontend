import { getTaskById } from "@/api/TaskApi"
import { useQuery } from "@tanstack/react-query"
import { Navigate, useLocation, useParams } from "react-router-dom"
import EditTaskModal from "./EditTaskModal"

const EditTaskData = () => {
    const params = useParams()
    const projectId = params.projectId!

    // obtener el id de la tarea en la url
    const location = useLocation()
    const queryParams = new URLSearchParams(location.search)
    const taskId = queryParams.get('editTask')!
    

    const { data, isError } = useQuery({
        queryKey: ["taskId", taskId],
        queryFn: () => getTaskById({projectId, taskId}),
        enabled: !!taskId, // habilitar la funcion GetTaskById if existe el id en la url
        retry: false
    })
   
    if (isError) return <Navigate to={'/404'}/>

  if (data) return (
    <EditTaskModal data={data} taskId={taskId}/>
  )
}

export default EditTaskData