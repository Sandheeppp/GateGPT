"use client";
import Sidebar from '@/components/Sidebar';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ProtectedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { token } = useAuthStore();
    const router = useRouter();
    const pathname = usePathname();
    const [isLoading, setIsLoading] = useState(() => {
        // Synchronous check to avoid "flash" of loading spinner
        if (typeof window !== 'undefined') {
            return !localStorage.getItem('token');
        }
        return true;
    });

    useEffect(() => {
        if (!token && !localStorage.getItem('token')) {
            router.push('/login');
        } else {
            setIsLoading(false);
        }
    }, [token, router]);

    // If we have a token, we don't show the full-screen loader at all during navigation
    if (isLoading && !token && (typeof window !== 'undefined' && !localStorage.getItem('token'))) {
        return (
            <div className="h-screen w-screen bg-[#050505] flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-[#050505] text-white overflow-hidden font-sans">
            <Sidebar />
            <main className="flex-1 flex flex-col overflow-y-auto custom-scrollbar relative">
                {/* Visual indicator for navigation */}
                <div key={pathname} className="absolute top-0 left-0 right-0 h-[2px] bg-blue-600 animate-progress-fast z-50"></div>
                {children}
            </main>
        </div>
    );
}
