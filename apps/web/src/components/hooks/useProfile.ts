import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "react-toastify"
import { useRouter } from "next/navigation"
import instance from "@/utils/axiosinstance"
import { UserProfileData } from '@/types/profile'

export const useProfile = () => {
  const queryClient = useQueryClient()
  const router = useRouter()

  const { data: userProfileData, isLoading, isError } = useQuery<UserProfileData>({
    queryKey: ['getUserProfile'],
    queryFn: async () => {
      const res = await instance.get('/profile')
      return res.data.data
    },
  })

  const { mutate: mutateEditUserProfile } = useMutation({
    mutationFn: async (fd: FormData) => {
      return await instance.put('/profile', fd)
    },
    onSuccess: (res) => {
      console.log("Success response:", res.data.data)
      toast.success(res.data.message)
      queryClient.invalidateQueries(['getUserProfile'])
    },
    onError: (err: any) => {
      console.error("onError handler:", err)
      toast.error(err.message)
    },
  })

  const { mutate: mutateRequestVerifyAccount } = useMutation({
    mutationFn: async () => {
      return await instance.post('/auth/request-verify-account')
    },
    onSuccess: (res) => {
      toast.success(res.data.message)
      router.push('/profile')
    },
    onError: (err: any) => {
      toast.error(err.message)
    },
  })

  const { mutate: mutateChangePassword } = useMutation({
    mutationFn: async (data: { currentPassword: string; newPassword: string; confirmPassword: string }) => {
      return await instance.put('/profile/password', data)
    },
    onSuccess: (res) => {
      toast.success(res.data.message)
    },
    onError: (err: any) => {
      toast.error(err.message)
    },
  })

  const { mutate: mutateChangeEmail } = useMutation({
    mutationFn: async (data: { email: string; currentPassword: string }) => {
      return await instance.put('/profile/email', data)
    },
    onSuccess: (res) => {
      console.log(res.data.data)  
      toast.success('Email updated successfully')
      queryClient.invalidateQueries(['getUserProfile'])
    },
    onError: (err: any) => {
      toast.error(err.message)
    },
  })

  return {
    userProfileData,
    isLoading,
    isError,
    mutateEditUserProfile,
    mutateRequestVerifyAccount,
    mutateChangePassword,
    mutateChangeEmail
  }
}