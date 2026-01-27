import {
  deleteMemberProjectTeamById,
  getMembersProjectTeam,
} from "@/api/TeamApi";
import AddMemberModal from "@/components/team/AddMemberModal";
import { Project, User } from "@/types/index";
import { Menu, Transition } from "@headlessui/react";
import { EllipsisVerticalIcon } from "@heroicons/react/20/solid";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Fragment, useEffect, useRef, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import io, { Socket } from "socket.io-client";

const ProjectTeamView = () => {
  
  const socketRef = useRef<Socket | null>(null);
  const [userId, setUserId] = useState("");

  const navigate = useNavigate();
  const params = useParams();
  const projectId = params.projectId!;

  const queryClient = useQueryClient();

  useEffect(() => {
    socketRef.current = io(import.meta.env.VITE_API_URL_SOCKET);

    const handleMemberDeleted = () => {
      queryClient.invalidateQueries({ queryKey: ["projectTeam", projectId] });
    };

    socketRef.current.on("member deleted", handleMemberDeleted);

    return () => {
      socketRef.current?.off("member deleted", handleMemberDeleted);
      socketRef.current?.disconnect();
    };
  }, [projectId, queryClient]);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["projectTeam", projectId],
    queryFn: () => getMembersProjectTeam(projectId),
    refetchOnWindowFocus: false,
    retry: true,
  });

  const { mutate } = useMutation({
    mutationFn: deleteMemberProjectTeamById,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      toast.success(data?.message);
      queryClient.invalidateQueries({ queryKey: ["projectTeam", projectId] });

      // emitir a socket.io backend
      socketRef.current?.emit("delete member", userId);
      setUserId("");
    },
  });

  const handleDeleteMember = (
    projectId: Project["_id"],
    userId: User["_id"],
  ) => {
    setUserId(userId);
    mutate({ projectId, userId });
  };

  if (error?.message === "Token no Valido")
    return <Navigate to="/auth/login" />;
  if (isLoading) return <p>Cargando...</p>;
  if (isError) return <Navigate to="/404" />;

  if (data)
    return (
      <div>
        <h1 className="text-5xl font-black">Administrar Equipo</h1>
        <p className="text-2xl font-light text-gray-500 mt-5">
          Administra tu equipo de trabajo para este proyecto
        </p>
        <nav className="my-5 flex gap-3">
          <button
            type="button"
            className="bg-purple-400 hover:bg-purple-500 px-10 py-3 text-white text-xl font-bold cursor-pointer transition-colors"
            onClick={() => navigate(location.pathname + "?addMember=true")}
          >
            Agregar Colaborador
          </button>
          <Link
            className="bg-fuchsia-600 hover:bg-purple-700 px-10 py-3 text-white text-xl font-bold cursor-pointer transition-colors"
            to={`/projects/${projectId}`}
          >
            Volver al proyecto
          </Link>
        </nav>
        <h2 className="text-5xl font-black my-10">Miembros actuales</h2>
        {data.length ? (
          <ul
            role="list"
            className="divide-y divide-gray-100 border border-gray-100 mt-10 bg-white shadow-lg"
          >
            {data?.map((member) => (
              <li
                key={member._id}
                className="flex justify-between gap-x-6 px-5 py-10"
              >
                <div className="flex min-w-0 gap-x-4">
                  <div className="min-w-0 flex-auto space-y-2">
                    <p className="text-2xl font-black text-gray-600">
                      {member.name}
                    </p>
                    <p className="text-sm text-gray-400">{member.email}</p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-x-6">
                  <Menu as="div" className="relative flex-none">
                    <Menu.Button className="-m-2.5 block p-2.5 text-gray-500 hover:text-gray-900">
                      <span className="sr-only">opciones</span>
                      <EllipsisVerticalIcon
                        className="h-9 w-9"
                        aria-hidden="true"
                      />
                    </Menu.Button>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                        <Menu.Item>
                          <button
                            onClick={() =>
                              handleDeleteMember(projectId, member._id)
                            }
                            type="button"
                            className="block px-3 py-1 text-sm leading-6 text-red-500"
                          >
                            Eliminar del Proyecto
                          </button>
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center py-20">No hay miembros en este equipo</p>
        )}
        <AddMemberModal />
      </div>
    );
};

export default ProjectTeamView;
