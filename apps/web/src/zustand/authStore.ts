import { create } from 'zustand';
import { persist } from 'zustand/middleware'

const authStore = create(persist((set) => ({
    token:'',
    firstName: '',
    lastName: '',
    role: '',
    
    setAuth: ({token, firstName, lastName, role}:any) => set({ token: token, firstName: firstName, lastName: lastName, role: role}),
    setKeepAuth: ({firstName, lastName, role}:any) => set({firstName: firstName, lastName: lastName, role: role}),
    setAuthLogout: () => set({firstName: '', lastName: '', role: '', token: ''})
}),
{
    name: 'authToken',
    partialize: (state: any) => ({token: state.token})
}

))


export default authStore