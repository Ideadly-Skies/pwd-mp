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
    const [isAuthorized, setIsAuthorized] = useState(true);
    const [isLoading, setIsLoading] = useState(true);

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
                profilePictureUrl: auth?.data?.data?.profilePictureUrl,
                isValid: auth?.data?.data?.isValid,
                totalPoint: auth?.data?.data?.totalPoint
            });
        } catch (err) {
            console.log(err);
            toast.error('Please re-login, your session is expired');
            router.push('/'); 
        } finally {
            setIsKeepAuth(true);
        }
    };

    useEffect(() => {
        if (token) {
            fetchKeepAuth().finally(() => {
                setIsLoading(false);
            });
        } else {
            setIsLoading(false);
        }
    }, [token]);

    useEffect(() => {
        if (isLoading) return;
        
        // Guest access control
        if (!token) {
            const guestBlockedRoutes = [
                '/create-event',
                '/organizer/dashboard', 
                '/profile', 
                '/user/inbox', 
                '/user/dashboard'
            ];

            if (guestBlockedRoutes.some(route => pathname.includes(route))) {
                toast.error('Access denied: You must be logged in');
                setIsAuthorized(false);
                setTimeout(() => router.push('/login/user'), 3000);
                return;
            }
            setIsAuthorized(true);
            return;
        }
    
        // Authenticated user access control
        if (isKeepAuth) {
            if (typeof role === 'undefined') return;
    
            // Prevent access to login/register pages for authenticated users
            if (['/login/user', '/login/organizer', '/register/user', '/register/organizer'].includes(pathname) && role) {
                router.push('/');
                return;
            }
    
            // Organizer-only route protection
            if (pathname.includes('/create-event') || pathname.includes('/organizer/dashboard') && role !== 'organizer') {
                setIsAuthorized(false);
                toast.error('Access denied: Only event organizers can create events');
                setTimeout(() => router.push('/'), 3000);
                return;
            }

            // User-only route protection
            const userOnlyRoutes = ['/profile', '/user/inbox', '/user/dashboard'];
            if (userOnlyRoutes.includes(pathname) && role !== 'user') {
                setIsAuthorized(false);
                toast.error('Access denied: Only users can access this page');
                setTimeout(() => router.push('/'), 3000);
                return;
            }
    
            setIsAuthorized(true);
        }
    }, [isKeepAuth, pathname, token, role, isLoading]);

    if (isLoading) {
        return (
            <main className="flex justify-center">
                <span className="loading loading-dots loading-lg"></span>
            </main>
        );
    }

    if (!isAuthorized) {
        return(
            <main className='w-full h-screen pt-72'>
                <div className='text-center items-center justify-center'>
                    <h1 className='text-3xl font-bold text-center items-center justify-center pb-10'>
                        Oopsie, Something went wrong
                    </h1>
                    <button className='bg-orange-500 rounded-lg items-center justify-center'>
                        <Link href='/'>
                        <span className='px-5 py-5 text-lg font-bold'>
                            go back to Homepage
                        </span>     
                        </Link>
                    </button>
                </div>
            </main>
        )  
    }

    return <>{children}</>;
}