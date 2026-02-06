import { FieldErrors, UseFormRegister } from "react-hook-form";
import ErrorMessage from "../ErrorMessage";
import { ProjectFormData } from "types";

type ProjectFormProps = {
  register: UseFormRegister<ProjectFormData>;
  errors: FieldErrors<ProjectFormData>;
};

export default function ProjectForm({ errors, register }: ProjectFormProps) {
  return (
    <>
      {/* Nombre del Proyecto */}
      <div className="mb-6 space-y-2">
        <label
          htmlFor="projectName"
          className="text-xs sm:text-sm uppercase font-bold text-gray-600"
        >
          Nombre del Proyecto
        </label>

        <input
          id="projectName"
          type="text"
          placeholder="Nombre del Proyecto"
          className="
        w-full
        p-3 sm:p-4
        border border-gray-300
        rounded-md
        text-sm sm:text-base
        focus:outline-none
        focus:ring-2
        focus:ring-fuchsia-500
      "
          {...register("projectName", {
            required: "El Titulo del Proyecto es obligatorio",
          })}
        />

        {errors.projectName && (
          <ErrorMessage>{errors.projectName.message}</ErrorMessage>
        )}
      </div>

      {/* Nombre del Cliente */}
      <div className="mb-6 space-y-2">
        <label
          htmlFor="clientName"
          className="text-xs sm:text-sm uppercase font-bold text-gray-600"
        >
          Nombre Cliente
        </label>

        <input
          id="clientName"
          type="text"
          placeholder="Nombre del Cliente"
          className="
        w-full
        p-3 sm:p-4
        border border-gray-300
        rounded-md
        text-sm sm:text-base
        focus:outline-none
        focus:ring-2
        focus:ring-fuchsia-500
      "
          {...register("clientName", {
            required: "El Nombre del Cliente es obligatorio",
          })}
        />

        {errors.clientName && (
          <ErrorMessage>{errors.clientName.message}</ErrorMessage>
        )}
      </div>

      {/* Descripción */}
      <div className="mb-6 space-y-2">
        <label
          htmlFor="description"
          className="text-xs sm:text-sm uppercase font-bold text-gray-600"
        >
          Descripción
        </label>

        <textarea
          id="description"
          rows={4}
          placeholder="Descripción del Proyecto"
          className="
        w-full
        p-3 sm:p-4
        border border-gray-300
        rounded-md
        text-sm sm:text-base
        resize-none
        focus:outline-none
        focus:ring-2
        focus:ring-fuchsia-500
      "
          {...register("description", {
            required: "Una descripción del proyecto es obligatoria",
          })}
        />

        {errors.description && (
          <ErrorMessage>{errors.description.message}</ErrorMessage>
        )}
      </div>
    </>
  );
}
