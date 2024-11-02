import { create } from 'zustand';
import { persist } from 'zustand/middleware'

const authStore = create(persist((set) => ({
    token:'',
    name: '',
    role: '',
    
    setAuth: ({token, name, role}:any) => set({ token: token, name: name, role: role}),
    setKeepAuth: ({name, role}:any) => set({name: name, role: role}),
    setAuthLogout: () => set({name: '', role: '', token: ''})
}),
{
    name: 'authToken',
    partialize: (state: any) => ({token: state.token})
}

))


export default authStore