import { getUser } from "@/api/AuthApi"
import { useQuery } from "@tanstack/react-query"

export const useAuth = () => {
    const { data, isError, isLoading, error } = useQuery({
        queryKey: ["profile"],
        queryFn: getUser,
        retry: 1,
        refetchOnWindowFocus: false
    })

    return {
        data,
        isError,
        isLoading,
        error
    }
}