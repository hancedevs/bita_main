"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RootPage() {
    const router = useRouter();

    useEffect(() => {
        // Redirect to the default locale for static exports where middleware is ignored
        router.replace("/en/");
    }, [router]);

    // Optional: return a small loading state while redirecting
    return (
        <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-red"></div>
        </div>
    );
}
