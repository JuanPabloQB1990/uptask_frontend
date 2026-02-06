import { useForm } from "react-hook-form";
import { UserLoginForm } from "@/types/index";
import ErrorMessage from "@/components/ErrorMessage";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { authenticateUser } from "@/api/AuthApi";
import { toast } from "react-toastify";

export default function LoginView() {
  const navigate = useNavigate();

  const initialValues: UserLoginForm = {
    email: "",
    password: "",
  };
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues: initialValues });

  const { mutate } = useMutation({
    mutationFn: authenticateUser,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: () => {
      toast.success("login success");
      navigate("/");
      reset();
    },
  });

  const handleLogin = (formData: UserLoginForm) => mutate(formData);

  return (
    <>
      {/* Header */}
      <header className="space-y-3">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-center">
          Iniciar Sesión
        </h1>

        <p className="text-base sm:text-lg lg:text-2xl font-light text-center">
          Comienza a planear tus proyectos{" "}
          <span className="text-fuchsia-400 font-bold block sm:inline">
            Ingresa tus datos aquí
          </span>
        </p>
      </header>

      {/* Form */}
      <form
        onSubmit={handleSubmit(handleLogin)}
        className="
      space-y-6
      p-5 sm:p-8 lg:p-10
      mt-2
      bg-white
      rounded-lg
      shadow-lg
    "
        noValidate
      >
        {/* Email */}
        <div className="flex flex-col gap-2">
          <label className="text-base sm:text-lg font-medium">Email</label>

          <input
            id="email"
            type="email"
            placeholder="Email de Registro"
            className="
          w-full
          p-3 sm:p-4
          border border-gray-300
          rounded-md
          focus:outline-none
          focus:ring-2
          focus:ring-fuchsia-500
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

        {/* Password */}
        <div className="flex flex-col gap-2">
          <label className="text-base sm:text-lg font-medium">Password</label>

          <input
            type="password"
            placeholder="Password de Registro"
            className="
          w-full
          p-3 sm:p-4
          border border-gray-300
          rounded-md
          focus:outline-none
          focus:ring-2
          focus:ring-fuchsia-500
        "
            {...register("password", {
              required: "El Password es obligatorio",
            })}
          />

          {errors.password && (
            <ErrorMessage>{errors.password.message}</ErrorMessage>
          )}
        </div>

        {/* Submit */}
        <input
          type="submit"
          value="Iniciar Sesión"
          className="
        w-full
        bg-fuchsia-600 hover:bg-fuchsia-700
        p-3 sm:p-4
        text-white
        font-black
        text-lg sm:text-xl
        rounded-md
        cursor-pointer
        transition-colors
      "
        />
      </form>

      {/* Links */}
      <nav className="mt-8 flex flex-col gap-4">
        <Link
          to="/auth/register"
          className="text-center text-gray-500 text-sm sm:text-base hover:text-gray-900 transition"
        >
          ¿No tienes cuenta? <span className="font-bold">Crea una aquí</span>
        </Link>

        <Link
          to="/auth/forgot-password"
          className="text-center text-gray-500 text-sm sm:text-base hover:text-gray-900 transition"
        >
          ¿Olvidaste tu password?{" "}
          <span className="font-bold">Reestablecer</span>
        </Link>
      </nav>
    </>
  );
}
