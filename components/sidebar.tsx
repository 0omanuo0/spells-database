"use client";

import { User } from "@/lib/types";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";



export default function Sidebar() {

    const [showCharacters, setShowCharacters] = useState(false)

    const { data: session } = useSession();
    const userName = session?.user.name;

    const [user, setUser] = useState<User | undefined>(undefined);

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch(`/api/user/${session?.user?.id}`);
            let user = await res.json();
            setUser(user);
        }
        fetchData();

    }, [session]);


    return (
        <aside className="top-0 left-0 w-60 h-screen fixed bg-gray-100 dark:bg-neutral-800">
            <div className="w-full h-20 items-center grid bg-gray-200 dark:bg-neutral-700">
                <h1 onClick={() => setShowCharacters(!showCharacters)} className="text-2xl text-center font-semibold">{userName}</h1>
            </div>
            <Link href="/campaign/1"
            > Goto Campaign 1</Link>
            <button onClick={() => setShowCharacters(!showCharacters)} className="text-xl w-full py-2 pl-4 hover:bg-neutral-600 text-left transition-colors ease-in-out duration-300 ">Personajes</button>
            <ul className="w-full h-full overflow-y-auto pl-4">
                {
                    showCharacters && user?.characters.map((character) => {
                        return (
                            <li key={character.id} className="w-full py-2 flex items-center pl-2 hover:pl-4 transition-all duration-500 ease-in-out">
                                <Link href={"/characters/" + character.id} className="text-lg">{character.name}</Link>
                            </li>
                        )
                    })
                }
            </ul>

        </aside>
    );
}