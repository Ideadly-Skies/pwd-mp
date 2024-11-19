import { create } from 'zustand';
import { persist } from 'zustand/middleware'

const authStore = create(persist((set) => ({
    token:'',
    firstName: '',
    lastName: '',
    email: '',
    role: '',
    profilePictureUrl: '',
    isValid: false,
    totalPoint: null,
    
    setAuth: ({ token, firstName, lastName, role, email, profilePictureUrl, isValid, totalPoint }: any) => set({ token, firstName, lastName, role, email, profilePictureUrl, isValid, totalPoint }),
    setKeepAuth: ({firstName, lastName, role, email, profilePictureUrl, isValid, totalPoint}:any) => set({firstName: firstName, lastName: lastName, role: role,email: email, profilePictureUrl: profilePictureUrl, isValid: isValid, totalPoint: totalPoint}),
    setAuthLogout: () => set({firstName: '', lastName: '', role: '', token: '', email:'', profilePictureUrl: '', isValid: false, totalPoint: null})
}),
{
    name: 'authToken',
    partialize: (state: any) => ({token: state.token})
}

))


export default authStore