"use client";


import { bonusParser, addPlus, SkillsList, Character } from "@/lib/types";
import { ButtonSpawner } from "../diceCanvas";
import { Dispatch, ReactNode, useEffect, useState } from "react";
import { ChangeClasses, SkillEditorButton, StatEditor } from "./actionButtons";
import { TextEditable } from "./actionCards";



export function PasiveCard({ name, value, className }: { name: string, value: number, className?: string }) {
    return (
        <div className={"bg-neutral-200 w-fit px-4 py-2 rounded-lg flex items-center space-x-4 min-w-72 " + className}>
            <p className="text-md bg-neutral-100 py-1 px-4 rounded-lg border-2 border-neutral-600">{value}</p>
            <p className="text-xs">{name}</p>
        </div>
    )
}

export function Skills({ stats, proficiency, proficiencyBonus, characterId }: { stats: any, proficiency: string[], proficiencyBonus: number, characterId: string }) {

    const [skills, setSkills] = useState<ReactNode[]>([]);
    const [proficiencies, setProficiencies] = useState<string[]>(proficiency);

    const listSkills = (proficiency: string[]) => Object.entries(SkillsList).map(([key, value]) => {
        const valueParsed = bonusParser[stats[value.toLowerCase() as string] as number] + (proficiency.includes(key) ? proficiencyBonus : 0);
        return (
            <li key={key} className="flex text-left space-x-2 justify-between text-xs">
                <SkillEditorButton skill={key} abilityScore={value} characterId={characterId} setProficiencies={setProficiencies} proficiencies={proficiencies} />
                <p className="text-left w-full">{key}</p>
                <ButtonSpawner dice={20} bonus={valueParsed}>
                    <p className="bg-neutral-100 w-10 rounded-md text-right px-2">{addPlus(valueParsed)}</p>
                </ButtonSpawner>
            </li>
        )
    });

    useEffect(() => {
        setSkills(listSkills(proficiencies));
    }, [proficiencies]);

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

export function StatCard({ stat, value, characterId }: { stat: string, value: number, characterId: string }) {
    const valueParsed = bonusParser[value as number];
    const [showEditor, setShowEditor] = useState(false);
    return (
        <li className="flex flex-col w-24 items-center bg-neutral-200 shadow-xl rounded-lg p-4">
            <p className="text-xl">{stat}</p>
            <ButtonSpawner dice={20} bonus={valueParsed}>
                <span className="text-2xl">{valueParsed > 0 ? `+${valueParsed}` : valueParsed}</span>
            </ButtonSpawner>
            <button onClick={() => setShowEditor(true)}>
                <span className=" border-2 border-black rounded-2xl px-2 w-12 " >{value}</span>
            </button>
            {
                showEditor ? <StatEditor stat={stat} value={value} setShowEditor={setShowEditor} characterId={characterId} /> : null
            }
        </li >
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

export function HeadCharacter({ character, characterClass }: { character: Character, characterClass: { [c: string]: number } }) {
    return (
        <nav>

            <h1 className="text-2xl">
                {character.name}
                <span className="ml-2 text-lg tracking-tight">{`(Lvl ${Object.values(characterClass).reduce((acc, curr) => acc + curr, 0)})`}</span>
            </h1>
            <section className="flex space-x-2 border-b-2 justify-between">
                <div className="flex space-x-2 ">
                    <p>Half-Elf</p>
                    <span className="">|</span>
                    <ChangeClasses characterId={character.id} characterClass={characterClass} >
                        {
                            Object.entries(characterClass).map(([key, value]: [any, any]) => {
                                return <span key={key} className="capitalize inline-flex">{key} {value}</span>
                            })
                        }
                    </ChangeClasses>
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
    )
}


export function ContentTextCard(
    { content, title, subtitle, className, children }:
        { content?: string, title: string, subtitle?: string, className?: string, children?: ReactNode }
) {
    if (!content && !children) return null;
    return (
        <div
            className={"bg-neutral-200 w-fit px-8 pt-4 pb-2 rounded-lg " + className}
        >
            <h3 className="text-lg">{subtitle}</h3>
            <TextEditable
                target={{ objective: title, subtitle: subtitle }}
                className=" text-left tracking-wide leading-2 text-pretty"
            >
                {content || children as string}
            </TextEditable>
            <h3 className=" text-sm border-t-2 border-neutral-500 mt-4 tracking-wider uppercase">
                {title}
            </h3>
        </div>
    )
}

export function MultiContentCard(
    { title, subtitle, content, className, classNameContent, editable }
        : { title: string, subtitle?: string, content: { [title: string]: string }, className?: string, classNameContent?: string, editable?: boolean }
) {
    const [showFull, setShowFull] = useState(false);

    return (
        <div
            className={showFull ? "fixed top-0 left-0 flex items-center justify-center h-[100vh] w-[100vw] bg-black/60 backdrop-blur-sm " : ""}
            onClick={() => setShowFull(false)}
        >
            <div
                onClick={e => e.stopPropagation()}
                className={`bg-neutral-200 ${!showFull ? "w-fit" : "w-[640px] max-h-[640px] p-20"} px-8 pt-4 pb-2 rounded-lg ${className} mx-auto `}
            >
                <h3
                    className={"text-lg" + (!showFull ? " cursor-pointer" : " py-4")}
                    onClick={() => setShowFull(true)}
                >
                    {subtitle}
                </h3>
                <ul className={" text-left space-y-3 " + (!showFull ? classNameContent : "px-20 max-h-[380px] overflow-scroll")}>
                    {
                        Object.entries(content).map(([key, value]) => {
                            return (
                                <li key={key} className="">
                                    <h4 className=" uppercase text-sm text-center ">{key}</h4>
                                    <TextEditable
                                        target={{ objective: key, subtitle: title }}
                                        className={" text-sm tracking-wide leading-2"}
                                        editable={editable}
                                    >
                                        {value}
                                    </TextEditable>
                                </li>
                            )
                        })
                    }
                </ul>
                <h3
                    onClick={() => setShowFull(true)}
                    className={ " text-sm border-t-2 border-neutral-500 mt-4 tracking-wider uppercase" + (!showFull ? " cursor-pointer" : " ")}
                >
                    {title}
                </h3>
            </div>
        </div>
    )
}