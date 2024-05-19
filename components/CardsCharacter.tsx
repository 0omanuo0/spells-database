"use server";

const ordinals = ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th"];

import { dataParserStats, schoolParser, bonusParser, proficiencyBonus, addPlus, SkillsList, Spell } from "@/lib/types";
import { getSpellsByName } from "@/lib/data";
import { PlusCircleFill } from "react-bootstrap-icons";
import Link from "next/link";
import dynamic from "next/dynamic";
import SpellCard from "./spellCard";



export async function PasiveCard({name, value, className}:{name:string, value:number, className?:string}) {
    return (
        <div className={"bg-neutral-200 w-fit px-4 py-4 rounded-lg flex items-center space-x-4 min-w-80 " + className}>
            <p className="text-lg bg-neutral-100 py-2 px-6 rounded-lg border-2 border-neutral-600">{value}</p>
            <p className="text-sm">{name}</p>
        </div>
    )
}

export async function SpellList({ spells }: { spells: string[] }) {
    if (!spells) return null;

    const spellsData = (await Promise.all(spells.map(async (spell) => {
        return (await getSpellsByName(spell))[0];
    })));


    // prueba
    const asd = [...spellsData, ...spellsData, ...spellsData, ...spellsData, ...spellsData]

    const sortedSpellsByLevel = asd.sort((a: Spell, b: Spell) => a.level - b.level);

    const spellList = sortedSpellsByLevel.map((spell: Spell) => {
        return (
            <li key={spell.name} className="flex items-center space-x-4 hover:bg-white py-1 px-4 transition-colors duration-500 ease-in-out" >
                <button>
                    <PlusCircleFill className="text-xl text-neutral-700" />
                </button>
                <div className="flex space-x-10 items-center justify-between w-full">
                    <div className="text-left">
                        <SpellCard spell={spell} />
                        <p className="text-xs">{schoolParser[spell.school.toLocaleUpperCase()]} <span className="px-2 py-[2px] rounded-lg bg-neutral-500 text-white">{spell.damageInflict ?? "utility"}</span></p>

                    </div>
                    <span className="text-xs">{ordinals[spell.level - 1] ?? "Cantrip"}</span>
                </div>
            </li>
        )
    });
    return (
        <div className="bg-neutral-200 w-fit px-8 pt-6 pb-2 rounded-lg">
            <ul className="space-y-2 h-96 overflow-scroll">
                {spellList}
            </ul>
            <h3 className=" text-sm border-t-2 mt-2 border-neutral-500 tracking-wider uppercase">
                Spells
            </h3>
        </div>
    )
}

export async function Skills({ stats, proficiency, proficiencyBonus }: { stats: any, proficiency: string[], proficiencyBonus: number }) {
    const skills = Object.entries(SkillsList).map(([key, value]) => {
        const valueParsed = bonusParser[stats[value.toLowerCase() as string] as number] + proficiencyBonus;
        return (
            <li key={key} className="flex text-left space-x-2 justify-between text-xs">
                <p className="w-14 text-left">
                    {proficiency.includes(key) ? <span className="-ml-3">•</span> : null} {value}
                </p>
                <p className="text-left w-full">{key}</p>
                <p className="bg-neutral-100 w-12 rounded-md text-right px-2">{addPlus(valueParsed)}</p>
            </li>
        )
    });
    return (
        <div className="bg-neutral-200 w-fit px-8 pt-4 pb-2 rounded-lg">

            <ul className="space-y-2 tracking-wider">
                {skills}
            </ul>
            <h3 className=" text-sm border-t-2 border-neutral-500 mt-4 tracking-wider uppercase">
                Skills
            </h3>
        </div>

    )
}

export async function DataCard({ value, title, desc }: { value: string | number; title: string; desc?: string }) {
    return (
        <div className=" text-sm border-2 border-black p-2 rounded-lg min-w-28 w-fit h-fit">
            {desc && title}
            <span className=" text-lg block">{value}</span>
            {desc && <span className=" block">{desc}</span>}
            {!desc && <span className=" block">{title}</span>}
        </div>
    )
}

export async function ArmorClass({ stats }: { stats: any }) {
    const armorClass = 10 + bonusParser[stats.dex as number]; ///////////// change in future
    // background-image: url('/static/image/shield.png');
    return (
        <div className=" w-28 h-28 flex items-center justify-center text-sm font-semibold"
            style={{
                backgroundImage: "url('/static/image/shield.png')",
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
        >
            <div className="h-fit">
                <span>Armor</span>
                <span className="text-2xl block">{armorClass}</span>
                <span>Class</span>
            </div>
        </div>
    )
}

export async function StatCard({ stat, value }: { stat: string, value: number }) {
    const valueParsed = bonusParser[value as number];
    return (
        <li className="flex flex-col w-24 items-center bg-neutral-200 shadow-xl rounded-lg p-4">
            <p className="text-xl">{stat}</p>
            <span className="text-2xl">{valueParsed > 0 ? `+${valueParsed}` : valueParsed}</span>
            <span className=" border-2 border-black rounded-2xl px-2 w-12 " >{value}</span>
        </li>
    )
}

export async function SavingThrows({ stats, proficiency }: { stats: any, proficiency: string[] }) {
    const savingThrows = Object.entries(stats).map(([key, value]) => {
        const valueParsed = bonusParser[value as number];
        return (
            <li key={key} className="flex items-center space-x-1">
                {proficiency.includes(key) ? <span className="text-xk">•</span> : null}
                <p>{key}</p>
                <p>{valueParsed > 0 ? `+${valueParsed}` : valueParsed}</p>
            </li>
        )

    });
    return (
        <div className="bg-neutral-200 w-fit rounded-lg pt-2 mx-auto">
            <ul className="flex px-6 py-2 space-x-4 ">
                {savingThrows}
                
            </ul>
            <p className="block border-t-2 border-neutral-700 mx-8 text-xs uppercase pb-2 pt-1">saving throws</p>
        </div>
    )
}