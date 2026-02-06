import { useForm } from "react-hook-form"
import ErrorMessage from "@/components/ErrorMessage"
import { UpdateCurrentPasswordForm } from "@/types/index";
import { useMutation } from "@tanstack/react-query";
import { changePassword } from "@/api/ProfileApi";
import { toast } from "react-toastify";

export default function ChangePasswordView() {
  const initialValues : UpdateCurrentPasswordForm = {
    current_password: '',
    password: '',
    password_confirmation: ''
  }

  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm({ defaultValues: initialValues })

  const  { mutate } = useMutation({
    mutationFn: changePassword,
    onError: (error) => toast.error(error.message),
    onSuccess: (data) => {
      toast.success(data?.message);
      reset()
    }
  })

  const password = watch('password');

  const handleChangePassword = (formData : UpdateCurrentPasswordForm) => mutate(formData)

  return (
    <>
  <div className="mx-auto max-w-3xl px-5">
    {/* Ajuste de tamaño de fuente responsivo para el título */}
    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-800">
      Cambiar Password
    </h1>
    <p className="text-lg sm:text-xl lg:text-2xl font-light text-gray-500 mt-3 sm:mt-5">
      Utiliza este formulario para cambiar tu password
    </p>

    <form
      onSubmit={handleSubmit(handleChangePassword)}
      className="mt-10 lg:mt-14 space-y-5 bg-white shadow-lg p-6 sm:p-10 rounded-xl border border-gray-100"
      noValidate
    >
      {/* Password Actual */}
      <div className="mb-5 space-y-3">
        <label
          className="text-xs sm:text-sm uppercase font-bold text-slate-600"
          htmlFor="current_password"
        >
          Password Actual
        </label>
        <input
          id="current_password"
          type="password"
          placeholder="Password Actual"
          className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent outline-none transition-all"
          {...register("current_password", {
            required: "El password actual es obligatorio",
          })}
        />
        {errors.current_password && (
          <ErrorMessage>{errors.current_password.message}</ErrorMessage>
        )}
      </div>

      {/* Nuevo Password */}
      <div className="mb-5 space-y-3">
        <label
          className="text-xs sm:text-sm uppercase font-bold text-slate-600"
          htmlFor="password"
        >
          Nuevo Password
        </label>
        <input
          id="password"
          type="password"
          placeholder="Nuevo Password"
          className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent outline-none transition-all"
          {...register("password", {
            required: "El Nuevo Password es obligatorio",
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

      {/* Repetir Password */}
      <div className="mb-8 space-y-3">
        <label
          htmlFor="password_confirmation"
          className="text-xs sm:text-sm uppercase font-bold text-slate-600"
        >
          Repetir Password
        </label>

        <input
          id="password_confirmation"
          type="password"
          placeholder="Repetir Password"
          className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent outline-none transition-all"
          {...register("password_confirmation", {
            required: "Este campo es obligatorio",
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
        value="Cambiar Password"
        className="bg-fuchsia-600 w-full p-3 text-white uppercase font-bold hover:bg-fuchsia-700 cursor-pointer transition-colors rounded-lg shadow-md hover:shadow-lg text-sm sm:text-base"
      />
    </form>
  </div>
</>
  )
}