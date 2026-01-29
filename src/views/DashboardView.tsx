import { getProjects } from "@/api/ProjectApi";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Fragment, useEffect, useRef } from "react";
import { Menu, Transition } from "@headlessui/react";
import { EllipsisVerticalIcon } from "@heroicons/react/20/solid";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import DeleteProjectModal from "@/components/projects/DeleteProjectModal";
import io, { Socket } from "socket.io-client";

const DashboardView = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const socketRef = useRef<Socket | null>(null);

  const { data: user, isLoading: authLoading } = useAuth();

  const { data, isLoading, error } = useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
    enabled: !!user,
  });

  /* 🔌 Emitir cuando el usuario esté listo */
  useEffect(() => {
    socketRef.current = io(import.meta.env.VITE_API_URL_SOCKET, {
      withCredentials: true,
      transports: ["polling", "websocket"], // 👈 NO solo websocket
    });
    if (!user?._id) return;

    socketRef.current.emit("open projects", user._id);
  }, [user?._id]);

  /* 📡 Escuchar eventos */
  useEffect(() => {
    if (!user?._id) return;

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

    socketRef.current?.on("added member", handleAddedMember);
    socketRef.current?.on("deleted member", handleDeletedMember);

    return () => {
      socketRef.current?.off("added member", handleAddedMember);
      socketRef.current?.off("deleted member", handleDeletedMember);
    };
  }, [user?._id, navigate, queryClient]);

  if (isLoading || authLoading) return "Cargando...";
  if (error?.message === "Token no Valido")
    return <Navigate to="/auth/login" />;

  if (!data || !user) return null;

  return (
    <div>
      <h1 className="text-5xl font-black">Mis Proyectos</h1>
      <p className="text-2xl font-light text-gray-500 mt-5">
        Maneja y administra tus proyectos
      </p>

      <nav className="my-5">
        <Link
          className="bg-purple-400 hover:bg-purple-500 px-10 py-3 text-white text-xl font-bold cursor-pointer transition-colors"
          to="/projects/create"
        >
          Nuevo Proyecto
        </Link>
      </nav>

      {data.length ? (
        <ul className="divide-y divide-gray-100 border border-gray-100 mt-10 bg-white shadow-lg">
          {data.map((project) => (
            <li
              key={project._id}
              className="flex justify-between gap-x-6 px-5 py-10"
            >
              <div className="flex min-w-0 gap-x-4">
                <div className="min-w-0 flex-auto space-y-2">
                  <div className="mb-2">
                    {project.manager === user._id ? (
                      <p className="font-bold text-xs uppercase bg-indigo-50 text-indigo-500 border-2 border-indigo-500 rounded-lg inline-block py-1 px-5">
                        Manager
                      </p>
                    ) : (
                      <p className="font-bold text-xs uppercase bg-green-50 text-green-500 border-2 border-green-500 rounded-lg inline-block py-1 px-5">
                        Colaborador
                      </p>
                    )}
                  </div>

                  <Link
                    to={`/projects/${project._id}`}
                    className="text-gray-600 hover:underline text-3xl font-bold"
                  >
                    {project.projectName}
                  </Link>

                  <p className="text-sm text-gray-400">
                    Cliente: {project.clientName}
                  </p>
                  <p className="text-sm text-gray-400">{project.description}</p>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-x-6">
                <Menu as="div" className="relative flex-none">
                  <Menu.Button className="-m-2.5 p-2.5 text-gray-500 hover:text-gray-900">
                    <EllipsisVerticalIcon className="h-9 w-9" />
                  </Menu.Button>

                  <Transition as={Fragment}>
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-56 bg-white rounded-md shadow-lg">
                      <Menu.Item>
                        <Link
                          to={`/projects/${project._id}`}
                          className="block px-3 py-1 text-sm"
                        >
                          Ver Proyecto
                        </Link>
                      </Menu.Item>

                      {project.manager === user._id && (
                        <>
                          <Menu.Item>
                            <Link
                              to={`/projects/${project._id}/edit`}
                              className="block px-3 py-1 text-sm"
                            >
                              Editar Proyecto
                            </Link>
                          </Menu.Item>

                          <Menu.Item>
                            <button
                              className="block px-3 py-1 text-sm text-red-500"
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
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center py-20">
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
