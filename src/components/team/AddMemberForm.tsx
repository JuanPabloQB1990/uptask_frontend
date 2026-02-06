import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import ErrorMessage from "../ErrorMessage";
import { TeamMemberForm } from "@/types/index";
import { findUserByEmail } from "@/api/TeamApi";
import SearchResult from "./SearchResult";

export default function AddMemberForm() {
  const initialValues: TeamMemberForm = {
    email: "",
  };
  const params = useParams();
  const projectId = params.projectId!;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues: initialValues });

  const mutation = useMutation({
    mutationFn: findUserByEmail,
  });

  const handleSearchUser = async (formData: TeamMemberForm) => {
    const data = {
      projectId,
      formData,
    };

    mutation.mutate(data);
  };

  const resetData = () => {
    reset();
    mutation.reset();
  };

  return (
    <>
      <form
        className="mt-6 sm:mt-10 space-y-4 sm:space-y-5"
        onSubmit={handleSubmit(handleSearchUser)}
        noValidate
      >
        <div className="flex flex-col gap-2 sm:gap-3">
          <label
            className="font-normal text-lg sm:text-xl lg:text-2xl"
            htmlFor="name"
          >
            E-mail de Usuario
          </label>

          <input
            id="name"
            type="text"
            placeholder="E-mail del usuario a Agregar"
            className="
          w-full
          px-3 py-3 sm:py-4
          text-base sm:text-lg
          border border-gray-300 rounded-lg
          focus:outline-none focus:ring-2 focus:ring-fuchsia-500
        "
            {...register("email", {
              required: "El Email es obligatorio",
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: "E-mail no válido",
              },
            })}
          />

          {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
        </div>

        <input
          type="submit"
          value="Buscar Usuario"
          className="
        w-full
        bg-fuchsia-600 hover:bg-fuchsia-700
        py-3 sm:py-4
        text-white font-black
        text-lg sm:text-xl
        rounded-lg
        cursor-pointer
        transition-colors
      "
        />
      </form>

      <div className="mt-6 sm:mt-10 space-y-3">
        {mutation.isPending && (
          <p className="text-center text-sm sm:text-base">Cargando...</p>
        )}

        {mutation.error && (
          <p className="text-center text-sm sm:text-base text-red-600">
            {mutation.error.message}
          </p>
        )}

        {mutation.data && (
          <SearchResult user={mutation.data} reset={resetData} />
        )}
      </div>
    </>
  );
}
