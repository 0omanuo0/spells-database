import CharacterCard from "@/components/characterHomeCard"
import Sidebar from "@/components/sidebar"
import { User } from "@/lib/types";
import { useSession } from "next-auth/react";
import { Suspense, useEffect, useState } from "react"

export default function CharacterHomepage({ params }: { params: { id: string } }) {
    const id = params.id;
    return (
        <>
            <Suspense fallback={<div>Loading...</div>}>
                <Sidebar />
            </Suspense>
            <main className=" ml-64">
                <CharacterCard id={id} />
            </main>
        </>
    )
}