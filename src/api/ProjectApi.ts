import { dashboardProjectSchema, Project, ProjectFormData, ResponseQuery } from "@/types/index";
import api from "@/lib/axios";
import { isAxiosError } from "axios";

export const createProject = async(formData : ProjectFormData) => {
   
    try {
        const { data } = await api.post("/projects", formData)
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}

export const getProjects = async() => {

    try {
        const { data } = await api("/projects")
        const response = dashboardProjectSchema.safeParse(data)
        
        if(response.success) return response.data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}

export const getProjectById = async(id : Project["_id"]) => {
   
    try {
        const { data } = await api(`/projects/${id}`)
        return data;
        
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}

type ProjectAPIType = {
    formData: ProjectFormData
    projectId: Project["_id"]
}

export const updateProjectById = async({formData, projectId} : ProjectAPIType) => {
    
    try {
        const { data } = await api.put<ResponseQuery>(`/projects/${projectId}`, formData)
        return data;

    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}

export const deleteProjectById = async(projectId : Project["_id"]) => {
    
    try {
        const { data } = await api.delete<ResponseQuery>(`/projects/${projectId}`)
        return data;

    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}