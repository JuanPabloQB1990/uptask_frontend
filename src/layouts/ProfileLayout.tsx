import Tabs from "@/components/profile/Tabs"
import { Outlet } from "react-router-dom"

const ProfileLayout = () => {
  return (
    <div>
        <Tabs />
        <Outlet />
    </div>
  )
}

export default ProfileLayout