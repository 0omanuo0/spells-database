"use server";

import { getBackground, getCharacter, getClass, getItem, getSpellsByName } from "@/lib/data";
import { bonusParser, proficiencyBonus, addPlus, } from "@/lib/types";
import Image from "next/image";

import { ArmorClass, DataCard, Skills, StatCard, SavingThrows, PasiveCard, HeadCharacter, ContentTextCard, MultiContentCard } from "@/components/character/CardsCharacter";
import { SpellList } from "@/components/character/spellList";
import DiceCanvas from "@/components/diceCanvas";
import { Dispatch, SetStateAction, Suspense } from "react";
import DiceProvider from "@/components/canvas/diceProvider";
import { ItemList } from "./character/itemsList";
import { unstable_noStore as noStore } from 'next/cache';


async function getAllData(character: any) {
    noStore();
    const characterClass: { [c: string]: number } = JSON.parse(character.class);
    const classNames = Object.keys(characterClass);

    const classesData = await Promise.all(classNames.map(
        async (cClass) => (await getClass(cClass) || { proficiency: null })
    ));

    const stats = Object.entries(JSON.parse(character.stats)).map(
        ([key, value]) => <StatCard key={key} stat={key} value={value as number} characterId={character.id} />
    );


    const c_stats = JSON.parse(character.stats);

    const characterItems = JSON.parse(character.items) as string[];
    const characterSpells = JSON.parse(character.spells) as string[];
    const characterBackgroundData = await getBackground(character.background);

    const spellsData = await Promise.all(characterSpells.map(async spell => await getSpellsByName(spell)));
    const itemsData = await Promise.all(characterItems.map(async item => await getItem(item)));

    const characterLevel = Object.values(characterClass).reduce((acc, curr) => acc + curr, 0);

    return { characterClass, classesData, stats, c_stats, characterItems, characterSpells, spellsData, itemsData, characterLevel, characterBackgroundData };
}


export default async function CharacterCard({ id }: { id?: string }) {

    if (!id) return (<p>Character not found</p>);

    const character = await getCharacter(id);
    if (!character) return (<p>Character not found</p>);




    const { c_stats, spellsData, itemsData, characterClass, classesData, stats, characterLevel, characterBackgroundData } = await getAllData(await getCharacter(id));

    // construct an object as {[title:string]:string} from the characterBackgroundData.entries jouning all string entry.entries
    let entries: { [n: string]: any } = {};
    characterBackgroundData.entries.forEach((entry: any) => {
        if (entry["name"] !== undefined) {
            const e = entry["entries"]
                .filter((e: any) => typeof e === "string")
                .join(" ");
            if (e) entries[entry["name"]] = e;
        }
    });

    const description = Object.entries(JSON.parse(character.description))
        .map(([key, value]) => `${key}: ${value}`)
        .join("\n");

    return (
        <DiceProvider>
            <article className=" bg-white p-16 text-black m-20 space-y-4 rounded-xl text-center">
                <DiceCanvas className="fixed top-0 left-0 w-[vw] h-[vh]" />
                <HeadCharacter character={character} characterClass={characterClass} />
                <ul className="flex justify-between">
                    {stats}
                </ul>

                <section className="flex pt-10">
                    <div className="space-y-6 text-center">
                        <SavingThrows stats={JSON.parse(character.stats)} proficiency={classesData[0].proficiency} />
                        <section className="flex space-x-12 text-center mx-10 items-center">
                            <div className="w-fit space-y-8">
                                <ArmorClass stats={c_stats} />
                                <DataCard title={"Walking"} value={30} desc="speed" />
                                <DataCard title={"Initiative"} value={addPlus(bonusParser[c_stats.dex as number])} />
                                <DataCard title={"Proficiency"} value={addPlus(proficiencyBonus(characterLevel))} desc="bonus" />
                            </div>
                            <Skills
                                stats={c_stats}
                                proficiency={JSON.parse(character.skills)}
                                proficiencyBonus={proficiencyBonus(characterLevel)}
                                characterId={id}
                            />
                        </section>
                        <PasiveCard name="PASSIVE WISDOM (PERCEPTION)" value={c_stats.wis} className="mx-10" />
                        <PasiveCard name="PASSIVE INTELIGENCE (DECEPTION)" value={c_stats.int} className="mx-10" />
                    </div>
                    <div className="space-y-4">
                        <MultiContentCard
                            title="Background"
                            subtitle={character.background}
                            content={entries}
                            classNameContent="h-[200px] overflow-scroll text-balance"
                        />
                        <MultiContentCard
                            title="Characteristics"
                            classNameContent="h-[200px] overflow-scroll"
                            content={{
                                traits: character.traits,
                                bonds: character.bonds,
                                flaws: character.flaws,
                                ideals: character.ideals,
                            }}
                            editable={true}
                        />
                        <ContentTextCard
                            title="Description"
                        >
                            {description}
                        </ContentTextCard>
                    </div>
                </section>
                
                <section className="flex space-x-6 text-center justify-between mx-10">
                    <Suspense fallback={<div>Loading...</div>}>
                        <SpellList
                            spellsDataInit={spellsData}
                            characterId={id}
                            classNames={characterClass}
                        />
                    </Suspense>
                    <Suspense fallback={<div>EYEYEYEY...</div>}>
                        <ItemList
                            items={itemsData}
                            characterId={id}
                        />
                    </Suspense>
                </section>
            </article>
        </DiceProvider>
    )
}




