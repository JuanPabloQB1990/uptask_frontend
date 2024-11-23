import { BrowserRouter, Route, Routes } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import DashboardView from "./views/DashboardView";
import CreateProjectView from "./views/projects/CreateProjectView";
import EditProjectView from "./views/projects/EditProjectView";
import ProjectDetailsView from "./views/projects/ProjectDetailsView";
import AuthLayout from "./layouts/AuthLayout";
import LoginView from "./views/auth/LoginView";
import RegisterView from "./views/auth/RegisterView";
import ConfirmAccountView from "./views/auth/ConfirmAccountView";
import RequestNewCodeView from "./views/auth/RequestNewCodeView";
import ForgotPasswordView from "./views/auth/ForgotPasswordView";
import NewPasswordView from "./views/auth/NewPasswordView";
import ProjectTeamView from "./views/projects/ProjectTeamView";
import ProfileView from "./views/profile/ProfileView";
import ChangePasswordView from "./views/profile/ChangePasswordView";
import ProfileLayout from "./layouts/ProfileLayout";
import NotFound404 from "./views/NotFound404";
export default function Router() {
    return (
        <BrowserRouter 
            future={{
                v7_relativeSplatPath: true,
                v7_startTransition: true
            }}
        >
            <Routes>
                <Route element={<AppLayout />}>
                    <Route path="/" element={<DashboardView/>} index/>
                    <Route path="/projects/create" element={<CreateProjectView/>} index/>
                    <Route path="/projects/:projectId" element={<ProjectDetailsView/>} index/>
                    <Route path="/projects/:projectId/edit" element={<EditProjectView/>} index/>
                    <Route path="/projects/:projectId/team" element={<ProjectTeamView/>} index/>
                    
                    <Route element={<ProfileLayout />}>  
                        <Route path="/profile" element={<ProfileView/>} index/>
                        <Route path="/profile/password" element={<ChangePasswordView/>} index/>
                    </Route>
                </Route>
                <Route element={<AuthLayout/>}>
                    <Route path="/auth/login" element={<LoginView />} index/>
                    <Route path="/auth/register" element={<RegisterView />} index/>
                    <Route path="/auth/confirm-account" element={<ConfirmAccountView />} index/>
                    <Route path="/auth/new-code" element={<RequestNewCodeView />} index/>
                    <Route path="/auth/forgot-password" element={<ForgotPasswordView />} index/>
                    <Route path="/auth/new-password" element={<NewPasswordView />} index/>
                </Route>
                <Route element={<AuthLayout/>}>
                    <Route path="*" element={<NotFound404/>}/>
                </Route>
            </Routes>
        </BrowserRouter>
    )
}