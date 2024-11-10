import { Task } from "@/types/index";
import TaskCard from "./TaskCard";

type TaskListProps = {
  tasks: Task[];
};

type GroupedTasks = {
  [key: string]: Task[];
};

const initialStatusGroups: GroupedTasks = {
  Pendiente: [],
  Espera: [],
  Progreso: [],
  Revision: [],
  Completada: [],
};

const statusTranslations:{ [key: string] : string  } = {
  Pendiente: "Pendientes",
  Espera: "En Espera",
  Progreso: "En Progreso",
  Revision: "En Revision",
  Completada: "Completadas",
};

const statusStyles : { [key: string] : string  } = {
  Pendiente: "border-t-slate-300",
  Espera: "border-t-blue-300",
  Progreso: "border-t-red-300",
  Revision: "border-t-amber-300",
  Completada: "border-t-emeral-300",
};

const TaskList = ({ tasks }: TaskListProps) => {

  const groupedTasks = tasks.reduce((acc, task) => {
    
    let currentGroup = acc[task.status] ? [...acc[task.status]] : [];
    currentGroup = [...currentGroup, task];
    return { ...acc, [task.status]: currentGroup };
  }, initialStatusGroups);

  return (
    <div>
      <h2 className="text-5xl font-black my-10">Tareas</h2>
      <div className="flex gap-5 overflow-x-scroll 2xl:overflow-auto pb-32">
        {Object.entries(groupedTasks).map(([status, tasks]) => (
          <div key={status} className="min-w-[300px] 2xl:min-w-0 2xl:w-1/5">
            <h3 className={`text-center capitalize text-xl font-light border border-slate-300 bg-white p-3 border-t-8 ${statusStyles[status]}`}>{statusTranslations[status]}</h3>
            <ul className="mt-5 space-y-5">
              {tasks.length === 0 ? (
                <li className="text-gray-500 text-center pt-3">
                  No Hay tareas
                </li>
              ) : (
                tasks.map((task) => <TaskCard key={task._id} task={task} />)
              )}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskList;
