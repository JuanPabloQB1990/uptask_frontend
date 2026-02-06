import Logo from "@/components/Logo";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";

const AuthLayout = () => {
  return (
    <>
      <div className="bg-gray-800 min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <Logo />
          <div className="mt-10 bg-white rounded-xl p-6 sm:p-8 shadow-lg">
            <Outlet />
          </div>
        </div>
      </div>

      <ToastContainer pauseOnFocusLoss={false} pauseOnHover={false} />
    </>
  );
};

export default AuthLayout;
