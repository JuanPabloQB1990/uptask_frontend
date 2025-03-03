import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useNavigate, useParams } from 'react-router-dom';
import { Task, TaskFormData } from '@/types/index';
import { useForm } from 'react-hook-form';
import TaskForm from './TaskForm';
import { toast } from 'react-toastify';
import { updateTaskById } from '@/api/TaskApi';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import io from "socket.io-client";

type EditTaskModalProps = {
    task: Task
    taskId: Task["_id"]
}

export default function EditTaskModal({task, taskId} : EditTaskModalProps) {
    const navigate = useNavigate()

    const params = useParams()
    const projectId = params.projectId!

    const [socket, setSocket] = useState(io(import.meta.env.VITE_API_URL_SOCKET));

    const { register, handleSubmit, reset, formState: {errors} } = useForm<TaskFormData>({defaultValues : {
        name: task.name,
        description: task.description
    }})

    const queryClient = useQueryClient()
    const { mutate } = useMutation({
        mutationFn: updateTaskById,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({queryKey: ["project", projectId]}) // realizar un refresh de la consulta para actualizar datos
            queryClient.invalidateQueries({queryKey: ["task", taskId]}) // realizar un refresh de la consulta para actualizar datos
            toast.success(data?.message)
            reset()
            navigate(location.pathname, {replace: true})

            // emitir a socket.io backend
            socket.emit("edit task", task)
        }
    })

    const handleEditTask = (formData : TaskFormData) => {
        const data = {
            projectId,
            taskId,
            formData
        }
        mutate(data)
    }

    return (
        <Transition appear show={true} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={() => {navigate(location.pathname, {replace: true})} }>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/60" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all p-16">
                                <Dialog.Title
                                    as="h3"
                                    className="font-black text-4xl  my-5"
                                >
                                    Editar Tarea
                                </Dialog.Title>

                                <p className="text-xl font-bold">Realiza cambios a una tarea en {''}
                                    <span className="text-fuchsia-600">este formulario</span>
                                </p>

                                <form
                                    className="mt-10 space-y-3"
                                    noValidate
                                    onSubmit={handleSubmit(handleEditTask)}
                                >
                    
                                    <TaskForm register={register} errors={errors}/>
                    
                                    <input
                                        type="submit"
                                        className=" bg-fuchsia-600 hover:bg-fuchsia-700 w-full p-3  text-white font-black  text-xl cursor-pointer"
                                        value='Guardar Cambios'
                                    />
                                </form>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    )
}