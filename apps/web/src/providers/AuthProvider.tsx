'use client';
import { ReactNode, useEffect, useState } from 'react';
import instance from '@/utils/axiosinstance';
import authStore from '@/zustand/authStore';
import { usePathname, useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import Link from 'next/link';

interface IAuthProviderProps {
    children: ReactNode;
}

export default function AuthProvider({ children }: IAuthProviderProps) {
    const router = useRouter();
    const pathname = usePathname();
    const [isKeepAuth, setIsKeepAuth] = useState(false);
    const [isAuthorized, setIsAuthorized] = useState(true)

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
            router.push('/'); // Redirect to landing page if fetching auth fails
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
        if (isKeepAuth) {
            // Redirect to home if logged in and accessing login pages
            if ((pathname === '/login/user' || pathname === '/login/organizer' || pathname === '/register/user' || pathname === '/register/organizer') && token && role) {
                router.push('/');
                return;
            }

            // Protect specific routes based on token and role
            if (
                pathname.includes('/organizer/dashboard') && 
                (!token || role !== 'organizer')
            ) {
                setIsAuthorized(false);
                toast.error('Access denied: Unauthorized user');
                // Render an error message page briefly before redirecting
                setTimeout(() => {
                    router.push('/');
                }, 3000);
            } else {
                setIsAuthorized(true)
            }
        }
    }, [isKeepAuth, pathname, token, role]);

    if (!isKeepAuth) {
        return (
            <main className="flex justify-center">
                <span className="loading loading-dots loading-lg"></span>
            </main>
        );
    }


    if (!isAuthorized) {
        // Optionally render an error message while waiting for redirect
        return (
            <main className="flex justify-center">
                <p className="text-red-500">Access denied: Redirecting...</p>
            </main>
        );
    }

    return <>{children}</>;
}