import { Project, TaskProject, TaskStatus } from "@/types/index";
import TaskCard from "./TaskCard";
import { statusTranslations } from "@/locales/es";
import DropTask from "./DropTask";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateStatusTaskById } from "@/api/TaskApi";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { useState } from "react";
import io from "socket.io-client";

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

const statusStyles: { [key: string]: string } = {
  Pendiente: "border-t-slate-300",
  Espera: "border-t-blue-300",
  Progreso: "border-t-red-300",
  Revision: "border-t-amber-300",
  Completada: "border-t-emeral-300",
};

const TaskList = ({ tasks, canEditAndDelete }: TaskListProps) => {

  const groupedTasks = tasks.reduce((acc, task) => {
    let currentGroup = acc[task.status] ? [...acc[task.status]] : [];

    currentGroup = [...currentGroup, task];
    return { ...acc, [task.status]: currentGroup };
  }, initialStatusGroups);

  const [socket, setSocket] = useState(io(import.meta.env.VITE_API_URL_SOCKET));

  const params = useParams();
  const projectId = params.projectId!;

  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: updateStatusTaskById,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      toast.success(data?.message);
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });

      // emitir a socket.io backend
      socket.emit("update status task", {...data?.taskResponse, project: projectId})
    },
  });

  const handleDragEnd = (e: DragEndEvent) => {
    const { over, active } = e;

    if (over && over.id) {
      const data = {
        projectId,
        taskId: active.id.toString(),
        status: over.id as TaskStatus,
      };

      mutate(data);

      queryClient.setQueryData(["project", projectId], (prevData: Project) => {
        const updateTasks = prevData.tasks.map((task) => {
          if (task._id === active.id) {
            return { ...task, status: over.id as TaskStatus };
          }
          return task;
        });

        return {
          ...prevData,
          tasks: updateTasks,
        };
      });
      
    }
  };

  return (
    <div>
      <h2 className="text-5xl font-black my-10">Tareas</h2>
      <div className="flex gap-5 overflow-x-scroll 2xl:overflow-auto pb-32">
        <DndContext onDragEnd={handleDragEnd}>
          {Object.entries(groupedTasks).map(([status, tasks]) => (
            <div key={status} className="min-w-[300px] 2xl:min-w-0 2xl:w-1/5">
              <h3
                className={`text-center capitalize text-xl font-light border border-slate-300 bg-white p-3 border-t-8 ${statusStyles[status]}`}
              >
                {statusTranslations[status]}
              </h3>
              <DropTask status={status} />
              <ul className="mt-5 space-y-5">
                {tasks.length === 0 ? (
                  <li className="text-gray-500 text-center pt-3">
                    No Hay tareas
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
