// db.ts
"use server";

import { openDb, getCharacter } from '@/lib/data';

// sqlite3.verbose();

// export async function setCharacterSpells(id: string, spells:string[]): Promise<Character> {
//     const db = await openDb();
//     const character = await db.get(`SELECT * FROM characters WHERE id=?`, [id]);
//     return character;
// }



export async function addSpell(characterid : string, spell: string) {
    const character = await getCharacter(characterid);
    if (!character) return;

    const db = await openDb();
    const spells = JSON.parse(character.spells);

    if (spells.includes(spell)) return;
    spells.push(spell);
    const newSpells = JSON.stringify(spells);
    const res = await db.run(`UPDATE characters SET spells = ? WHERE id = ?`, [newSpells, characterid]);

    if (!res.changes) {
        console.log("Error adding spell");
    }
    console.log(characterid, spell);
}

export async function addItem(characterid : string, item: string) {
    const character = await getCharacter(characterid);
    if (!character) return;

    const db = await openDb();
    const items = JSON.parse(character.items);

    if (items.includes(item)) return;
    items.push(item);
    const newItems = JSON.stringify(items);
    const res = await db.run(`UPDATE characters SET items = ? WHERE id = ?`, [newItems, characterid]);

    if (!res.changes) {
        console.log("Error adding item");
    }
    console.log(characterid, item);
}