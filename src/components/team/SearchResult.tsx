import { addMemberToProject } from "@/api/TeamApi";
import { TeamMember } from "@/types/index";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getSocket } from "@/lib/socket"; // 👈 Singleton

type SearchResultProps = {
  user: TeamMember;
  reset: () => void;
};

const SearchResult = ({ user, reset }: SearchResultProps) => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();

  /* -------------------- SOCKET -------------------- */
  const socket = getSocket(); // ✅ conexión única

  /* -------------------- MUTATION -------------------- */
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: addMemberToProject,
    onError: (error: Error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      toast.success(data?.message);
      reset();
      navigate(location.pathname, { replace: true });

      queryClient.invalidateQueries({
        queryKey: ["projectTeam", projectId],
      });

      // 🔥 emitir evento al backend
      socket.emit("new member", {
        userId: user._id,
        project: projectId,
      });
    },
  });

  const handleAddUserToProject = () => {
    mutate({ projectId: projectId!, id: user._id });
  };

  return (
    <div className="mt-8 sm:mt-10">
      <p className="text-center font-bold text-base sm:text-lg mb-4">
        Resultado:
      </p>

      <div
        className="
      flex flex-col sm:flex-row
      items-start sm:items-center
      justify-between
      gap-4
      bg-white
      border
      rounded-xl
      p-4 sm:p-6
      shadow-sm
    "
      >
        <p className="text-base sm:text-lg font-medium text-gray-800">
          {user.name}
        </p>

        <button
          onClick={handleAddUserToProject}
          className="
        w-full sm:w-auto
        text-purple-600
        hover:text-purple-800
        bg-purple-50 hover:bg-purple-100
        px-6 sm:px-10
        py-3
        font-bold
        rounded-lg
        transition-colors
        cursor-pointer
      "
        >
          Agregar
        </button>
      </div>
    </div>
  );
};

export default SearchResult;
