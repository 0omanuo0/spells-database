"use server";

import { PlusCircleFill } from "react-bootstrap-icons";
import SpellCard from "@/components/character/spellCard";
import { getCharacter, getClass, getItem, getSpellsByName } from "@/lib/data";
import { Item, Spell, rarity, schoolParser, type_parser } from "@/lib/types";
import { RemoveItem, RemoveSpell } from "./actionButtons";


const ordinals = ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th"];




export async function SpellList({ children, spells, characterId }: { spells: string[], children: JSX.Element, characterId: string}) {
    if (!spells) return null;

    const spellsData = (await Promise.all(spells.map(async (spell) => {
        return (await getSpellsByName(spell));
    })));

    const sortedSpellsByLevel = spellsData.sort((a: Spell, b: Spell) => a.level - b.level);


    const spellList = sortedSpellsByLevel.map((spell: Spell) => {
        return (
            <li key={spell.name} className="flex items-center space-x-4 hover:bg-white py-1 px-4 transition-colors duration-500 ease-in-out" >
                {/* <button>
                    <PlusCircleFill className="text-xl text-neutral-700" />
                </button> */}
                <RemoveSpell spell={spell.name} characterId={characterId} />
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
        <div className="bg-neutral-200 w-fit px-8 pt-6 pb-2 rounded-lg text-center" >
            <ul className="space-y-2 h-96 overflow-scroll">
                {spellList}
            </ul>
            {children}
            <h3 className=" text-sm border-t-2 mt-2 border-neutral-500 tracking-wider uppercase">
                Spells
            </h3>
        </div>
    )
}

export async function ItemList({ children, items, characterId }: { items: string[], children?: JSX.Element, characterId: string}) {
    if (!items) return null;

    const itemsData = (await Promise.all(items.map(async (item) => {
        return (await getItem(item));
    })));

    const sortedItemsByRarity = itemsData.sort((a: any, b: any) => rarity.indexOf(a.rarity) - rarity.indexOf(b.rarity));
    


    const itemsList = sortedItemsByRarity.map((item: Item|undefined) => {
        // console.log(item);
        if (!item || typeof item.data === "string") return null; 
        return (
            <li key={item.name} className="flex items-center space-x-4 hover:bg-white py-1 px-4 transition-colors duration-500 ease-in-out" >
                <RemoveItem item={item.name} characterId={characterId} />
                <div className="flex space-x-10 items-center justify-between w-full">
                    <div className="text-left">
                        <h3>{item.name}</h3>
                        <p className="text-xs">{item.data.rarity}</p>
                    </div>
                    <span className="text-xs">{type_parser[item.data.type as string]}</span>
                </div>
            </li>
        )
    });
    return (
        <div className="bg-neutral-200 w-fit px-8 pt-6 pb-2 rounded-lg text-center" >
            <ul className="space-y-2 h-96 overflow-scroll">
                {itemsList}
            </ul>
            {children}
            <h3 className=" text-sm border-t-2 mt-2 border-neutral-500 tracking-wider uppercase">
                Spells
            </h3>
        </div>
    )
}