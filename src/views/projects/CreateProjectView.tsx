import ProjectForm from "@/components/projects/ProjectForm";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { ProjectFormData } from "@/types/index";
import { createProject } from "@/api/ProjectApi";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";

const CreateProjectView = () => {
  const navigate = useNavigate();

  const initialValues: ProjectFormData = {
    projectName: "",
    clientName: "",
    description: "",
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: initialValues });

  const { mutate } = useMutation({
    mutationFn: createProject,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      toast.success(data.message);
      navigate("/");
    },
  });

  const handleFormCreateProject = (formData: ProjectFormData) =>
    mutate(formData);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-0">
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black">
        Crear Proyecto
      </h1>

      <p className="text-lg sm:text-xl lg:text-2xl font-light text-gray-500 mt-3 sm:mt-5">
        Llena el siguiente formulario para crear un Proyecto
      </p>

      <nav className="my-5">
        <Link
          className="
        inline-block
        w-full sm:w-auto
        text-center
        bg-purple-400 hover:bg-purple-500
        px-6 sm:px-10
        py-3
        text-base sm:text-xl
        text-white
        font-bold
        cursor-pointer
        rounded-lg
        transition-colors
      "
          to="/"
        >
          Volver a Proyectos
        </Link>
      </nav>

      <form
        className="
      mt-8 sm:mt-10
      bg-white
      shadow-lg
      p-5 sm:p-8 lg:p-10
      rounded-lg
    "
        onSubmit={handleSubmit(handleFormCreateProject)}
        noValidate
      >
        <ProjectForm register={register} errors={errors} />

        <input
          type="submit"
          value="Crear Proyecto"
          className="
        bg-fuchsia-600 hover:bg-fuchsia-700
        w-full
        p-3 sm:p-4
        text-white
        uppercase
        font-bold
        cursor-pointer
        rounded-lg
        transition-colors
        mt-5
      "
        />
      </form>
    </div>
  );
};

export default CreateProjectView;
