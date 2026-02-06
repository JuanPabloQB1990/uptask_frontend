import { useForm } from "react-hook-form";
import { UserRegistrationForm } from "@/types/index";
import ErrorMessage from "@/components/ErrorMessage";
import { Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { createAccount } from "@/api/AuthApi";
import { toast } from "react-toastify";

export default function RegisterView() {
  
  const initialValues: UserRegistrationForm = {
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  }

  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm<UserRegistrationForm>({ defaultValues: initialValues });

  const { mutate } = useMutation({
    mutationFn: createAccount,
    onError: (error) => {
        toast.error(error.message);
    },
    onSuccess: (data) => {
        toast.success(data?.message)
        reset()
    }
  })

  const password = watch('password');

  const handleRegister = (formData: UserRegistrationForm) => {
    mutate(formData)
  }

  return (
    <>
  {/* Header */}
  <header className="space-y-3">
    <h1 className="text-3xl text-center sm:text-4xl lg:text-5xl font-black">
      Crear Cuenta
    </h1>

    <p className="text-base sm:text-lg lg:text-2xl font-light text-center">
      Llena el formulario para{" "}
      <span className="text-fuchsia-400 font-bold block sm:inline">
        crear tu cuenta
      </span>
    </p>
  </header>

  {/* Form */}
  <form
    onSubmit={handleSubmit(handleRegister)}
    className="
      space-y-6
      p-5 sm:p-8 lg:p-10
      bg-white
      mt-2
      rounded-lg
      shadow-lg
    "
    noValidate
  >
    {/* Email */}
    <div className="flex flex-col gap-2">
      <label htmlFor="email" className="text-base sm:text-lg font-medium">
        Email
      </label>

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
          required: "El Email de registro es obligatorio",
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

    {/* Nombre */}
    <div className="flex flex-col gap-2">
      <label className="text-base sm:text-lg font-medium">
        Nombre
      </label>

      <input
        type="text"
        placeholder="Nombre de Registro"
        className="
          w-full
          p-3 sm:p-4
          border border-gray-300
          rounded-md
          focus:outline-none
          focus:ring-2
          focus:ring-fuchsia-500
        "
        {...register("name", {
          required: "El Nombre de usuario es obligatorio",
        })}
      />

      {errors.name && (
        <ErrorMessage>{errors.name.message}</ErrorMessage>
      )}
    </div>

    {/* Password */}
    <div className="flex flex-col gap-2">
      <label className="text-base sm:text-lg font-medium">
        Password
      </label>

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

    {/* Confirm Password */}
    <div className="flex flex-col gap-2">
      <label className="text-base sm:text-lg font-medium">
        Repetir Password
      </label>

      <input
        id="password_confirmation"
        type="password"
        placeholder="Repite Password de Registro"
        className="
          w-full
          p-3 sm:p-4
          border border-gray-300
          rounded-md
          focus:outline-none
          focus:ring-2
          focus:ring-fuchsia-500
        "
        {...register("password_confirmation", {
          required: "Repetir Password es obligatorio",
          validate: value =>
            value === password || "Los Passwords no son iguales",
        })}
      />

      {errors.password_confirmation && (
        <ErrorMessage>{errors.password_confirmation.message}</ErrorMessage>
      )}
    </div>

    {/* Submit */}
    <input
      type="submit"
      value="Registrarme"
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
      to="/auth/login"
      className="text-center text-sm sm:text-base text-gray-500 hover:text-gray-900 transition"
    >
      ¿Ya tienes cuenta? <span className="font-bold">Ingresa aquí</span>
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

  )
}