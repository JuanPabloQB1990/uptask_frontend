import {
  deleteMemberProjectTeamById,
  getMembersProjectTeam,
} from "@/api/TeamApi";
import AddMemberModal from "@/components/team/AddMemberModal";
import { Project, User } from "@/types/index";
import { Menu, Transition } from "@headlessui/react";
import { EllipsisVerticalIcon } from "@heroicons/react/20/solid";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Fragment, useEffect, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getSocket } from "@/lib/socket";

const ProjectTeamView = () => {
  const [userId, setUserId] = useState("");
  const navigate = useNavigate();
  const { projectId } = useParams();
  const queryClient = useQueryClient();

  useEffect(() => {
    getSocket(); // inicializa singleton
  }, []);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["projectTeam", projectId],
    queryFn: () => getMembersProjectTeam(projectId!),
    retry: true,
    refetchOnWindowFocus: false,
  });

  const { mutate } = useMutation({
    mutationFn: deleteMemberProjectTeamById,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      toast.success(data?.message);
      queryClient.invalidateQueries({ queryKey: ["projectTeam", projectId] });

      const socket = getSocket();
      socket.emit("delete member", { projectId, userId });

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
      <div className="space-y-6">
        {/* Título */}
        <h1
          className="
      text-3xl sm:text-4xl lg:text-5xl
      font-black
      text-gray-800
    "
        >
          Administrar Equipo
        </h1>

        {/* Descripción */}
        <p
          className="
      text-base sm:text-lg lg:text-2xl
      font-light
      text-gray-500
      leading-relaxed
    "
        >
          Administra tu equipo de trabajo para este proyecto
        </p>

        {/* Acciones */}
        <nav
          className="
      flex flex-col
      sm:flex-row
      gap-3
      sm:gap-4
      mt-4
    "
        >
          <button
            type="button"
            onClick={() => navigate(location.pathname + "?addMember=true")}
            className="
        w-full sm:w-auto
        bg-purple-500 hover:bg-purple-600
        px-6 sm:px-10
        py-3
        text-white
        text-base sm:text-lg
        font-bold
        rounded-md
        transition
      "
          >
            Agregar Colaborador
          </button>

          <Link
            to={`/projects/${projectId}`}
            className="
        w-full sm:w-auto
        text-center
        bg-fuchsia-600 hover:bg-fuchsia-700
        px-6 sm:px-10
        py-3
        text-white
        text-base sm:text-lg
        font-bold
        rounded-md
        transition
      "
          >
            Volver al proyecto
          </Link>
        </nav>

        {/* Subtítulo */}
        <h2
          className="
      text-3xl sm:text-4xl lg:text-5xl
      font-black
      mt-10
    "
        >
          Miembros actuales
        </h2>

        {/* Lista de miembros */}
        {data.length ? (
          <ul
            className="
        divide-y
        divide-gray-100
        border
        bg-white
        shadow-lg
        rounded-md
      "
          >
            {data.map((member) => (
              <li
                key={member._id}
                className="
            flex 
            flex-row
            items-center
            justify-between
            gap-4
            px-5
            py-6
          "
              >
                {/* Info */}
                <div className="min-w-0">
                  <p className="text-lg sm:text-2xl font-black text-gray-600 truncate">
                    {member.name}
                  </p>
                  <p className="text-sm text-gray-400 truncate">
                    {member.email}
                  </p>
                </div>

                {/* Menu */}
                <Menu as="div" className="relative self-end sm:self-auto">
                  <Menu.Button className="p-2 text-gray-500 hover:text-gray-900">
                    <EllipsisVerticalIcon className="h-8 w-8" />
                  </Menu.Button>

                  <Transition as={Fragment}>
                    <Menu.Items
                      className="
                  absolute right-0 z-10 mt-2
                  w-56
                  rounded-md
                  bg-white
                  shadow-lg
                  ring-1 ring-black/5
                "
                    >
                      <Menu.Item>
                        <button
                          onClick={() =>
                            handleDeleteMember(projectId!, member._id)
                          }
                          className="
                      block w-full
                      px-4 py-2
                      text-sm
                      text-red-500
                      hover:bg-red-50
                      text-left
                    "
                        >
                          Eliminar del Proyecto
                        </button>
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center py-20 text-gray-500">
            No hay miembros en este equipo
          </p>
        )}

        {/* Modal */}
        <AddMemberModal />
      </div>
    );
};

export default ProjectTeamView;
