import NewPasswordToken from "@/components/auth/NewPasswordToken";
import NewPasswordFormu from "@/components/auth/NewPasswordFormu";
import { useState } from "react";
import { ConfirmToken } from "@/types/index";

const NewPasswordView = () => {

  const [isValidToken, setIsValidToken] = useState(false);
  const [token, setToken] = useState<ConfirmToken["token"]>("");

  return (
    <div>
      <h1 className="text-5xl font-black text-white">Reestablecer Password</h1>
      <p className="text-2xl font-light text-white mt-5">
        Ingresa el codigo que recibiste  {''}
        <span className=" text-fuchsia-500 font-bold"> por email</span>
      </p>
      {!isValidToken ? <NewPasswordToken token={token} setToken={setToken} setIsValidToken={setIsValidToken}/> : <NewPasswordFormu token={token}/>}
    </div>
  )
}

export default NewPasswordView