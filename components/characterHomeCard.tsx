"use server";

import { getCharacter, getClass } from "@/lib/data";
import { dataParserStats, bonusParser, proficiencyBonus, addPlus, SkillsList } from "@/lib/types";
import Image from "next/image";

import { ArmorClass, DataCard, Skills, StatCard, SavingThrows, SpellList, PasiveCard } from "@/components/CardsCharacter";


export default async function CharacterCard({ id }: { id?: string }) {


    if (!id) return (<p>Character not found</p>);
    const character = await getCharacter(id);
    if (!character) return (<p>Character not found</p>);
    const classData = (await getClass(character.class)).class[0];
    const stats = Object.entries(JSON.parse(character.stats)).map(
        ([key, value]) => <StatCard key={key} stat={key} value={value as number} />
    );

    const c_stats = JSON.parse(character.stats);

    return (
        <article className=" bg-white p-16 text-black m-20 space-y-4 rounded-xl text-center">
            <nav>
                <h1 className="text-2xl">{character.name}</h1>
                <section className="flex space-x-2 border-b-2 justify-between">
                    <div className="flex space-x-2 ">
                        <p>Half-Elf</p>
                        <span className="">|</span>
                        <p>{character.class}</p>
                        <p>{character.level}</p>
                    </div>
                    <div className="flex space-x-2 items-end text-xs"> {/* Modified line */}
                        <p className=" italic">Alignment:</p> {/* Modified line */}
                        {
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
            <SavingThrows stats={JSON.parse(character.stats)} proficiency={classData.proficiency} />
            <section className="flex space-x-12 text-center mx-10 items-center">
                <div className="w-fit space-y-8">
                    <ArmorClass stats={c_stats} />
                    <DataCard title={"Walking"} value={30} desc="speed" />
                    <DataCard title={"Initiative"} value={addPlus(bonusParser[c_stats.dex as number])} />
                    <DataCard title={"Proficiency"} value={addPlus(proficiencyBonus(character.level))} desc="bonus" />
                </div>
                <Skills stats={c_stats} proficiency={character.skills} proficiencyBonus={proficiencyBonus(character.level)} />
                <div className="w-full h-96 bg-black rounded-lg"></div>
            </section>
            <PasiveCard name="PASSIVE WISDOM (PERCEPTION)" value={c_stats.dex} className="mx-10" />
            <section className="flex space-x-6 text-center justify-between mx-10">
                <SpellList spells={JSON.parse(character.spells) as string[]} />
                <div className="w-80 h-96 bg-black rounded-lg"></div>
            </section>
        </article>
    )
}

