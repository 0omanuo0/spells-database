// db.ts
"use server";

import { openDb, getCharacter } from '@/lib/data';


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
}

export async function removeSpell(characterid : string, spell: string) {
    
    const character = await getCharacter(characterid);
    if (!character) return;

    const db = await openDb();
    const spells : string[] = JSON.parse(character.spells);

    if (!spells.includes(spell)) return;
    const index = spells.indexOf(spell);
    if (index > -1) spells.splice(index, 1);
    const newSpells = JSON.stringify(spells);
    const res = await db.run(`UPDATE characters SET spells = ? WHERE id = ?`, [newSpells, characterid]);

    if (!res.changes) {
        console.log("Error removing spell");
    }
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
}

export async function removeItem(characterid : string, item: string) {
    const character = await getCharacter(characterid);
    if (!character) return;

    const db = await openDb();
    const items : string[] = JSON.parse(character.items);

    if (!items.includes(item)) return;
    const newItems = JSON.stringify(items.filter((i: string) => i !== item));
    const res = await db.run(`UPDATE characters SET items = ? WHERE id = ?`, [newItems, characterid]);

    if (!res.changes) {
        console.log("Error removing item");
    }
}

export async function changeStat(characterid : string, stat: string, value: number) {
    const character = await getCharacter(characterid);
    if (!character) return;

    const db = await openDb();
    let stats = JSON.parse(character.stats);

    stats[stat] = value;
    const newStats = JSON.stringify(stats);
    const res = await db.run(`UPDATE characters SET stats = ? WHERE id = ?`, [newStats, characterid]);

    if (!res.changes) {
        console.log("Error changing stat");
    }
}