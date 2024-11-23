import ProfileForm from "@/components/profile/ProfileForm"
import { useAuth } from "@/hooks/useAuth"
import { Navigate } from "react-router-dom"

const ProfileView = () => {

    const { data, isLoading, error } = useAuth()

    if(isLoading) return "Loading..."
    if (error?.message === "Token no Valido") return <Navigate to="/auth/login" />;

  if(data) return <ProfileForm data={data}/>
}

export default ProfileView