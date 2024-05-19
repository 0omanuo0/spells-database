export const runtime = 'edge';

"use client";

import Image from "next/image";
import { ReactNode, use, useEffect, useState } from "react";
import { useSession } from "next-auth/react";

import { type Spell } from "@/lib/types";
import HeaderMain from "@/components/header";
import SpellCard from "@/components/card";


export default function Home() {
    const [finder, setFinder] = useState("");
    const [spells, setSpells] = useState<ReactNode[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch(`/api/spells?q=${finder}`);
            // console.log(await res.json());
            let spells : Spell[] = await res.json();
            // if are more than 20 spells, slice the array
            if (spells.length > 20) {
                spells = spells.slice(0, 20);
            }
            console.log(spells);
            const spellsCards = spells.map((spell) => {
                return <SpellCard key={spell.name} spell={spell} />;
            });
            setSpells(spellsCards);
        }
        fetchData();
    }, [finder]);


    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <HeaderMain setFinder={setFinder} ></HeaderMain>
            <section className="pt-20 text-white gap-6 grid grid-cols-3">
                {
                    spells.length > 0 ? spells : <h1>No spells found</h1>
                }
            </section>
        </main>
    );
}
