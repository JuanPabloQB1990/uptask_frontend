import { isAxiosError } from "axios";
import { Note, NoteFormDate, Project, ResponseQuery, Task } from "../types";
import api from "@/lib/axios";

type NoteApiType = {
    formData: NoteFormDate,
    projectId: Project["_id"],
    taskId: Task["_id"],
    noteId: Note["_id"]
}

export const createNote = async({projectId, formData, taskId} : Pick<NoteApiType, "projectId" |"formData" |  "taskId">) => {
    try {
        const apiUrl = `projects/${projectId}/tasks/${taskId}/notes`
        const { data } = await api.post<ResponseQuery>(apiUrl, formData)
        return data;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}

export const deleteNote = async({projectId, taskId, noteId} : Pick<NoteApiType, "projectId" | "taskId" | "noteId">) => {
    try {
        const apiUrl = `projects/${projectId}/tasks/${taskId}/notes/${noteId}`;
        const { data } = await api.delete<ResponseQuery>(apiUrl)
        return data;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}