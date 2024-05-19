"use client";


import { dataParserStats, schoolParser, bonusParser, proficiencyBonus, addPlus, SkillsList, Spell, Item, rarity } from "@/lib/types";
import { ButtonSpawner } from "../diceCanvas";
import SpellCard from "./spellCard";
import { ReactNode, createContext, useCallback, useContext, useEffect, useState } from "react";
import { PlusCircleFill } from "react-bootstrap-icons";
import { AddSpell } from "./actionButtons";

const ordinals = ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th"];


export function SpellsClass({ spells, characterId }: { spells: Spell[], characterId: string }) {
    const sortedSpellsByLevel = spells.sort((a: Spell, b: Spell) => a.level - b.level);
    const [showSpells, setShowSpells] = useState(false);

    const spellList = sortedSpellsByLevel.map((spell: Spell) => {
        return (
            <li key={spell.name} className="flex items-center space-x-4 hover:bg-white py-1 px-4 transition-colors duration-500 ease-in-out" >
                <AddSpell characterId={characterId} spell={spell.name} />
                <div className="flex space-x-10 items-center justify-between w-full">
                    <div className="text-left">
                        <SpellCard spell={spell} />
                        <p className="text-xs">
                            {schoolParser[spell.school.toLocaleUpperCase()]}
                            <span className="px-2 py-[2px] rounded-lg bg-neutral-500 text-white">
                                {spell.damageInflict ?? "utility"}
                            </span>
                        </p>
                    </div>
                    <span className="text-xs">{ordinals[spell.level - 1] ?? "Cantrip"}</span>
                </div>
            </li>
        )
    });
    return (
        <>
            {
                showSpells ?
                    <div
                        onClick={() => {
                            setShowSpells(false);
                            // reload window
                            window.location.reload();
                        }}
                        className=" fixed top-0 left-0 w-[100vw] h-[100vh] items-center grid text-center z-50 bg-black/60"
                    >
                        <div
                            onClick={(e) => e.stopPropagation()}
                            className="bg-neutral-200 w-fit px-8 pt-6 pb-2 rounded-lg mx-auto"
                        >
                            <ul className="space-y-2 h-[70vh] overflow-scroll">
                                {spellList}
                            </ul>
                            <h3 className=" text-sm border-t-2 mt-2 border-neutral-500 tracking-wider uppercase">
                                Spells
                            </h3>
                        </div>
                    </div>

                    :
                    <button onClick={() => setShowSpells(true)} className="flex items-center space-x-2 mx-auto my-2">
                        <PlusCircleFill className="text-xl text-neutral-700" />
                        <h3 className=" text-sm border-neutral-500 tracking-wider uppercase ">
                            Add spell
                        </h3>
                    </button>

            }
        </>
    );
}

export function AllItems({ items }: { items: { [n: string]: any }[] }) {
    const sortedItemsByRarity = items.sort((a: any, b: any) => rarity.indexOf(a.rarity) - rarity.indexOf(b.rarity));
    const [showItems, setShowItems] = useState(false);
    const [itemList, setItemList] = useState<ReactNode[] | null>(null);
    const [search, setSearch] = useState("");

    // reload state when search changes
    useEffect(() => {
        setItemList(sortedItemsByRarity
            .filter((item) => item.name.toLowerCase().includes(search.toLowerCase()))
            .map((item) => {
                return (
                    <li key={item.name} className="flex items-center space-x-4 hover:bg-white py-1 px-4 transition-colors duration-500 ease-in-out" >
                        <div className="flex space-x-10 items-center justify-between w-full">
                            <div className="text-left">
                                <h3>{item.name}</h3>
                                <p className="text-xs">{item.rarity}</p>
                            </div>
                            <span className="text-xs">{item.type}</span>
                        </div>
                    </li>
                )
            }
            ));
    }, [search]);


    return (
        <>
            {
                showItems ?
                    <div
                        onClick={() => { setShowItems(false); }}
                        className=" fixed top-0 left-0 w-[100vw] h-[100vh] items-center grid text-center z-50 bg-black/60"
                    >
                        <div
                            onClick={(e) => e.stopPropagation()}
                            className="bg-neutral-200 px-8 pt-6 pb-2 rounded-lg mx-auto w-[850px]"
                        >
                            <div className="">
                                <h3 className=" text-lg border-t-2 mt-2 py-2 border-neutral-500 tracking-wider uppercase">
                                    Find items
                                </h3>
                                <input
                                className="w-full px-2 py-1 border-2 border-neutral-500 rounded-lg mb-2 focus-within:outline-none"
                                    placeholder="Find by name"
                                    onChange={
                                        (e) => setSearch(e.target.value)
                                    } />
                            </div>
                            <ul className="space-y-2 h-[70vh] overflow-scroll w-full">
                                {itemList}
                            </ul>
                        </div>
                    </div>

                    :
                    <button onClick={() => setShowItems(true)} className="flex items-center space-x-2 mx-auto my-2">
                        <PlusCircleFill className="text-xl text-neutral-700" />
                        <h3 className=" text-sm border-neutral-500 tracking-wider uppercase ">
                            Add item
                        </h3>
                    </button>

            }
        </>
    );

}



export function PasiveCard({ name, value, className }: { name: string, value: number, className?: string }) {
    return (
        <div className={"bg-neutral-200 w-fit px-4 py-2 rounded-lg flex items-center space-x-4 min-w-72 " + className}>
            <p className="text-md bg-neutral-100 py-1 px-4 rounded-lg border-2 border-neutral-600">{value}</p>
            <p className="text-xs">{name}</p>
        </div>
    )
}

export function Skills({ stats, proficiency, proficiencyBonus }: { stats: any, proficiency: string[], proficiencyBonus: number }) {
    const skills = Object.entries(SkillsList).map(([key, value]) => {
        const valueParsed = bonusParser[stats[value.toLowerCase() as string] as number] + proficiencyBonus;
        return (
            <li key={key} className="flex text-left space-x-2 justify-between text-xs">
                <p className="w-14 text-left">
                    {proficiency.includes(key) ? <span className="-ml-3">•</span> : null} {value}
                </p>
                <p className="text-left w-full">{key}</p>
                <ButtonSpawner dice={20} bonus={valueParsed}>
                    <p className="bg-neutral-100 w-10 rounded-md text-right px-2">{addPlus(valueParsed)}</p>
                </ButtonSpawner>
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

export function DataCard({ value, title, desc }: { value: string | number; title: string; desc?: string }) {
    return (
        <div className=" text-sm border-2 border-black p-2 rounded-lg min-w-28 w-fit h-fit">
            {desc && title}
            <span className=" text-lg block">{value}</span>
            {desc && <span className=" block">{desc}</span>}
            {!desc && <span className=" block">{title}</span>}
        </div>
    )
}

export function ArmorClass({ stats }: { stats: any }) {
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

export function StatCard({ stat, value }: { stat: string, value: number }) {
    const valueParsed = bonusParser[value as number];
    return (
        <li className="flex flex-col w-24 items-center bg-neutral-200 shadow-xl rounded-lg p-4">
            <p className="text-xl">{stat}</p>
            <span className="text-2xl">{valueParsed > 0 ? `+${valueParsed}` : valueParsed}</span>
            <ButtonSpawner dice={20} bonus={valueParsed}>
                <span className=" border-2 border-black rounded-2xl px-2 w-12 " >{value}</span>
            </ButtonSpawner>
        </li>
    )
}

export function SavingThrows({ stats, proficiency }: { stats: any, proficiency: string[] }) {
    const savingThrows = Object.entries(stats).map(([key, value]) => {
        const valueParsed = bonusParser[value as number];
        return (
            <li key={key} className="flex items-center">
                <ButtonSpawner dice={20} bonus={valueParsed} className="space-x-1">
                    {proficiency.includes(key) ? <span className="text-xk inline-block">•</span> : null}
                    <p className="inline-block">{key}</p>
                    <p className="inline-block">{valueParsed > 0 ? `+${valueParsed}` : valueParsed}</p>
                </ButtonSpawner>
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