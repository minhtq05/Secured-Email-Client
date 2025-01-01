"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
    return (
        <div className="w-screen h-screen flex flex-col items-center justify-center">
            <h1 className="text-5xl font-bold">Secured Email Client</h1>
            <p>Email Management Supercharged for busy people</p>
            <Button asChild>
                <Link href="/mail">Start now!</Link>
            </Button>
        </div>
    );
}
