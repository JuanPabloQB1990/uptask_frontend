import { getProjects } from "@/api/ProjectApi";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Fragment, useEffect } from "react";
import { Menu, Transition } from "@headlessui/react";
import { EllipsisVerticalIcon } from "@heroicons/react/20/solid";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import DeleteProjectModal from "@/components/projects/DeleteProjectModal";
import { getSocket } from "@/lib/socket";

const DashboardView = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: user, isLoading: authLoading } = useAuth();

  const { data, isLoading, error } = useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
    enabled: !!user,
  });

  /* 🔌 Inicializar socket y abrir proyectos */
  useEffect(() => {
    if (!user?._id) return;

    const socket = getSocket();
    socket.emit("open projects", user._id);
  }, [user?._id]);

  /* 📡 Escuchar eventos en tiempo real */
  useEffect(() => {
    if (!user?._id) return;

    const socket = getSocket();

    const handleEditProject = () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    };

    const handleAddedMember = (userId: string) => {
      if (user._id === userId) {
        queryClient.invalidateQueries({ queryKey: ["projects"] });
      }
    };

    const handleDeletedMember = (userId: string) => {
      if (user._id === userId) {
        queryClient.invalidateQueries({ queryKey: ["projects"] });
        navigate("/");
      }
    };

    socket.on("edited project", handleEditProject);
    socket.on("added member", handleAddedMember);
    socket.on("deleted member", handleDeletedMember);

    return () => {
      socket.off("edited project", handleEditProject);
      socket.off("added member", handleAddedMember);
      socket.off("deleted member", handleDeletedMember);
    };
  }, [user?._id, navigate, queryClient]);

  if (isLoading || authLoading) return <p>Cargando...</p>;

  if (error?.message === "Token no Valido")
    return <Navigate to="/auth/login" />;

  if (!data || !user) return null;

  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="space-y-3">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black">
          Mis Proyectos
        </h1>

        <p className="text-base sm:text-lg lg:text-2xl text-gray-500">
          Maneja y administra tus proyectos
        </p>
      </header>

      {/* Action */}
      <nav>
        <Link
          className="
        inline-block w-full sm:w-auto
        bg-purple-400 hover:bg-purple-500
        px-6 py-3
        text-white text-base sm:text-lg font-bold
        rounded-lg
        transition-colors text-center
      "
          to="/projects/create"
        >
          Nuevo Proyecto
        </Link>
      </nav>

      {/* List */}
      {data.length ? (
        <ul className="divide-y divide-gray-300 border border-gray-100 bg-white shadow-lg rounded-lg overflow-hidden">
          {data.map((project) => (
            <li
              key={project._id}
              className="
            flex flex-col sm:flex-row
            gap-6
            px-4 sm:px-6
            py-6
          "
            >
              {/* Info */}
              <div className="flex-1 space-y-3">
                {/* Role */}
                <div className="flex flex-row justify-between">
                  <div className="py-2">
                    {project.manager === user._id ? (
                      <p className="inline-block font-bold text-xs uppercase bg-indigo-50 text-indigo-500 border border-indigo-500 rounded-lg py-1 px-3">
                        Manager
                      </p>
                    ) : (
                      <p className="inline-block font-bold text-xs uppercase bg-green-50 text-green-500 border border-green-500 rounded-lg py-1 px-3">
                        Colaborador
                      </p>
                    )}
                  </div>
                  {/* Menu */}
                  <Menu as="div" className="relative self-start sm:self-center">
                    <Menu.Button className="p-2 rounded-full hover:bg-gray-100">
                      <EllipsisVerticalIcon className="h-6 w-6 text-gray-500" />
                    </Menu.Button>

                    <Transition as={Fragment}>
                      <Menu.Items className="absolute right-0 z-20 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black/5">
                        <Menu.Item>
                          <Link
                            to={`/projects/${project._id}`}
                            className="block px-4 py-2 text-sm hover:bg-gray-100"
                          >
                            Ver Proyecto
                          </Link>
                        </Menu.Item>

                        {project.manager === user._id && (
                          <>
                            <Menu.Item>
                              <Link
                                to={`/projects/${project._id}/edit`}
                                className="block px-4 py-2 text-sm hover:bg-gray-100"
                              >
                                Editar Proyecto
                              </Link>
                            </Menu.Item>

                            <Menu.Item>
                              <button
                                className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50"
                                onClick={() =>
                                  navigate(
                                    location.pathname +
                                      `?deleteProject=${project._id}`,
                                  )
                                }
                              >
                                Eliminar Proyecto
                              </button>
                            </Menu.Item>
                          </>
                        )}
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div>

                {/* Title */}
                <Link
                  to={`/projects/${project._id}`}
                  className="block text-xl sm:text-2xl lg:text-3xl font-bold text-gray-700 hover:underline break-words"
                >
                  {project.projectName}
                </Link>

                <p className="text-sm text-gray-400">
                  Cliente: {project.clientName}
                </p>

                <p className="text-sm text-gray-400 line-clamp-2">
                  {project.description}
                </p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center py-20 text-gray-500">
          No hay proyectos aún{" "}
          <Link to="/projects/create" className="text-fuchsia-500 font-bold">
            Crear Proyecto
          </Link>
        </p>
      )}

      <DeleteProjectModal />
    </div>
  );
};

export default DashboardView;
