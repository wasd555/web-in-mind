import Link from "next/link";
import { Button } from "@repo/ui/button";

export default function Home() {
    return (
        <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center">
            <h1 className="text-5xl font-bold mb-6">GARmonia</h1>
            <p className="text-lg mb-8 max-w-md">
                Be in balance — сервис психологических и спортивных вебинаров и видеоуроков.
            </p>
        </main>
    );
}