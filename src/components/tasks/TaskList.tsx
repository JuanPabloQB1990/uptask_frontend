import { Project, TaskProject, TaskStatus } from "@/types/index";
import TaskCard from "./TaskCard";
import { statusTranslations } from "@/locales/es";
import DropTask from "./DropTask";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateStatusTaskById } from "@/api/TaskApi";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { getSocket } from "@/lib/socket"; // 👈 Singleton

type TaskListProps = {
  tasks: TaskProject[];
  canEditAndDelete: boolean;
};

type GroupedTasks = {
  [key: string]: TaskProject[];
};

const initialStatusGroups: GroupedTasks = {
  Pendiente: [],
  Espera: [],
  Progreso: [],
  Revision: [],
  Completada: [],
};

const statusStyles: Record<string, string> = {
  Pendiente: "border-t-slate-300",
  Espera: "border-t-blue-300",
  Progreso: "border-t-red-300",
  Revision: "border-t-amber-300",
  Completada: "border-t-emerald-300",
};

const TaskList = ({ tasks, canEditAndDelete }: TaskListProps) => {
  /* -------------------- ROUTER -------------------- */
  const { projectId } = useParams<{ projectId: string }>();
  const socket = getSocket(); // ✅ UNA sola instancia global

  /* -------------------- GROUP TASKS -------------------- */
  const groupedTasks = tasks.reduce<GroupedTasks>((acc, task) => {
    acc[task.status] = acc[task.status] || [];
    acc[task.status].push(task);
    return acc;
  }, structuredClone(initialStatusGroups));

  /* -------------------- MUTATION -------------------- */
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: updateStatusTaskById,
    onError: (error: Error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      toast.success(data?.message);

      queryClient.invalidateQueries({
        queryKey: ["project", projectId],
      });

      // 🔥 emitir evento usando singleton
      socket.emit("update status task", {
        ...data?.taskResponse,
        project: projectId,
      });
    },
  });

  /* -------------------- DND HANDLER -------------------- */
  const handleDragEnd = (e: DragEndEvent) => {
    const { over, active } = e;
    if (!over || !projectId) return;

    const newStatus = over.id as TaskStatus;

    mutate({
      projectId,
      taskId: active.id.toString(),
      status: newStatus,
    });

    // Optimistic update
    queryClient.setQueryData(
      ["project", projectId],
      (prevData: Project | undefined) => {
        if (!prevData) return prevData;

        return {
          ...prevData,
          tasks: prevData.tasks.map((task) =>
            task._id === active.id ? { ...task, status: newStatus } : task,
          ),
        };
      },
    );
  };

  /* -------------------- UI -------------------- */
  return (
    <div>
      <h2 className="text-5xl font-black my-10">Tareas</h2>

      <div className="flex gap-5 overflow-x-scroll 2xl:overflow-auto pb-32">
        <DndContext onDragEnd={handleDragEnd}>
          {Object.entries(groupedTasks).map(([status, tasks]) => (
            <div key={status} className="min-w-[300px] 2xl:w-1/5">
              <h3
                className={`text-center text-xl font-light border bg-white p-3 border-t-8 ${statusStyles[status]}`}
              >
                {statusTranslations[status]}
              </h3>
              <DropTask status={status} />
              <ul className="mt-5 space-y-5">
                {tasks.length === 0 ? (
                  <li className="text-gray-500 text-center pt-3">
                    No hay tareas
                  </li>
                ) : (
                  tasks.map((task) => (
                    <TaskCard
                      key={task._id}
                      task={task}
                      canEditAndDelete={canEditAndDelete}
                    />
                  ))
                )}
              </ul>
            </div>
          ))}
        </DndContext>
      </div>
    </div>
  );
};

export default TaskList;
