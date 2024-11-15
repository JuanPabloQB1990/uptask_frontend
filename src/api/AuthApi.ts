import api from "@/lib/axios";
import { isAxiosError } from "axios";
import { ConfirmToken, ForgotPasswordForm, NewPasswordForm, RequestConfirmationCodeForm, ResponseQuery, UserLoginForm, UserRegistrationForm } from "../types";

export const createAccount = async(formData : UserRegistrationForm) => {
    try {
        const { data } = await api.post<ResponseQuery>("/auth/create-account", formData);
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}

export const confirmAccount = async(formData : ConfirmToken) => {
    try {
        const { data } = await api.post<ResponseQuery>("/auth/confirm-account", formData);
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}

export const requestConfirmationCode = async(formData : RequestConfirmationCodeForm) => {
    try {
        const { data } = await api.post<ResponseQuery>("/auth/request-code", formData);
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}

export const authenticateUser = async(formData : UserLoginForm) => {
    try {
        const { data } = await api.post<ResponseQuery>("/auth/login", formData);
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}

export const sendEmailForgotPassword = async(formData : ForgotPasswordForm) => {
    try {
        const { data } = await api.post<ResponseQuery>("/auth/forgot-password", formData);
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}

export const validateToken = async(formData : ConfirmToken) => {
    try {
        const { data } = await api.post<ResponseQuery>("/auth/validate-token", formData);
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}

export const updatePassword = async({formData, token} : {formData: NewPasswordForm, token: ConfirmToken["token"]}) => {
    try {
        const { data } = await api.post<ResponseQuery>(`/auth/update-password/${token}`, formData);
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}