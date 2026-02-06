import { Fragment, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getTaskById, updateStatusTaskById } from "@/api/TaskApi";
import { toast } from "react-toastify";
import { formatDate } from "@/utils/utils";
import { statusTranslations } from "@/locales/es";
import { TaskStatus } from "@/types/index";
import NotesPanel from "../notes/NotesPanel";
import { getSocket } from "@/lib/socket"; // 👈 Singleton

export default function TaskModalDetails() {
  /* -------------------- SOCKET -------------------- */
  const socket = getSocket(); // ✅ instancia única global

  /* -------------------- ROUTER -------------------- */
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const taskId = queryParams.get("viewTask");
  const show = Boolean(taskId);

  /* -------------------- QUERY -------------------- */
  const queryClient = useQueryClient();

  const { data, isError, error } = useQuery({
    queryKey: ["task", taskId],
    queryFn: () => getTaskById({ projectId: projectId!, taskId: taskId! }),
    enabled: !!taskId,
    retry: false,
  });

  /* -------------------- SOCKET EVENTS -------------------- */
  useEffect(() => {
    if (!taskId) return;

     console.log(data);
    
    socket.emit("open task", taskId);
  }, [taskId, socket]);

  useEffect(() => {
    if (!data?._id || !taskId) return;

    const handleAddedNote = (task: string) => {
      if (task === data._id) {
        queryClient.invalidateQueries({ queryKey: ["task", taskId] });
      }
    };

    const handleDeletedNote = (task: string) => {
      if (task === data._id) {
        queryClient.invalidateQueries({ queryKey: ["task", taskId] });
      }
    };

    socket.on("added note", handleAddedNote);
    socket.on("deleted note", handleDeletedNote);

    return () => {
      socket.off("added note", handleAddedNote);
      socket.off("deleted note", handleDeletedNote);
    };
  }, [data?._id, taskId, queryClient, socket]);

  /* -------------------- MUTATION -------------------- */
  const { mutate } = useMutation({
    mutationFn: updateStatusTaskById,
    onError: (error: Error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      toast.success(data?.message);
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
      queryClient.invalidateQueries({ queryKey: ["task", taskId] });

      // 🔥 emitir evento usando singleton
      socket.emit("update status task", {
        ...data?.taskResponse,
        project: projectId,
      });
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const status = e.target.value as TaskStatus;

    mutate({
      projectId: projectId!,
      taskId: taskId!,
      status,
    });
  };

  /* -------------------- ERRORS -------------------- */
  if (isError) {
    toast.error(error.message, { toastId: "task-error" });
    return <Navigate to={`/projects/${projectId}`} />;
  }

  /* -------------------- UI -------------------- */
  if (!data) return null;

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
              {/* Ajustamos paddings: p-6 en móvil, p-10 en tablet, p-16 en desktop */}
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white p-6 sm:p-10 lg:p-16 text-left align-middle shadow-xl transition-all">
                <div className="space-y-1">
                  <p className="text-xs sm:text-sm text-slate-400">
                    Agregada el: {formatDate(data.createdAt)}
                  </p>
                  <p className="text-xs sm:text-sm text-slate-400">
                    Última actualización: {formatDate(data.updatedAt)}
                  </p>
                </div>

                <Dialog.Title className="font-black text-2xl sm:text-3xl lg:text-4xl text-slate-600 my-5 break-words">
                  {data.name}
                </Dialog.Title>

                <p className="text-base sm:text-lg mb-4 text-slate-700">
                  <span className="font-bold text-slate-500">Descripción:</span>{" "}
                  {data.description}
                </p>

                {data.completedBy.length > 0 && (
                  <div className="mt-8">
                    <p className="font-bold text-xl sm:text-2xl my-4 text-slate-600">
                      Historial de Cambios
                    </p>
                    {/* En móvil reducimos un poco el texto para que los emails no se corten */}
                    <ul className="list-decimal pl-5 space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                      {data.completedBy.map((log) => (
                        <li key={log._id} className="text-sm sm:text-base">
                          <span className="font-bold text-slate-500">
                            {statusTranslations[log.status]} por{" "}
                          </span>
                          <span className="block sm:inline">
                            {log.user.name}
                          </span>
                          <span className="text-slate-400 text-xs sm:text-sm block sm:ml-1 sm:inline">
                            ({log.user.email})
                          </span>
                          <span className="text-slate-400 text-xs sm:text-sm block sm:ml-1 sm:inline">
                            ({formatDate(log.updatedAt)})
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="my-8 space-y-3">
                  <label className="font-bold text-slate-600">
                    Estado actual
                  </label>
                  <select
                    onChange={handleChange}
                    defaultValue={data.status}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 outline-none transition-all"
                  >
                    {Object.entries(statusTranslations).map(([key, value]) => (
                      <option key={key} value={key}>
                        {value}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Divisor visual antes de las notas */}
                <div className="border-t border-gray-100 pt-6">
                  <NotesPanel notes={data.notes} />
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
