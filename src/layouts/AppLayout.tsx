import { Link, Navigate, Outlet } from "react-router-dom";
import Logo from "@/components/Logo";
import NavMenu from "@/components/NavMenu";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "@/hooks/useAuth";

const AppLayout = () => {
  const { data, isLoading, isError } = useAuth();

  if (isLoading) return "Loading...";
  if (isError) return <Navigate to="/auth/login" />;

  if (data)
    return (
      <>
        <header className="bg-gray-800">
          <div className="max-w-screen-2xl mx-auto px-4 py-4 gap-4 flex flex-row items-center justify-between">
          <div className="w-64 sm:self-stretch">
            <Link to="/" >
              <Logo />
            </Link>

          </div>

            <NavMenu name={data.name} />
          </div>
        </header>

        <main className="max-w-screen-2xl mx-auto p-4 sm:p-6 mt-6">
          <Outlet />
        </main>

        <footer className="py-6 mt-10 border-t">
          <p className="text-center text-sm text-gray-500">
            © {new Date().getFullYear()} Todos los derechos reservados
          </p>
        </footer>

        <ToastContainer pauseOnFocusLoss={false} pauseOnHover={false} />
      </>
    );
};

export default AppLayout;
