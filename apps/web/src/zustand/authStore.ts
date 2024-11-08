import { create } from 'zustand';
import { persist } from 'zustand/middleware'

const authStore = create(persist((set) => ({
    token:'',
    firstName: '',
    lastName: '',
    email: '',
    role: '',
    profilePictureUrl: '',
    
    setAuth: ({ token, firstName, lastName, role, email, profilePictureUrl }: any) => set({ token, firstName, lastName, role, email, profilePictureUrl }),
    setKeepAuth: ({firstName, lastName, role, email, profilePictureUrl}:any) => set({firstName: firstName, lastName: lastName, role: role,email: email, profilePictureUrl: profilePictureUrl}),
    setAuthLogout: () => set({firstName: '', lastName: '', role: '', token: '', email:'', profilePictureUrl: ''})
}),
{
    name: 'authToken',
    partialize: (state: any) => ({token: state.token})
}

))


export default authStore