import { validateToken } from "@/api/AuthApi";
import { ConfirmToken } from "@/types/index";
import { PinInput, PinInputField } from "@chakra-ui/pin-input";
import { useMutation } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

type NewPasswordTokenProps = {
  token: ConfirmToken["token"];
  setToken: React.Dispatch<React.SetStateAction<string>>;
  setIsValidToken: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function NewPasswordToken({
  token,
  setToken,
  setIsValidToken,
}: NewPasswordTokenProps) {
  const handleChange = (token: ConfirmToken["token"]) => setToken(token);

  const { mutate } = useMutation({
    mutationFn: validateToken,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      toast.success(data?.message);
      setIsValidToken(true);
    },
  });

  const handleCompleted = (token: ConfirmToken["token"]) => mutate({ token });

  return (
    <>
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-center">
        Confirma tu Cuenta
      </h1>

      <p className="text-base sm:text-lg lg:text-2xl font-light mt-4 sm:mt-5 text-center">
        Ingresa el código que recibiste{" "}
        <span className="text-fuchsia-500 font-bold">por e-mail</span>
      </p>
      <form className="space-y-8 p-10 rounded-lg bg-white mt-10">
        <label className="font-normal text-2xl text-center block">
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
      <nav className="mt-10 flex flex-col space-y-4">
        <Link
          to="/auth/forgot-password"
          className="text-center text-gray-500 hover:text-gray-900 font-normal"
        >
          Solicitar un nuevo Código
        </Link>
      </nav>
    </>
  );
}
