"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { redirect } from "next/navigation";

export default function Home() {
  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center">
      <h1 className="text-5xl font-bold">Secured Email Client</h1>
      <p>Email Management Supercharged for busy people</p>
      <Button onClick={() => redirect("/mail/")}>Start now!</Button>
    </div>
  );
}
