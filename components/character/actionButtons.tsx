"use client";
import { addItem, addSpell, removeSpell, removeItem, changeStat, changeClasses, changeAbilityScore } from "@/lib/actions";
import { Dispatch, SetStateAction, useCallback, useEffect, useState } from "react";
import { DashCircleFill, PlusCircleFill } from "react-bootstrap-icons";
// import { useReload } from "./CardsCharacter";


export function AddSpell({ spell, characterId, onClick }: { spell: string, characterId: string, onClick?: () => void }) {
    // const { forceReload } = useReload();
    const handleAddSpell = useCallback(async (event: any) => {
        event.preventDefault();
        await addSpell(characterId, spell);
    }, [characterId, spell]);
    return (
        <button onClick={(e) => {
            handleAddSpell(e);
            if (onClick) onClick();
        }
        }>
            <PlusCircleFill className="text-xl text-emerald-600" />
        </button>
    );
}

export function RemoveSpell({ spell, characterId, onClick }: { spell: string, characterId: string, onClick?: () => void }) {
    // const { forceReload } = useReload();
    const handleRemoveSpell = useCallback(async (event: any) => {
        event.preventDefault();
        await removeSpell(characterId, spell);
    }, [characterId, spell]);
    return (
        <button onClick={(e) => {
            handleRemoveSpell(e);
            if (onClick) onClick();
        }}>
            <DashCircleFill className="text-xl text-orange-800" />
        </button>
    );
}

export function AddItem({ item, characterId, onClick }: { item: string, characterId: string, onClick?: () => void }) {
    // const { forceReload } = useReload();
    const handleAddItem = useCallback(async (event: any) => {
        event.preventDefault();
        onClick && onClick();
        await addItem(characterId, item);
    }, [characterId, item]);
    return (
        <button onClick={handleAddItem}>
            <PlusCircleFill className="text-xl text-neutral-700" />
        </button>
    );
}

export function RemoveItem({ item, characterId, onClick }: { item: string, characterId: string, onClick?: () => void }) {
    // const { forceReload } = useReload();
    const handleRemoveItem = useCallback(async (event: any) => {
        event.preventDefault();
        onClick && onClick();
        await removeItem(characterId, item);
    }, [characterId, item]);
    return (
        <button onClick={handleRemoveItem}>
            <DashCircleFill className="text-xl text-orange-800" />
        </button>
    );
}


export function StatEditor({ stat, value, setShowEditor, characterId }: { stat: string, value: number, setShowEditor: Dispatch<SetStateAction<boolean>>, characterId: string }) {
    const handleChangeStat = useCallback(async (event: any) => {
        event.preventDefault();
        await changeStat(characterId, stat, event.target.value);
    }, [characterId, stat]);
    return (
        <div
            className="fixed top-0 left-0 w-[100vw] h-[100vh] bg-black/60 flex items-center justify-center"
            onClick={() => {
                setShowEditor(false);
                window.location.reload();
            }
            }
        >
            <div
                className="bg-white p-4 rounded-xl"
                onClick={(e) => e.stopPropagation()}
            >
                <p>{stat}</p>
                <input
                    type="number"
                    defaultValue={value}
                    onChange={(e) => handleChangeStat(e)}
                />
            </div>
        </div>
    )
}

export function SkillEditorButton(
    { skill, abilityScore, proficiencies, setProficiencies, characterId }:
        { skill: string, abilityScore: string, characterId: string, proficiencies: string[], setProficiencies: Dispatch<SetStateAction<string[]>> }
) {

    const handleDoubleClick = useCallback(async () => {
        await changeAbilityScore(characterId, skill, !proficiencies.includes(skill));
    }, [characterId, skill]);


    return (
        <button className="w-14 text-left" onDoubleClick={
            async () => {
                handleDoubleClick();
                console.log('double click', proficiencies, typeof proficiencies);
                if (proficiencies.includes(skill)) {
                    let updatedProficiencies = proficiencies;
                    updatedProficiencies = updatedProficiencies.filter((s) => s !== skill);
                    setProficiencies(updatedProficiencies);
                } else {
                    setProficiencies([...proficiencies, skill]);
                }
            }
        } id={skill}>
            {
                proficiencies.includes(skill) ? <span className="-ml-3 mr-1">&#9679;</span> : null
            }
            {abilityScore}
        </button>
    )
}



export function ChangeClasses(
    { characterId, characterClass, children }:
        { characterId: number, characterClass: { [c: string]: number }, children?: JSX.Element | JSX.Element[] }
) {
    const [showEditor, setShowEditor] = useState(false);

    const [classes, setClasses] = useState(characterClass);
    const [classesElements, setClassesElements] = useState<JSX.Element[]>([]);

    const handleClassChange = useCallback(async (event: any) => {
        event.preventDefault();

        const newClasses = { ...classes };
        newClasses[event.target.id] = parseInt(event.target.value)

        setClasses(newClasses);

    }, [characterId, classes]);

    useEffect(() => {
        const classesArray = Object.entries(classes).map(([c, l]) => {
            return (
                <li key={c} className="flex space-x-4 justify-between text-left" onChange={handleClassChange}>
                    <button onClick={() => {
                        const newClasses = { ...classes };
                        delete newClasses[c];
                        setClasses(newClasses);
                    }
                    }>
                        <DashCircleFill className="text-xl text-orange-800" />
                    </button>
                    <div className="w-full space-x-2 justify-between flex">
                        {c}
                        <input
                            className="border-2 border-black rounded-lg px-2 w-32 ml-6"
                            type="number"
                            id={c}

                            defaultValue={l}
                        />
                    </div>

                </li>
            )
        });
        setClassesElements(classesArray);
    }, [classes]);


    return (
        <>
            {
                showEditor ? (
                    <div
                        className="fixed top-0 left-0 z-50 bg-black/60 w-[100vw] h-[100vh] flex items-center justify-center"
                        onClick={
                            async () => {
                                setShowEditor(false);
                                await changeClasses(characterId, classes);
                                window.location.reload();
                            }
                        }
                    >
                        <div
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white p-4 rounded-xl space-y-2 "
                        >
                            <ul className="space-y-2">
                                {classesElements}
                            </ul>
                            <div className="flex space-x-4 justify-between">
                                <button
                                    onClick={() => {
                                        const newClass = document.getElementById('new-class') as HTMLSelectElement;
                                        // check if class already exists
                                        if (classes[newClass.value]) return;
                                        const newClasses = { ...classes, [newClass.value]: 1 };
                                        setClasses(newClasses);
                                    }
                                    }>
                                    <PlusCircleFill className="text-xl text-emerald-600" />
                                </button>
                                <select name="newclass" id="new-class">
                                    <option value="Barbarian">Barbarian</option>
                                    <option value="Bard">Bard</option>
                                    <option value="Cleric">Cleric</option>
                                    <option value="Druid">Druid</option>
                                    <option value="Fighter">Fighter</option>
                                    <option value="Monk">Monk</option>
                                    <option value="Paladin">Paladin</option>
                                    <option value="Ranger">Ranger</option>
                                    <option value="Rogue">Rogue</option>
                                    <option value="Sorcerer">Sorcerer</option>
                                    <option value="Warlock">Warlock</option>
                                    <option value="Wizard">Wizard</option>
                                </select>
                            </div>
                        </div>
                    </div>
                ) : (
                    <button onClick={() => setShowEditor(true)} className="flex items-center justify-center space-x-2">
                        {children ? children : <span>Change Classes</span>}
                    </button>
                )

            }
        </>
    )




    // const handleClassChange = useCallback(async (event: any) => {
    //     event.preventDefault();
    //     const newClass = event.target.value;
    //     const newLevel = parseInt(event.target.value);
    //     if (newLevel < 1) return;
    //     if (characterClass[newClass]) {
    //         characterClass[newClass] += newLevel;
    //     } else {
    //         characterClass[newClass] = newLevel;
    //     }
    //     await changeClasses(characterId, characterClass);
    // }, [characterId, characterClass]);


    // return (
    //     <div>
    //         <select
    //             onChange={handleClassChange}
    //         >
    //             <option value="barbarian">Barbarian</option>
    //             <option value="bard">Bard</option>
    //             <option value="cleric">Cleric</option>
    //             <option value="druid">Druid</option>
    //             <option value="fighter">Fighter</option>
    //             <option value="monk">Monk</option>
    //             <option value="paladin">Paladin</option>
    //             <option value="ranger">Ranger</option>
    //             <option value="rogue">Rogue</option>
    //             <option value="sorcerer">Sorcerer</option>
    //             <option value="warlock">Warlock</option>
    //             <option value="wizard">Wizard</option>
    //         </select>
    //         <input type="number" />
    //     </div>
    // )
}