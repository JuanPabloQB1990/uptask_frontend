import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import ErrorMessage from "@/components/ErrorMessage";
import { ForgotPasswordForm } from "@/types/index";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { sendEmailForgotPassword } from "@/api/AuthApi";

export default function ForgotPasswordView() {
  const initialValues: ForgotPasswordForm = {
    email: ''
  }
  const { register, handleSubmit, reset, formState: { errors } } = useForm({ defaultValues: initialValues });

  const { mutate } = useMutation({
    mutationFn: sendEmailForgotPassword,
    onError: (error) => {
        toast.error(error.message);
    },
    onSuccess: (data) => {
        toast.success(data?.message)
        reset()
    }
  })
  
  const handleForgotPassword = (formData: ForgotPasswordForm) => mutate(formData)

  return (
    <>
  {/* Ajuste de títulos: de 3xl en móvil a 5xl en desktop */}
  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-center sm:text-left">
    Reestablece tu password
  </h1>
  <p className="text-xl sm:text-2xl font-light mt-5 text-center">
    ¿Olvidaste tu password? {''}
    <span className="text-fuchsia-500 font-bold block text-center"> Ingresa tu email</span>
  </p>

  <form
    onSubmit={handleSubmit(handleForgotPassword)}
    className="space-y-6 sm:space-y-8 p-6 sm:p-10 mt-10 bg-white rounded-xl shadow-2xl max-w-2xl mx-auto sm:mx-0"
    noValidate
  >
    <div className="flex flex-col gap-3 sm:gap-5">
      <label
        className="font-normal text-xl sm:text-2xl text-slate-700"
        htmlFor="email"
      >
        Email
      </label>
      <input
        id="email"
        type="email"
        placeholder="Email de Registro"
        className="w-full p-3 border-gray-300 border rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500 transition-all"
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

    <input
      type="submit"
      value='Enviar Instrucciones'
      className="bg-fuchsia-600 hover:bg-fuchsia-700 w-full p-3 text-white font-black text-lg sm:text-xl cursor-pointer transition-colors rounded-lg shadow-md"
    />
  </form>

  <nav className="mt-10 flex flex-col space-y-4">
    <Link
      to='/auth/login'
      className="text-center text-gray-500 font-normal hover:text-gray-900 transition-colors text-sm sm:text-base"
    >
      ¿Ya tienes cuenta? <span className="font-bold underline">Iniciar Sesión</span>
    </Link>

    <Link
      to='/auth/register'
      className="text-center text-gray-500 font-normal hover:text-gray-900 transition-colors text-sm sm:text-base"
    >
      ¿No tienes cuenta? <span className="font-bold underline">Crea una</span>
    </Link>
  </nav>
</>
  )
}