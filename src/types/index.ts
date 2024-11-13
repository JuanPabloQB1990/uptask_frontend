import { z } from "zod"

/**Tasks */
export const taskStatusSchema = z.enum(["Pendiente", "Espera", "Progreso", "Revision", "Completada"])

export const taskChema = z.object({
    _id : z.string(),
    name: z.string(),
    description: z.string(),
    project: z.string(),
    status: taskStatusSchema,
    createdAt: z.string(),
    updatedAt: z.string()
})

export type Task = z.infer<typeof taskChema>
export type TaskFormData = Pick<Task, "name" | "description">

/** Projects */
export const projectSchema = z.object({
    _id: z.string(),
    projectName: z.string(),
    clientName: z.string(),
    description: z.string(),
})

export const dashboardProjectSchema = z.array(
    projectSchema.pick({
        _id: true,
        projectName: true,
        clientName: true,
        description: true,
    })
)

export type Project = z.infer<typeof projectSchema>
export type ProjectFormData = Pick<Project, "clientName" | "projectName" | "description">

/** Response type */
export type ResponseQuery = {
    message: string
}