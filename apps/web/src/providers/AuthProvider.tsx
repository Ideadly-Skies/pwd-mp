'use client';
import { ReactNode, useEffect, useState } from 'react';
import instance from '@/utils/axiosinstance';
import authStore from '@/zustand/authStore';
import { usePathname, useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

interface IAuthProviderProps {
    children: ReactNode;
}

export default function AuthProvider({ children }: IAuthProviderProps) {
    const router = useRouter();
    const pathname = usePathname();
    const [isKeepAuth, setIsKeepAuth] = useState(false);

    const token = authStore((state) => state.token);
    const role = authStore((state) => state.role)
    const setKeepAuth = authStore((state) => state.setKeepAuth);

    const fetchKeepAuth = async () => {
        try {
            const auth = await instance.get('/auth');
            setKeepAuth({
                firstName: auth?.data?.data?.firstName,
                lastName: auth?.data?.data?.lastName,
                role: auth?.data?.data?.role,
                email: auth?.data?.data?.email,
                profilePictureUrl: auth?.data?.data?.profilePictureUrl
            });
        } catch (err) {
            console.log(err);
            toast.error('Please re-login, your session is expired');
            // router.push('/'); // Redirect to landing page if fetching auth fails
        } finally {
            setIsKeepAuth(true);
        }
    };

    useEffect(() => {
        if (token) {
            fetchKeepAuth();
        } else {
            setIsKeepAuth(true); // Set to true to stop loading and trigger redirection
        }
    }, [token]);

    useEffect(() => {
        // Redirect to home if logged in and accessing login pages
        if ((pathname === '/login/user' || pathname === '/login/organizer') && token && role) {
            router.push('/');
        }

        // if (isKeepAuth) {
        //     // Protect dashboard routes if no token is available
        //     // const isProtectedRoute = !['/login/user', '/login/organizer', '/reset-password'].includes(pathname);
        //     if (!token) {
        //         router.push('/'); // Redirect to landing page if unauthenticated
        //         toast.error('Please Re-login');
        //     }
        // }
    }, [isKeepAuth, pathname]);

    if (!isKeepAuth) {
        return (
            <main className="flex justify-center">
                <span className="loading loading-dots loading-lg"></span>
            </main>
        );
    }

    return <>{children}</>;
}