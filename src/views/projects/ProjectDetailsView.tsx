import { getFullProjectById } from "@/api/ProjectApi";
import AddTaskModal from "@/components/tasks/AddTaskModal";
import EditTaskData from "@/components/tasks/EditTaskData";
import TaskList from "@/components/tasks/TaskList";
import TaskModalDetails from "@/components/tasks/TaskModalDetails";
import { useAuth } from "@/hooks/useAuth";
import { isManager } from "@/utils/policies";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import io from "socket.io-client";

const ProjectDetailsView = () => {
  const navigate = useNavigate();
  const params = useParams();

  const projectId = params.projectId!;

  const { data: user, isLoading: authLoading } = useAuth()
  const queryClient = useQueryClient()
  const [socket, setSocket] = useState(io(import.meta.env.VITE_API_URL_SOCKET));
  
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["project", projectId],
    queryFn: () => getFullProjectById(projectId),
    retry: false,
  });

  useEffect(() => {
    socket.emit("open project", projectId);
  }, []);

  useEffect(() => {
    socket.on("added task", (taskNew) => {
      if (taskNew.project === data?._id) {
        queryClient.invalidateQueries({queryKey: ["project", projectId]})
      }
    });

    socket.on("deleted task", (taskNew) => {
      if (taskNew.project === data?._id) {
        queryClient.invalidateQueries({queryKey: ["project", projectId]})
      }
    });

    socket.on("edited task", (taskNew) => {
      if (taskNew.project === data?._id) {
        queryClient.invalidateQueries({queryKey: ["project", projectId]})
      }
    });

    
  });
 
  const canEditAndDelete = useMemo(() => data?.manager === user._id, [data, user])
  
  if (error?.message === "Token no Valido") return <Navigate to="/auth/login" />;
  if(isError) return <Navigate to="/404"/>
  if (isLoading && authLoading) return "Loading...";
  if (data && user)
    return (
      <div>
        <h1 className="text-5xl font-black">{data.projectName}</h1>
        <p className="text-2xl font-light text-gray-500 mt-5">
          {data.description}
        </p>
        {isManager(data.manager, user._id ) && (
          <nav className="my-5 flex gap-3">
            <button
              type="button"
              className="bg-purple-400 hover:bg-purple-500 px-10 py-3 text-white text-xl font-bold cursor-pointer transition-colors"
              onClick={() => navigate(location.pathname + "?newTask=true")}
            >
              Agregar Tarea
            </button>
            <Link
              className="bg-fuchsia-600 hover:bg-purple-700 px-10 py-3 text-white text-xl font-bold cursor-pointer transition-colors"
              to={"team"}
            >
              Colaboradores
            </Link>
          </nav>

        )}
        <TaskList tasks={data.tasks} canEditAndDelete={canEditAndDelete}/>
        <AddTaskModal />
        <EditTaskData />
        <TaskModalDetails />
      </div>
    );
};

export default ProjectDetailsView;
