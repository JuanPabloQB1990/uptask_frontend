import { Fragment, useEffect, useRef } from "react";
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
import { io, Socket } from "socket.io-client";

export default function TaskModalDetails() {
  /* -------------------- SOCKET -------------------- */
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    socketRef.current = io(import.meta.env.VITE_API_URL_SOCKET);

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  /* -------------------- ROUTER -------------------- */
  const params = useParams();
  const projectId = params.projectId!;
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const taskId = queryParams.get("viewTask")!;
  const show = Boolean(taskId);

  /* -------------------- QUERY -------------------- */
  const queryClient = useQueryClient();

  const { data, isError, error } = useQuery({
    queryKey: ["task", taskId],
    queryFn: () => getTaskById({ projectId, taskId }),
    enabled: !!taskId,
    retry: false,
  });

  /* -------------------- SOCKET EVENTS -------------------- */
  useEffect(() => {
    if (!socketRef.current || !taskId) return;

    socketRef.current.emit("open task", taskId);
  }, [taskId]);

  useEffect(() => {
    if (!socketRef.current || !data?._id) return;

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

    socketRef.current.on("added note", handleAddedNote);
    socketRef.current.on("deleted note", handleDeletedNote);

    return () => {
      socketRef.current?.off("added note", handleAddedNote);
      socketRef.current?.off("deleted note", handleDeletedNote);
    };
  }, [data?._id, taskId, queryClient]);

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
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const status = e.target.value as TaskStatus;

    mutate({
      projectId,
      taskId,
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
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-4xl rounded-2xl bg-white p-16 shadow-xl">
                <p className="text-sm text-slate-400">
                  Agregada el: {formatDate(data.createdAt)}
                </p>
                <p className="text-sm text-slate-400">
                  Última actualización: {formatDate(data.updatedAt)}
                </p>

                <Dialog.Title className="font-black text-4xl text-slate-600 my-5">
                  {data.name}
                </Dialog.Title>

                <p className="text-lg mb-4">
                  <span className="font-bold text-slate-500">Descripción:</span>{" "}
                  {data.description}
                </p>

                {data.completedBy.length > 0 && (
                  <>
                    <p className="font-bold text-2xl my-6 text-slate-600">
                      Historial de Cambios
                    </p>
                    <ul className="list-decimal pl-5 space-y-2">
                      {data.completedBy.map((log) => (
                        <li key={log._id}>
                          <span className="font-bold text-slate-500">
                            {statusTranslations[log.status]} por{" "}
                          </span>
                          {log.user.name} - {log.user.email}
                        </li>
                      ))}
                    </ul>
                  </>
                )}

                <div className="my-6 space-y-2">
                  <label className="font-bold">Estado actual</label>
                  <select
                    onChange={handleChange}
                    defaultValue={data.status}
                    className="w-full p-3 border border-gray-300"
                  >
                    {Object.entries(statusTranslations).map(
                      ([key, value]) => (
                        <option key={key} value={key}>
                          {value}
                        </option>
                      )
                    )}
                  </select>
                </div>

                <NotesPanel notes={data.notes} />
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
