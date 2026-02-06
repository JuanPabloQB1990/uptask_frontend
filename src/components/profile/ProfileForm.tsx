import { useForm } from "react-hook-form";
import ErrorMessage from "../ErrorMessage";
import { User, UserProfileForm } from "@/types/index";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProfile } from "@/api/ProfileApi";
import { toast } from "react-toastify";

type ProfileFormProps = {
  data: User;
};

export default function ProfileForm({ data }: ProfileFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserProfileForm>({ defaultValues: data });

  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: updateProfile,
    onError: (error) => toast.error(error.message),
    onSuccess: (data) => {
      toast.success(data?.message);
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });

  const handleEditProfile = (formData: UserProfileForm) => mutate(formData);

  return (
    <>
      <div className="mx-auto max-w-3xl px-5">
        {/* Títulos responsivos: de 3xl en móvil a 5xl en desktop */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-800">
          Mi Perfil
        </h1>
        <p className="text-lg sm:text-xl lg:text-2xl font-light text-gray-500 mt-3 sm:mt-5">
          Aquí puedes actualizar tu información
        </p>

        <form
          onSubmit={handleSubmit(handleEditProfile)}
          className="mt-10 lg:mt-14 space-y-5 bg-white shadow-lg p-6 sm:p-10 rounded-xl border border-gray-100"
          noValidate
        >
          <div className="mb-5 space-y-3">
            <label
              className="text-xs sm:text-sm uppercase font-bold text-slate-600"
              htmlFor="name"
            >
              Nombre
            </label>
            <input
              id="name"
              type="text"
              placeholder="Tu Nombre"
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent outline-none transition-all"
              {...register("name", {
                required: "Nombre de usuario es obligatorio",
              })}
            />
            {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
          </div>

          <div className="mb-5 space-y-3">
            <label
              className="text-xs sm:text-sm uppercase font-bold text-slate-600"
              htmlFor="email"
            >
              E-mail
            </label>
            <input
              id="email"
              type="email"
              placeholder="Tu Email"
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent outline-none transition-all"
              {...register("email", {
                required: "EL e-mail es obligatorio",
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: "E-mail no válido",
                },
              })}
            />
            {errors.email && (
              <ErrorMessage>{errors.email.message}</ErrorMessage>
            )}
          </div>

          <input
            type="submit"
            value="Guardar Cambios"
            className="bg-fuchsia-600 w-full p-3 text-white uppercase font-bold hover:bg-fuchsia-700 cursor-pointer transition-colors rounded-lg mt-5 shadow-md hover:shadow-lg text-sm sm:text-base"
          />
        </form>
      </div>
    </>
  );
}
