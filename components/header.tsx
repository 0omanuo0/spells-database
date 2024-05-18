"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Dispatch, SetStateAction, useState } from 'react';
import { signIn, signOut, useSession } from "next-auth/react";


export default function HeaderMain({ setFinder }: { setFinder: Dispatch<SetStateAction<string>> }) {
    const { data: session } = useSession();
    const [isLogged, setLogged] = useState(
        session?.user ? true : false
    );

    useState(() => {
        if (session?.user) {
            setLogged(true);
        } else {
            setLogged(false);
        }
    });

    return (
        <header className="z-10 flex fixed items-center w-full h-20 backdrop-blur-md dark:bg-neutral-800/80 bg-white/80 p-5 top-0">
            <div className=" dark:text-white dark:border-white ml-8 border-b-[3px] border-black mb-[4px] font-semibold tracking-wide text-[24px]">
                <label className=" w-max block">DnD Database</label>
            </div>
            <div
                className=" w-full flex items-center border border-gray-300 rounded-lg py-1 px-4 ml-14 mx-8 focus-within:dark:bg-neutral-700 focus-within:bg-zinc-100"
            >
                <input
                    autoComplete='off'
                    onChange={(e) => setFinder(e.target.value)}
                    type="text" id="search"
                    className="w-full bg-transparent dark:text-neutral-200 focus-within:dark:bg-neutral-700 focus-within:bg-zinc-100 border-none outline-none text-gray-700"
                    placeholder="Buscar..."
                />
                <button className="ml-2 focus:outline-none text-gray-600 hover:text-gray-800" aria-label="Buscar" disabled>
                    {/* <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 28 28"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-5.2-5.2" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M15 11a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg> */}
                </button>
            </div>
            <nav id="base" className="items-center w-fit flex space-x-2 mx-6">
                {
                    !session?.user ?
                        <button
                            onClick={() => signIn()}
                            className=' inline-block text-nowrap mx-6'
                        >
                            {session?.user ? session.user.name : "Iniciar sesion"}
                        </button>
                        :
                        <>
                            <Link
                                className=' inline-block text-nowrap'
                                href={`/user/${session?.user?.id}`}
                            >
                                {session?.user.name}
                            </Link>
                            <button
                                onClick={() => signOut()}
                                className=' inline-block text-nowrap text-gray-400'
                            >
                                SignOut
                            </button>
                        </>
                }
            </nav>




        </header>
    );
}