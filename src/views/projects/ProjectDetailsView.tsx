import { getProjectById } from "@/api/ProjectApi";
import AddTaskModal from "@/components/tasks/AddTaskModal";
import EditTaskData from "@/components/tasks/EditTaskData";
import TaskList from "@/components/tasks/TaskList";
import TaskModalDetails from "@/components/tasks/TaskModalDetails";
import { useAuth } from "@/hooks/useAuth";
import { isManager } from "@/utils/policies";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";

const ProjectDetailsView = () => {
  const navigate = useNavigate();
  const params = useParams();

  const projectId = params.projectId!;

  const { data: user, isLoading: authLoading } = useAuth()

  const { data, isLoading, isError } = useQuery({
    queryKey: ["project", projectId],
    queryFn: () => getProjectById(projectId),
    retry: false,
  });

  const canEditAndDelete = useMemo(() => data?.manager === user._id, [data, user])
  
  if (isLoading && authLoading) return "Loading...";
  if (isError) return <Navigate to="/404" />;
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
