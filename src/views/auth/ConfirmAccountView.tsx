import { confirmAccount } from "@/api/AuthApi";
import { ConfirmToken } from "@/types/index";
import { PinInput, PinInputField } from "@chakra-ui/pin-input";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function ConfirmAccountView() {
    const [token, setToken] = useState<ConfirmToken["token"]>("");

    const navigate = useNavigate()

    const { mutate } = useMutation({
        mutationFn: confirmAccount,
        onError: (error) => {
            toast.error(error.message);
        },
        onSuccess: (data) => {
            toast.success(data?.message)
            navigate("/auth/login")
        }
      })

    const handleChange = (token: ConfirmToken["token"]) => setToken(token)

    const handleCompleted = (token: ConfirmToken["token"]) =>  mutate({token})
  return (
   <>
  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white text-center">
    Confirma tu Cuenta
  </h1>

  <p className="text-base sm:text-lg lg:text-2xl font-light text-white mt-4 sm:mt-5 text-center">
    Ingresa el código que recibiste{" "}
    <span className="text-fuchsia-500 font-bold">por e-mail</span>
  </p>

  <form
    className="space-y-6 sm:space-y-8 p-6 sm:p-8 lg:p-10 bg-white mt-8 sm:mt-10 rounded-xl shadow-lg"
  >
    <label className="font-normal text-lg sm:text-xl lg:text-2xl text-center block">
      Código de 6 dígitos
    </label>

    <div className="flex justify-center gap-2 sm:gap-4">
      <PinInput
        value={token}
        onChange={handleChange}
        onComplete={handleCompleted}
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <PinInputField
            key={i}
            className="
              w-10 h-10 
              sm:w-12 sm:h-12 
              lg:w-14 lg:h-14
              text-center text-lg sm:text-xl
              rounded-lg border border-gray-300
              focus:outline-none focus:ring-2 focus:ring-fuchsia-500
            "
          />
        ))}
      </PinInput>
    </div>
  </form>

  <nav className="mt-8 sm:mt-10 flex flex-col space-y-4">
    <Link
      to="/auth/new-code"
      className="text-center text-gray-300 hover:text-white transition-colors text-sm sm:text-base"
    >
      Solicitar un nuevo Código
    </Link>
  </nav>
</>

  )
}