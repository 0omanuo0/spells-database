"use server";

import { getAllItems, getCharacter, getClass, getSpellsByClass } from "@/lib/data";
import { bonusParser, proficiencyBonus, addPlus, } from "@/lib/types";
import Image from "next/image";

import { ArmorClass, DataCard, Skills, StatCard, SavingThrows, PasiveCard, SpellsClass, AllItems } from "@/components/character/CardsCharacter";
import DiceCanvas from "@/components/diceCanvas";
import { Suspense } from "react";
import { ItemList, SpellList } from "@/components/character/asyncCards";
import DiceProvider from "@/components/canvas/diceProvider";


export default async function CharacterCard({ id }: { id?: string }) {

    if (!id) return (<p>Character not found</p>);

    const character = await getCharacter(id);
    if (!character) return (<p>Character not found</p>);
    const characterClass: { [c: string]: number } = JSON.parse(character.class);
    const classesData = await Promise.all(Object.keys(characterClass).map(
        async (cClass) => (await getClass(cClass)).class[0]
    ));

    const stats = Object.entries(JSON.parse(character.stats)).map(
        ([key, value]) => <StatCard key={key} stat={key} value={value as number} />
    );

    const c_stats = JSON.parse(character.stats);

    const spellsByClass = (await Promise.all(
        Object.keys(characterClass).map(
            async (key) => {
                return await getSpellsByClass(key);
            }
        )
    )).flat();

    const allItems = await getAllItems();
    

    const characterLevel = Object.values(characterClass).reduce((acc, curr) => acc + curr, 0);

    return (
        <DiceProvider>
            <article className=" bg-white p-16 text-black m-20 space-y-4 rounded-xl text-center">
                <DiceCanvas className="fixed top-0 left-0 w-[vw] h-[vh]" />
                <nav>
                    <h1 className="text-2xl">{character.name}</h1>
                    <section className="flex space-x-2 border-b-2 justify-between">
                        <div className="flex space-x-2 ">
                            <p>Half-Elf</p>
                            <span className="">|</span>
                            {
                                Object.entries(characterClass).map(([key, value]: [any, any]) => {
                                    return <p key={key} className="capitalize">{key} {value}</p>
                                })
                            }
                        </div>
                        <div className="flex space-x-1 items-end text-xs"> {/* Modified line */}
                            <p className=" italic">Alignment:</p> {/* Modified line */}
                            {
                                // add coma and space between span if not last element
                                character.alignment.split(",").map((word, index) => {
                                    return <span key={index} className="capitalize">{word}</span>
                                })
                            }
                        </div>
                    </section>
                </nav>
                <ul className="flex justify-between">
                    {stats}
                </ul>
                <SavingThrows stats={JSON.parse(character.stats)} proficiency={classesData[0].proficiency} />

                <section className="flex space-x-12 text-center mx-10 items-center">
                    <div className="w-fit space-y-8">
                        <ArmorClass stats={c_stats} />
                        <DataCard title={"Walking"} value={30} desc="speed" />
                        <DataCard title={"Initiative"} value={addPlus(bonusParser[c_stats.dex as number])} />
                        <DataCard title={"Proficiency"} value={addPlus(proficiencyBonus(characterLevel))} desc="bonus" />
                    </div>
                    <Skills stats={c_stats} proficiency={character.skills} proficiencyBonus={proficiencyBonus(characterLevel)} />
                    <div className="w-full h-96 bg-black rounded-lg"></div>
                </section>
                <PasiveCard name="PASSIVE WISDOM (PERCEPTION)" value={c_stats.dex} className="mx-10" />
                <section className="flex space-x-6 text-center justify-between mx-10">
                    <Suspense fallback={<div>Loading...</div>}>
                        <SpellList spells={JSON.parse(character.spells) as string[]} >
                            <Suspense fallback={<div>Loading...</div>}>
                                <SpellsClass spells={spellsByClass} characterId={id} />
                            </Suspense>
                        </SpellList>
                    </Suspense>
                    <Suspense fallback={<div>Loading...</div>}>
                        <ItemList items={JSON.parse(character.items) as string[]}>
                            <Suspense fallback={<div>Loading...</div>}>
                                <AllItems items={allItems} />
                            </Suspense>
                        </ItemList>
                    </Suspense>
                </section>
            </article>
        </DiceProvider>
    )
}




