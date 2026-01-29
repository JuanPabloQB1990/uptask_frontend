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
import { useEffect, useMemo, useRef } from "react";
import io, { Socket } from "socket.io-client";

const ProjectDetailsView = () => {
  const navigate = useNavigate();
  const params = useParams();
  const projectId = params.projectId!;

  const { data: user, isLoading: authLoading } = useAuth();
  const queryClient = useQueryClient();

  const socketRef = useRef<Socket | null>(null);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["project", projectId],
    queryFn: () => getFullProjectById(projectId),
    retry: false,
  });

  useEffect(() => {
    socketRef.current = io(import.meta.env.VITE_API_URL_SOCKET, {
      withCredentials: true,
      transports: ["polling", "websocket"], // 👈 NO solo websocket
    });

    socketRef.current.emit("open project", projectId);

    const handleUpdate = (taskNew: Task) => {
      if (taskNew.project === projectId) {
        queryClient.invalidateQueries({ queryKey: ["project", projectId] });
      }
    };

    socketRef.current.on("added task", handleUpdate);
    socketRef.current.on("deleted task", handleUpdate);
    socketRef.current.on("edited task", handleUpdate);
    socketRef.current.on("updated status task", handleUpdate);

    return () => {
      socketRef.current?.off("added task", handleUpdate);
      socketRef.current?.off("deleted task", handleUpdate);
      socketRef.current?.off("edited task", handleUpdate);
      socketRef.current?.off("updated status task", handleUpdate);
      socketRef.current?.disconnect();
    };
  }, [projectId, queryClient]);

  const canEditAndDelete = useMemo(
    () => data?.manager === user?._id,
    [data, user],
  );

  if (error?.message === "Token no Valido")
    return <Navigate to="/auth/login" />;
  if (isError) return <Navigate to="/404" />;
  if (isLoading && authLoading) return "Loading...";

  if (data && user)
    return (
      <div>
        <h1 className="text-5xl font-black">{data.projectName}</h1>
        <p className="text-2xl font-light text-gray-500 mt-5">
          {data.description}
        </p>

        {isManager(data.manager, user._id) && (
          <nav className="my-5 flex gap-3">
            <button
              type="button"
              className="bg-purple-400 hover:bg-purple-500 px-10 py-3 text-white text-xl font-bold"
              onClick={() => navigate(location.pathname + "?newTask=true")}
            >
              Agregar Tarea
            </button>
            <Link
              className="bg-fuchsia-600 hover:bg-purple-700 px-10 py-3 text-white text-xl font-bold"
              to={"team"}
            >
              Colaboradores
            </Link>
          </nav>
        )}

        <TaskList tasks={data.tasks} canEditAndDelete={canEditAndDelete} />
        <AddTaskModal />
        <EditTaskData />
        <TaskModalDetails />
      </div>
    );
};

export default ProjectDetailsView;
