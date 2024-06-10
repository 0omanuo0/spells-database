"use client";

import { Item, rarity, type_parser } from "@/lib/types";
import { Dispatch, ReactNode, SetStateAction, Suspense, useEffect, useState } from "react";
import { AddItem, RemoveItem } from "./actionButtons";
import { PlusCircleFill } from "react-bootstrap-icons";

async function fetchItemData(item: string) {
    const itemParsed = encodeURIComponent(item);
    const response = await fetch(`/api/items?f=${itemParsed}`);
    return await response.json();
}

async function fetchAllItems() {
    const response = await fetch(`/api/items`).then((res) => res.json());
    return response as Item[];
}

export function ItemList(
    { children, items, characterId }:
        { items: (Item | undefined)[], children?: JSX.Element, characterId: string }
) {
    const [characterItems, setCharacterItems] = useState<string[]>(items.map(item => item ? item.name : ""));
    const [itemsElements, setItemsElements] = useState<(JSX.Element | null)[]>([]);
    const [allItems, setAllItems] = useState<{ [n: string]: any }[]>([]);

    useEffect(() => {
        const setItems = async () => {
            const items = await fetchAllItems();
            setAllItems(items);
        };

        setItems();
    }, []);
        

    useEffect(() => {
        const setData = async () => {
            const itemsData = await Promise.all(characterItems.map(async item => await fetchItemData(item)));
            const sortedItemsByRarity = itemsData
                .filter((item) => item !== undefined && item.error === undefined && typeof item!.data !== "string")
                .sort((a, b) => rarity.indexOf(a.rarity) - rarity.indexOf(b.rarity));
            setItemsElements(
                sortedItemsByRarity.map((item) => (
                    <li key={item.name} className="flex items-center space-x-4 hover:bg-white py-1 px-4 transition-colors duration-500 ease-in-out">
                        <RemoveItem item={item.name} characterId={characterId} onClick={() => handleRemoveItem(item.name)} />
                        <div className="flex space-x-10 items-center justify-between w-full">
                            <div className="text-left">
                                <h3>{item.name}</h3>
                                <p className="text-xs">{item.data.rarity}</p>
                            </div>
                            <span className="text-xs">{type_parser[item.data.type as string]}</span>
                        </div>
                    </li>
                ))
            );
        };

        setData();
    }, [characterItems, characterId]);

    const handleRemoveItem = (itemName: string) => {
        setCharacterItems(prevItems => prevItems.filter(item => item !== itemName));
    };

    return (
        <div className="bg-neutral-200 w-fit px-8 pt-6 pb-2 rounded-lg text-center">
            <ul className="space-y-2 h-96 overflow-scroll">
                {itemsElements}
            </ul>
            <Suspense fallback={<div>Loading...</div>}>
                <AllItems
                    items={allItems}
                    characterId={characterId}
                    actualItems={characterItems}
                    setActualItems={setCharacterItems}
                />
            </Suspense>
            {children}
            <h3 className=" text-sm border-t-2 mt-2 border-neutral-500 tracking-wider uppercase">
                Spells
            </h3>
        </div>
    )
}




export function AllItems(
    { items, characterId, actualItems, setActualItems }:
        { items: { [n: string]: any }[], characterId: string, actualItems: string[], setActualItems: Dispatch<SetStateAction<string[]>> }
) {
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
                        <AddItem characterId={characterId} item={item.name}
                            onClick={
                                () => {
                                    setActualItems([...actualItems, item.name]);
                                }
                            }
                        />
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
    }, [search, showItems]);


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