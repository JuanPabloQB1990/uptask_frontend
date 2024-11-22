import { isAxiosError } from "axios";
import { ResponseQuery, UpdateCurrentPasswordForm, UserProfileForm } from "../types";
import api from "@/lib/axios";

export const updateProfile = async(formData: UserProfileForm) => {

    try {
        const apiUrl = `/auth/profile`;
        const { data } = await api.put<ResponseQuery>(apiUrl, formData)
        return data;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}

export const changePassword = async(formData: UpdateCurrentPasswordForm) => {

    try {
        const apiUrl = `/auth/update-password`;
        const { data } = await api.post<ResponseQuery>(apiUrl, formData)
        return data;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}