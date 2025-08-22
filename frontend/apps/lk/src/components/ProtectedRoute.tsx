"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter();

    useEffect(() => {
        async function check() {
            try {
                const res = await fetch("http://localhost:8055/users/me", { credentials: "include" });
                if (res.ok) setIsAuthenticated(true); else router.push("/login");
            } catch (e) {
                router.push("/login");
            } finally {
                setLoading(false);
            }
        }
        check();
    }, [router]);

    if (loading) return <div className="flex justify-center items-center h-screen">Загрузка...</div>;
    return isAuthenticated ? <>{children}</> : null;
}