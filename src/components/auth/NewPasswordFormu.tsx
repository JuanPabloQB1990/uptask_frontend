import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import ErrorMessage from "@/components/ErrorMessage";
import { useMutation } from "@tanstack/react-query";
import { updatePassword } from "@/api/AuthApi";
import { toast } from "react-toastify";
import { ConfirmToken, NewPasswordForm } from "@/types/index";

type NewPasswordTokenProps = {
  token: ConfirmToken["token"];
};

export default function NewPasswordFormu({ token }: NewPasswordTokenProps) {
  const navigate = useNavigate();

  const initialValues: NewPasswordForm = {
    password: "",
    password_confirmation: "",
  };
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({ defaultValues: initialValues });

  const { mutate } = useMutation({
    mutationFn: updatePassword,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      toast.success(data?.message);
      reset();
      navigate("/auth/login");
    },
  });

  const handleNewPassword = (formData: NewPasswordForm) =>
    mutate({ formData, token });

  const password = watch("password");

  return (
    <>
      {/* Título responsivo: text-3xl en móvil hasta text-5xl en desktop */}
      <h1 className="text-3xl text-center sm:text-4xl lg:text-5xl font-black sm:text-left leading-tight">
        Reestablecer Password
      </h1>

      <p className="text-lg sm:text-xl lg:text-2xl font-light mt-4 text-center sm:text-left">
        Ingresa tu nueva contraseña en{""}
        <span className="text-fuchsia-500 font-bold block sm:inline">
          {" "}
          este formulario.
        </span>
      </p>
      <form
        onSubmit={handleSubmit(handleNewPassword)}
        className="space-y-6 sm:space-y-8 p-5 sm:p-10 bg-white mt-10 shadow-lg rounded-lg max-w-2xl mx-auto"
        noValidate
      >
        <div className="flex flex-col gap-3 sm:gap-5">
          <label className="font-normal text-xl sm:text-2xl text-slate-700">
            Password
          </label>

          <input
            type="password"
            placeholder="Password de Registro"
            className="w-full p-3 border-gray-300 border rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500 transition-all"
            {...register("password", {
              required: "El Password es obligatorio",
              minLength: {
                value: 8,
                message: "El Password debe ser mínimo de 8 caracteres",
              },
            })}
          />
          {errors.password && (
            <ErrorMessage>{errors.password.message}</ErrorMessage>
          )}
        </div>

        <div className="flex flex-col gap-3 sm:gap-5">
          <label className="font-normal text-xl sm:text-2xl text-slate-700">
            Repetir Password
          </label>

          <input
            id="password_confirmation"
            type="password"
            placeholder="Repite Password de Registro"
            className="w-full p-3 border-gray-300 border rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500 transition-all"
            {...register("password_confirmation", {
              required: "Repetir Password es obligatorio",
              validate: (value) =>
                value === password || "Los Passwords no son iguales",
            })}
          />

          {errors.password_confirmation && (
            <ErrorMessage>{errors.password_confirmation.message}</ErrorMessage>
          )}
        </div>

        <input
          type="submit"
          value="Establecer Password"
          className="bg-fuchsia-600 hover:bg-fuchsia-700 w-full p-3 text-white font-black text-lg sm:text-xl cursor-pointer transition-colors rounded-lg shadow-md"
        />
      </form>

      <nav className="mt-10 flex flex-col space-y-4">
        <Link
          to="/auth/forgot-password"
          className="text-center text-gray-500 font-normal hover:text-gray-900 transition-colors text-sm sm:text-base"
        >
          ¿Problemas con el código?{" "}
          <span className="font-bold">Solicitar uno nuevo</span>
        </Link>
      </nav>
    </>
  );
}
