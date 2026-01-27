import { Fragment, useEffect, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import TaskForm from "./TaskForm";
import { useForm } from "react-hook-form";
import { TaskFormData } from "@/types/index";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTask } from "@/api/TaskApi";
import { toast } from "react-toastify";
import { io, Socket } from "socket.io-client";

export default function AddTaskModal() {
  /* -------------------- ROUTER -------------------- */
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const projectId = params.projectId!;

  /* -------------------- SOCKET -------------------- */
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    socketRef.current = io(import.meta.env.VITE_API_URL_SOCKET);

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  /* -------------------- MODAL VISIBILITY -------------------- */
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
    onError: (error: Error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      toast.success(data?.message);

      queryClient.invalidateQueries({
        queryKey: ["project", projectId],
      });

      // emitir evento socket
      socketRef.current?.emit("new task", {
        ...data?.taskResponse,
        project: projectId,
      });

      reset();
      navigate(location.pathname, { replace: true });
    },
  });

  /* -------------------- HANDLER -------------------- */
  const handleFormCreateTask = (formData: TaskFormData) => {
    mutate({
      formData,
      projectId,
    });
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
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all p-16">
                <Dialog.Title
                  as="h3"
                  className="font-black text-4xl my-5"
                >
                  Nueva Tarea
                </Dialog.Title>

                <p className="text-xl font-bold">
                  Llena el formulario y crea{" "}
                  <span className="text-fuchsia-600">una tarea</span>
                </p>

                <form
                  onSubmit={handleSubmit(handleFormCreateTask)}
                  className="mt-10 space-y-3"
                  noValidate
                >
                  <TaskForm errors={errors} register={register} />

                  <input
                    type="submit"
                    value="Crear Tarea"
                    className="bg-fuchsia-600 hover:bg-fuchsia-700 w-full p-3 text-white uppercase font-bold cursor-pointer transition-colors"
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
