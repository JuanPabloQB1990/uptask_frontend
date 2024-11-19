import { isAxiosError } from "axios";
import { Project, ResponseQuery, TeamMember, TeamMemberForm, teamMemberSchema, teamMembersSchema } from "../types";
import api from "@/lib/axios";



export const findUserByEmail = async({projectId, formData} : {projectId: Project["_id"], formData: TeamMemberForm}) => {
    try {
        const apiUrl = `/projects/${projectId}/team/find`
        const { data } = await api.post(apiUrl, formData)
        const response = teamMemberSchema.safeParse(data)
        if(response.success) return response.data;
        
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}

export const addMemberToProject = async({projectId, id} : {projectId: Project["_id"], id: TeamMember["_id"]}) => {
    try {
        const apiUrl = `/projects/${projectId}/team`
        const { data } = await api.post<ResponseQuery>(apiUrl, {id})
        return data;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}

export const getMembersProjectTeam = async(projectId : Project["_id"]) => {
    try {
        const apiUrl = `/projects/${projectId}/team`
        const { data } = await api.get(apiUrl)
        const response = teamMembersSchema.safeParse(data)
        
        if (response.success){ 
            return response.data
        };
        
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}

export const deleteMemberProjectTeamById = async({projectId, userId } : { projectId : Project["_id"], userId: TeamMember["_id"]}) => {
    try {
        const apiUrl = `/projects/${projectId}/team/${userId}`
        const { data } = await api.delete<ResponseQuery>(apiUrl)
        return data

    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}