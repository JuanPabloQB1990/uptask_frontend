import NewPasswordToken from "@/components/auth/NewPasswordToken";
import NewPasswordFormu from "@/components/auth/NewPasswordFormu";
import { useState } from "react";
import { ConfirmToken } from "@/types/index";

const NewPasswordView = () => {
  const [isValidToken, setIsValidToken] = useState(false);
  const [token, setToken] = useState<ConfirmToken["token"]>("");

  return (
    <div className="px-4 sm:px-0">
      

      {/* Contenedor del contenido dinámico con margen superior adaptativo */}
      <div className="mt-8 sm:mt-10 lg:mt-12">
        {!isValidToken ? (
          <NewPasswordToken
            token={token}
            setToken={setToken}
            setIsValidToken={setIsValidToken}
          />
        ) : (
          <NewPasswordFormu token={token} />
        )}
      </div>
    </div>
  );
};

export default NewPasswordView;
