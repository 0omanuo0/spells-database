"use client";


import { schoolParser, Spell } from "@/lib/types";
import SpellCard from "./spellCard";
import { Dispatch, ReactNode, SetStateAction, Suspense, useEffect, useState } from "react";
import { DashCircleFill, PlusCircleFill } from "react-bootstrap-icons";
import { AddSpell, RemoveSpell } from "./actionButtons";

const ordinals = ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th"];


async function getSpellData(spellName: string) {
    const spellUrlEncoded = encodeURIComponent(spellName);
    const spell = await fetch(`/api/spells?f=${spellUrlEncoded}`).then(res => res.json());
    return spell;
}

async function getData(characterClass: { [c: string]: number }) {
    const classNames = Object.keys(characterClass);

    const spellsByClass: { data: Spell; classes: string[]; }[] = (await Promise.all(
        classNames.map(async (c) => {
            return await fetch(`/api/spells/byclass/${c}`).then(res => res.json());
        })
    ))[0];

    const maxSpellLevels: { [c: string]: number } = await Promise.all(
        classNames.map(async (key) => {
            const level = characterClass[key];
            const classData = await fetch(`/api/class/${key}`).then(res => res.json());
            if (!classData || !classData.spellcastingAbility) return { [key]: 0 };
            // find in classTableGroups the index of the title: "Spell Slots per Spell Level"
            const indexSpells = classData.classTableGroups.findIndex((value:any) => value.title === "Spell Slots per Spell Level");
            const progressionList: number[] = classData.classTableGroups[indexSpells].rowsSpellProgression[level-1];
            

            const maxLevel = progressionList.findIndex((value) => value === 0);
            return { [key]: maxLevel };
        })
    ).then(levels => Object.assign({}, ...levels));

    return { spellsByClass, maxSpellLevels };
}

export function SpellList(
    { children, spellsDataInit, characterId, classNames }:
        {
            spellsDataInit: Spell[],
            children?: JSX.Element,
            characterId: string,
            classNames: { [c: string]: number }
        }
) {
    if (!spellsDataInit) return null;

    const [characterSpells, setCharacterSpells] = useState<string[]>(spellsDataInit.map(spell => spell.name));
    const [spellList, setSpellList] = useState<ReactNode[]>([]);
    const [maxSpellLevels, setMaxSpellLevels] = useState<{ [c: string]: number }>({});
    const [spellsByClass, setSpellsByClass] = useState<{ data: Spell; classes: string[]; }[]>([]);
    useEffect(() => {
        const setData = async () => {
            const { spellsByClass, maxSpellLevels } = await getData(classNames);
            setMaxSpellLevels(maxSpellLevels);
            setSpellsByClass(spellsByClass);


            const characterSpellsData = await Promise.all(characterSpells.map(async (spell) => { return await getSpellData(spell) }));
            const sortedSpellsByLevel = characterSpellsData.sort((a: Spell, b: Spell) => a.level - b.level);


            setSpellList(
                sortedSpellsByLevel.map((spell: Spell) => {
                    return (
                        <li key={spell.name} className="flex items-center space-x-4 hover:bg-white py-1 px-4 transition-colors duration-500 ease-in-out" >
                            <RemoveSpell spell={spell.name} characterId={characterId}
                                onClick={() => {
                                    setCharacterSpells(characterSpells.filter(s => s !== spell.name));
                                }}
                            />
                            <div className="flex space-x-10 items-center justify-between w-full">
                                <div className="text-left">
                                    <SpellCard spell={spell} />
                                    <p className="text-xs">{schoolParser[spell.school.toLocaleUpperCase()]} <span className="px-2 py-[2px] rounded-lg bg-neutral-500 text-white">{spell.damageInflict ?? "utility"}</span></p>
                                </div>
                                <span className="text-xs">{ordinals[spell.level - 1] ?? "Cantrip"}</span>
                            </div>
                        </li>
                    )
                })
            );
        }
        setData();
    }, [characterSpells]);


    return (
        <div className="bg-neutral-200 w-fit px-8 pt-6 pb-2 rounded-lg text-center" >
            <ul className="space-y-2 h-96 overflow-scroll">
                {spellList}
            </ul>
            <Suspense fallback={<div>Loading...</div>}>
                <SpellsClass
                    spells={spellsByClass}
                    actualSpells={characterSpells}
                    setCharSpells={setCharacterSpells}
                    characterId={characterId}
                    maxSpellLevels={maxSpellLevels}
                />
            </Suspense>
            {children}
            <h3 className=" text-sm border-t-2 mt-2 border-neutral-500 tracking-wider uppercase">
                Spells
            </h3>
        </div>
    )
}

export function SpellsClass(
    { spells, setCharSpells, characterId, actualSpells, maxSpellLevels }
        : { spells: { data: Spell; classes: string[]; }[], actualSpells: string[], characterId: string, maxSpellLevels: { [c: string]: number }, setCharSpells: Dispatch<SetStateAction<string[]>> }
) {

    const filteredSpells = spells
        .filter(spell => spell.classes.some(c => maxSpellLevels[c] >= spell.data.level))
        .map(spell => spell.data)
        .sort((a, b) => a.level - b.level);

    const [showSpells, setShowSpells] = useState(false);
    const [showAll, setShowAll] = useState(false);
    const [sortedSpellsByLevel, setSpells] = useState<Spell[]>(filteredSpells);

    useEffect(() => {
        if (showAll) {
            setSpells(spells
                .map(spell => spell.data)
                .sort((a, b) => a.level - b.level));
        }
        else {
            setSpells(filteredSpells);
        }
    }, [showAll, showSpells]);

    return (
        <>

            {
                showSpells ?
                    <div
                        onClick={() => {
                            setShowSpells(false);
                            // reload window
                            // window.location.reload();
                        }}
                        className=" fixed top-0 left-0 w-[100vw] h-[100vh] items-center grid text-center z-50 bg-black/60"
                    >
                        <div
                            onClick={(e) => e.stopPropagation()}
                            className="bg-neutral-200 w-fit px-8 pt-6 pb-2 rounded-lg mx-auto"
                        >
                            <ul className="space-y-2 h-[70vh] overflow-scroll">
                                {
                                    sortedSpellsByLevel.map(spell => (
                                        <li key={spell.name} className="flex items-center space-x-4 hover:bg-white py-1 px-4 transition-colors duration-500 ease-in-out">
                                            {actualSpells.includes(spell.name) ? (
                                                <RemoveSpell spell={spell.name} characterId={characterId} onClick={
                                                    () => {
                                                        setCharSpells(actualSpells.filter(s => s !== spell.name));
                                                    }
                                                } />
                                            ) : (
                                                <AddSpell characterId={characterId} spell={spell.name} onClick={() => {
                                                    setCharSpells([...actualSpells, spell.name]);
                                                }} />
                                            )}
                                            <div className="flex space-x-10 items-center justify-between w-full">
                                                <div className="text-left">
                                                    <SpellCard spell={spell} />
                                                    <p className="text-xs">
                                                        {schoolParser[spell.school.toUpperCase()]}
                                                        <span className="px-2 py-[2px] rounded-lg bg-neutral-500 text-white">
                                                            {spell.damageInflict ?? "utility"}
                                                        </span>
                                                    </p>
                                                </div>
                                                <span className="text-xs">{ordinals[spell.level - 1] ?? "Cantrip"}</span>
                                            </div>
                                        </li>
                                    ))
                                }
                                <button
                                    onClick={() => setShowAll(!showAll)}
                                    className="flex items-center space-x-2 mx-auto my-2"
                                >
                                    {
                                        showAll ?
                                            <DashCircleFill className="text-xl text-neutral-700" />
                                            :
                                            <PlusCircleFill className="text-xl text-neutral-700" />
                                    }
                                    <h3 className=" text-sm border-neutral-500 tracking-wider uppercase ">
                                        Show all
                                    </h3>
                                </button>
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