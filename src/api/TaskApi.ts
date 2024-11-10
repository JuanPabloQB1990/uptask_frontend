import api from "@/lib/axios";
import { isAxiosError } from "axios";
import { Project, ResponseQuery, TaskFormData } from "@/types/index";

type TaskAPI = {
    formData: TaskFormData
    projectId: Project["_id"]
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