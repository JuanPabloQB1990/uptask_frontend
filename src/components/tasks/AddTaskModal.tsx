import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import TaskForm from "./TaskForm";
import { useForm } from "react-hook-form";
import { TaskFormData } from "@/types/index";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTask } from "@/api/TaskApi";
import { toast } from "react-toastify";
import { getSocket } from "@/lib/socket";

export default function AddTaskModal() {
  /* -------------------- ROUTER -------------------- */
  const navigate = useNavigate();
  const location = useLocation();
  const { projectId } = useParams<{ projectId: string }>();

  /* -------------------- SOCKET (Singleton) -------------------- */
  const socket = getSocket();

  /* -------------------- MODAL -------------------- */
  const queryParams = new URLSearchParams(location.search);
  const show = Boolean(queryParams.get("newTask"));

  /* -------------------- FORM -------------------- */
  const initialValues: TaskFormData = {
    name: "",
    description: "",
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskFormData>({
    defaultValues: initialValues,
  });

  /* -------------------- MUTATION -------------------- */
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: createTask,
    onError: (error: Error) => toast.error(error.message),
    onSuccess: (data) => {
      toast.success(data?.message);

      queryClient.invalidateQueries({
        queryKey: ["project", projectId],
      });

      socket.emit("new task", {
        ...data?.taskResponse,
        project: projectId,
      });

      reset();
      navigate(location.pathname, { replace: true });
    },
  });

  /* -------------------- HANDLER -------------------- */
  const handleFormCreateTask = (formData: TaskFormData) => {
    mutate({ formData, projectId: projectId! });
  };

  /* -------------------- UI -------------------- */
  return (
    <Transition appear show={show} as={Fragment}>
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
          {/* Ajustamos el padding del contenedor (p-4) para que en móviles 
          el modal no toque los bordes de la pantalla 
      */}
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
              {/* CAMBIOS CLAVE:
              - p-6 para móvil, p-10 para tablet, p-16 para desktop.
              - max-w-lg en móviles para que no se vea gigante, max-w-4xl en desktop.
          */}
              <Dialog.Panel className="w-full max-w-full sm:max-w-2xl lg:max-w-4xl transform overflow-hidden rounded-2xl bg-white p-6 sm:p-10 lg:p-16 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="font-black text-2xl sm:text-3xl lg:text-4xl my-5 text-slate-800"
                >
                  Nueva Tarea
                </Dialog.Title>

                <p className="text-lg sm:text-xl font-bold text-slate-600">
                  Llena el formulario y crea{" "}
                  <span className="text-fuchsia-600">una tarea</span>
                </p>

                <form
                  onSubmit={handleSubmit(handleFormCreateTask)}
                  className="mt-8 sm:mt-10 space-y-5"
                  noValidate
                >
                  {/* Asegúrate de que TaskForm use flex-col para los inputs en móvil */}
                  <TaskForm errors={errors} register={register} />

                  <input
                    type="submit"
                    value="Crear Tarea"
                    className="bg-fuchsia-600 hover:bg-fuchsia-700 w-full p-3 text-white uppercase font-bold cursor-pointer transition-colors rounded-lg text-sm sm:text-base"
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
