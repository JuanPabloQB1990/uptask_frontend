import { Fragment, useEffect, useState } from "react";
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
import io from "socket.io-client";

export default function TaskModalDetails() {

  const [socket, setSocket] = useState(io(import.meta.env.VITE_API_URL_SOCKET));

  const params = useParams();
  const projectId = params.projectId!;

  const navigate = useNavigate();

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const taskId = queryParams.get("viewTask")!;
  const show = taskId ? true : false;

  const { data, isError, error } = useQuery({
    queryKey: ["task", taskId],
    queryFn: () => getTaskById({ projectId, taskId }),
    enabled: !!taskId, // habilitar la funcion GetTaskById if existe el id en la url
    retry: false,
  });

  useEffect(() => {
    socket.emit("open task", taskId);
  }, []);

  useEffect(() => {
    socket.on("added note", (task) => {
      if (task === data?._id) {
        queryClient.invalidateQueries({queryKey: ["task", taskId]})
      }
    });

    socket.on("deleted note", (task) => {
      if (task === data?._id) {
        queryClient.invalidateQueries({queryKey: ["task", taskId]})
      }
    });
  });

  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: updateStatusTaskById,
    onError: (error) => {
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
    const data = {
      projectId,
      taskId,
      status,
    };
    mutate(data);
  };

  if (isError) {
    toast.error(error.message, { toastId: "error" });
    return <Navigate to={`/projects/${projectId}`} />;
  }

  if (data)
    return (
      <>
        <Transition appear show={show} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-10"
            onClose={() => {
              navigate(location.pathname, { replace: true });
            }}
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
                    <p className="text-sm text-slate-400">
                      Agregada el: {formatDate(data.createdAt)}
                    </p>
                    <p className="text-sm text-slate-400">
                      Última actualización: {formatDate(data.updatedAt)}
                    </p>
                    <Dialog.Title
                      as="h3"
                      className="font-black text-4xl text-slate-600 my-5"
                    >
                      {data.name}
                    </Dialog.Title>
                    <p className="text-lg text-black  mb-2">
                     <span className="text-slate-500 font-bold">Descripción: </span> {data.description}
                    </p>
                    {data.completedBy.length ? (
                      <>
                        <p className="font-bold text-2xl text-slate-600 my-10">
                          Historial de Cambios:
                        </p>
                        <ul className="list-decimal">
                          {data.completedBy.map((activityLog) => (
                            <li key={activityLog._id}>
                              <span className="font-bold text-slate-500">
                                {statusTranslations[activityLog.status]}{" por: "} 
                              </span>
                              {activityLog.user.name + " - " + activityLog.user.email}
                            </li>
                          ))}

                        </ul>
                      
                      </>
                    ) : null}
                    <div className="my-5 space-y-3">
                      <label className="font-bold">Estado Actual:</label>
                      <select
                        name=""
                        id=""
                        onChange={handleChange}
                        defaultValue={data.status}
                        className="w-full p-3 bg-white border border-gray-300"
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
                    <NotesPanel notes={data.notes}/>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      </>
    );
}
