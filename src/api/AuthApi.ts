import api from "@/lib/axios";
import { isAxiosError } from "axios";
import { CheckPasswordForm, ConfirmToken, ForgotPasswordForm, NewPasswordForm, RequestConfirmationCodeForm, ResponseJWT, ResponseQuery, UserLoginForm, UserRegistrationForm, userSchema } from "../types";

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
        const { data } = await api.post<ResponseJWT>("/auth/login", formData);
        localStorage.setItem("AUTH_TOKEN", data.token);
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

export const getUser = async() => {
    try {
        const { data } = await api.get(`/auth/user`);
        const response = userSchema.safeParse(data)
        if(response.success) return data
        
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}

export const checkPassword = async(formData: CheckPasswordForm) => {
    try {
        const { data } = await api.post<ResponseQuery>(`/auth/check-password`, formData);
        return data
        
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}