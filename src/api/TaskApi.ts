import api from "@/lib/axios";
import { isAxiosError } from "axios";
import { Project, ResponseQuery, Task, taskChema, TaskFormData } from "@/types/index";

type TaskAPI = {
    formData: TaskFormData
    projectId: Project["_id"]
    taskId: Task["_id"]
    status: Task["status"]
}

export const createTask = async({formData, projectId} : Pick<TaskAPI, 'formData' | 'projectId'>) => {
   
    try {
        const { data } = await api.post<ResponseQuery>(`/projects/${projectId}/tasks`, formData)
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}

export const getTaskById = async({projectId, taskId} : Pick<TaskAPI, 'projectId' | 'taskId'>) => {
    try {
        const url = `/projects/${projectId}/tasks/${taskId}`
        const { data } = await api.get(url)
        
        const response = taskChema.safeParse(data)
        if (response.success) return response.data
        
        
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}

export const updateTaskById = async({projectId, taskId, formData} : Pick<TaskAPI, 'projectId' | 'taskId' | 'formData'>) => {
    try {
        const url = `/projects/${projectId}/tasks/${taskId}`
        const { data } = await api.put<ResponseQuery>(url, formData)
        return data
        
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}

export const deleteTaskById = async({projectId, taskId} : Pick<TaskAPI, 'projectId' | 'taskId'>) => {
    try {
        const url = `/projects/${projectId}/tasks/${taskId}`
        const { data } = await api.delete<ResponseQuery>(url)
        return data
        
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}

//http://localhost:4000/api/projects/672c18703fa9002ec520f07f/tasks/672c372250d772b99f232051/status
export const updateStatusTaskById = async({projectId, taskId, status} : Pick<TaskAPI, 'projectId' | 'taskId' | 'status'>) => {
    try {
        const url = `/projects/${projectId}/tasks/${taskId}/status`
        const { data } = await api.post<ResponseQuery>(url, {status})
        return data
        
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}