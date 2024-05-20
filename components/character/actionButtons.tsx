"use client";
import { addItem, addSpell, removeSpell, removeItem, changeStat } from "@/lib/actions";
import { Dispatch, SetStateAction, useCallback } from "react";
import { DashCircleFill, PlusCircleFill } from "react-bootstrap-icons";
// import { useReload } from "./CardsCharacter";


export function AddSpell({ spell, characterId }: { spell: string, characterId: string }) {
    // const { forceReload } = useReload();
    const handleRemoveSpell = useCallback(async (event: any) => {
        event.preventDefault();
        await addSpell(characterId, spell);
    }, [characterId, spell]);
    return (
        <form onSubmit={handleRemoveSpell}>
            <button type="submit">
                <PlusCircleFill className="text-xl text-emerald-600" />
            </button>
        </form>
    );
}

export function RemoveSpell({ spell, characterId }: { spell: string, characterId: string }) {
    // const { forceReload } = useReload();
    const handleRemoveSpell = useCallback(async (event: any) => {
        event.preventDefault();
        await removeSpell(characterId, spell);
    }, [characterId, spell]);
    return (
        <form onSubmit={handleRemoveSpell}>
            <button type="submit">
                <DashCircleFill className="text-xl text-orange-800" />
            </button>
        </form>
    );
}

export function AddItem({ item, characterId }: { item: string, characterId: string }) {
    // const { forceReload } = useReload();
    const handleAddItem = useCallback(async (event: any) => {
        event.preventDefault();
        await addItem(characterId, item);
    }, [characterId, item]);
    return (
        <form onSubmit={handleAddItem}>
            <button type="submit">
                <PlusCircleFill className="text-xl text-neutral-700" />
            </button>
        </form>
    );
}

export function RemoveItem({ item, characterId }: { item: string, characterId: string }) {
    // const { forceReload } = useReload();
    const handleRemoveItem = useCallback(async (event: any) => {
        event.preventDefault();
        await removeItem(characterId, item);
    }, [characterId, item]);
    return (
        <form onSubmit={handleRemoveItem}>
            <button type="submit">
                <DashCircleFill className="text-xl text-orange-800" />
            </button>
        </form>
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
            onClick={() => setShowEditor(false)}
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
