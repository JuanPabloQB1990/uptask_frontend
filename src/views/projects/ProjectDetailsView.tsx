import { Task } from "@/types/index";
import { getFullProjectById } from "@/api/ProjectApi";
import AddTaskModal from "@/components/tasks/AddTaskModal";
import EditTaskData from "@/components/tasks/EditTaskData";
import TaskList from "@/components/tasks/TaskList";
import TaskModalDetails from "@/components/tasks/TaskModalDetails";
import { useAuth } from "@/hooks/useAuth";
import { isManager } from "@/utils/policies";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { useEffect, useMemo } from "react";
import { getSocket } from "@/lib/socket";

const ProjectDetailsView = () => {
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();
  const { data: user, isLoading: authLoading } = useAuth();
  const queryClient = useQueryClient();

  const socket = getSocket();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["project", projectId],
    queryFn: () => getFullProjectById(projectId!),
    retry: false,
  });

  useEffect(() => {
    if (!projectId || !user?._id) return;
   
    
    // 🟢 Unirse a rooms
    socket.emit("open project", projectId);
    socket.emit("open projects", user._id);

    const handleEditProject = () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
    };

    const handleTaskUpdate = (task: Task) => {
      if (task.project === projectId) {
        queryClient.invalidateQueries({ queryKey: ["project", projectId] });
        queryClient.invalidateQueries({ queryKey: ["projects"] });
      }
    };

    socket.on("edited project", handleEditProject);
    socket.on("added task", handleTaskUpdate);
    socket.on("deleted task", handleTaskUpdate);
    socket.on("edited task", handleTaskUpdate);
    socket.on("updated status task", handleTaskUpdate);

    return () => {
      socket.off("edited project", handleEditProject);
      socket.off("added task", handleTaskUpdate);
      socket.off("deleted task", handleTaskUpdate);
      socket.off("edited task", handleTaskUpdate);
      socket.off("updated status task", handleTaskUpdate);
    };
  }, [projectId, user?._id, queryClient, socket]);

  const canEditAndDelete = useMemo(
    () => data?.manager === user?._id,
    [data, user],
  );

  if (error?.message === "Token no Valido")
    return <Navigate to="/auth/login" />;
  if (isError) return <Navigate to="/404" />;
  if (isLoading || authLoading) return "Loading...";

  if (!data || !user) return null;

  return (
    <div className="space-y-6">
      {/* Título */}
      <h1
        className="
      text-3xl sm:text-4xl lg:text-5xl
      font-black
      text-gray-800
      break-words
    "
      >
        {data.projectName}
      </h1>

      {/* Descripción */}
      <p
        className="
      text-base sm:text-lg lg:text-2xl
      font-light
      text-gray-500
      leading-relaxed
    "
      >
        {data.description}
      </p>

      {/* Acciones del Manager */}
      {isManager(data.manager, user._id) && (
        <nav
          className="
        flex flex-col
        sm:flex-row
        gap-3
        sm:gap-4
        mt-4
      "
        >
          <button
            type="button"
            onClick={() => navigate(location.pathname + "?newTask=true")}
            className="
          w-full sm:w-auto
          bg-purple-500 hover:bg-purple-600
          px-6 sm:px-10
          py-3
          text-white
          text-base sm:text-lg
          font-bold
          rounded-md
          transition
        "
          >
            Agregar Tarea
          </button>

          <Link
            to="team"
            className="
          w-full sm:w-auto
          text-center
          bg-fuchsia-600 hover:bg-fuchsia-700
          px-6 sm:px-10
          py-3
          text-white
          text-base sm:text-lg
          font-bold
          rounded-md
          transition
        "
          >
            Colaboradores
          </Link>
        </nav>
      )}

      {/* Lista de tareas */}
      <div className="mt-8">
        <TaskList tasks={data.tasks} canEditAndDelete={canEditAndDelete} />
      </div>

      {/* Modales */}
      <AddTaskModal />
      <EditTaskData />
      <TaskModalDetails />
    </div>
  );
};

export default ProjectDetailsView;
