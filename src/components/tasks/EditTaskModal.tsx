import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useNavigate, useParams } from "react-router-dom";
import { Task, TaskFormData } from "@/types/index";
import { useForm } from "react-hook-form";
import TaskForm from "./TaskForm";
import { toast } from "react-toastify";
import { updateTaskById } from "@/api/TaskApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getSocket } from "@/lib/socket";

type EditTaskModalProps = {
  task: Task;
  taskId: Task["_id"];
};

export default function EditTaskModal({ task, taskId }: EditTaskModalProps) {
  /* -------------------- ROUTER -------------------- */
  const navigate = useNavigate();
  const params = useParams();
  const projectId = params.projectId!;

  /* -------------------- SOCKET (Singleton) -------------------- */
  const socket = getSocket();

  /* -------------------- FORM -------------------- */
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskFormData>({
    defaultValues: {
      name: task.name,
      description: task.description,
    },
  });

  /* -------------------- MUTATION -------------------- */
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: updateTaskById,
    onError: (error: Error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      toast.success(data?.message);

      queryClient.invalidateQueries({
        queryKey: ["project", projectId],
      });
      queryClient.invalidateQueries({
        queryKey: ["task", taskId],
      });

      // emitir evento socket
      socket.emit("edit task", task);

      reset();
      navigate(location.pathname, { replace: true });
    },
  });

  const handleEditTask = (formData: TaskFormData) => {
    mutate({
      projectId,
      taskId,
      formData,
    });
  };

  /* -------------------- UI -------------------- */
  return (
    <Transition appear show={true} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        onClose={() => navigate(location.pathname, { replace: true })}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/60" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 sm:p-6 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              {/* Ajuste de ancho y padding responsivo */}
              <Dialog.Panel className="w-full max-w-full sm:max-w-2xl lg:max-w-4xl transform overflow-hidden rounded-2xl bg-white p-6 sm:p-10 lg:p-16 text-left align-middle shadow-xl transition-all">
                <Dialog.Title className="font-black text-2xl sm:text-3xl lg:text-4xl text-slate-800 my-5">
                  Editar Tarea
                </Dialog.Title>

                <p className="text-lg sm:text-xl font-bold text-slate-600">
                  Realiza cambios a una tarea en{" "}
                  <span className="text-fuchsia-600">este formulario</span>
                </p>

                <form
                  className="mt-8 sm:mt-10 space-y-5"
                  noValidate
                  onSubmit={handleSubmit(handleEditTask)}
                >
                  {/* TaskForm debe ser internamente responsivo (flex-col) */}
                  <TaskForm register={register} errors={errors} />

                  <input
                    type="submit"
                    value="Guardar Cambios"
                    className="w-full bg-fuchsia-600 hover:bg-fuchsia-700 p-3 text-white font-black text-lg sm:text-xl cursor-pointer transition-colors rounded-lg shadow-md hover:shadow-lg"
                  />
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
