import { deleteNote } from "@/api/NoteApi";
import { useAuth } from "@/hooks/useAuth";
import { Note } from "@/types/index";
import { formatDate } from "@/utils/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { useLocation, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getSocket } from "@/lib/socket";

type NoteDetailsProps = {
  note: Note;
};

const NoteDetails = ({ note }: NoteDetailsProps) => {
  /* -------------------- SOCKET (Singleton) -------------------- */
  const socket = getSocket();

  const params = useParams();
  const projectId = params.projectId!;

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const taskId = queryParams.get("viewTask")!;

  const queryClient = useQueryClient();

  const { data, isLoading } = useAuth();

  const canDelete = useMemo(
    () => data?._id === note.createdBy._id,
    [data?._id, note.createdBy._id],
  );

  const { mutate } = useMutation({
    mutationFn: deleteNote,
    onError: (error) => toast.error(error.message),
    onSuccess: (data) => {
      toast.success(data?.message);

      queryClient.invalidateQueries({
        queryKey: ["task", taskId],
      });

      // 🔌 emitir evento socket
      socket.emit("delete note", taskId);
    },
  });

  const handleDeleteNote = (noteId: Note["_id"]) => {
    mutate({ projectId, taskId, noteId });
  };

  if (isLoading) return "Cargando...";

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 hover:bg-gray-50 transition-colors rounded-lg">
      <div className="flex-1 min-w-0">
        <p className="text-slate-700 break-words">
          <span className="text-slate-800">{note.content}</span>
        </p>

        <div className="flex flex-wrap items-center gap-2 mt-2">
          <p className="text-xs font-bold text-fuchsia-600 bg-fuchsia-50 px-2 py-0.5 rounded-full">
            {note.createdBy.name}
          </p>
          <p className="text-xs text-slate-500">{formatDate(note.createdAt)}</p>
        </div>
      </div>

      {canDelete && (
        <button
          type="button"
          onClick={() => handleDeleteNote(note._id)}
          className="w-full sm:w-auto bg-red-100 hover:bg-red-500 text-red-600 hover:text-white px-3 py-1.5 text-xs font-bold rounded-md transition-all flex justify-center items-center gap-1"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-3 h-3"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
            />
          </svg>
          Eliminar
        </button>
      )}
    </div>
  );
};

export default NoteDetails;
