// db.ts
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { type Spell, type User, type Character } from '@/lib/types';

sqlite3.verbose();

export async function openDb() {
    return open({
        filename: './database.db',
        driver: sqlite3.Database
    });
}


async function checkUserExists(id: string): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
        const db = await openDb();
        const user = await db.get(`SELECT * FROM users WHERE id=?`, [id]);
        if (user) {
            resolve(true);
        } else {
            resolve(false);
        }
    });
}

async function checkCharacterExists(id: string): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
        const db = await openDb();
        const character = await db.get(`SELECT * FROM characters WHERE id=?`, [id]);
        if (character) {
            resolve(true);
        } else {
            resolve(false);
        }
    });
}

async function modifyCharacter(character: Character) {
    return new Promise(async (resolve, reject) => {
        const db = await openDb();
        await db.run(
            `UPDATE characters SET name=?, level=?, class=?, subclass=?, spells=?, items=?, campaign=? WHERE id=?`,
            [
                character.name, character.level, character.class, JSON.stringify(character.other_class), JSON.stringify(character.spells), JSON.stringify(character.items), character.campaign,
                character.id
            ]
        );
    });
}


export async function getUser(id: string) {
    const db = await openDb();

    if (!await checkUserExists(id)) {
        await db.run(`INSERT INTO users (id) VALUES (?)`, [id]);
    }
    const user = await db.get(`SELECT * FROM users WHERE id=?`, [id]);
    const characters = await db.all(`SELECT * FROM characters WHERE user_id=?`, [id]);



    const userObj: User = {
        id: user.id,
        characters: characters
    };
    // console.log(userObj, id);
    return userObj;
}

export async function getCharacter(id: string) {
    const db = await openDb();
    const character : Character | undefined = await db.get(`SELECT * FROM characters WHERE id=?`, [id]);
    return character;
}

export async function getClass(name: string) {
    const db = await openDb();
    const rawData = await db.get(`SELECT * FROM classes WHERE name=?`, [name.charAt(0).toUpperCase() + name.slice(1)]);
    if (!rawData) return undefined;
    const classData = JSON.parse(rawData.data);
    return classData;
}


export async function getSpells() {
    const db = await openDb();
    const data = await db.all('select * from spells');
    const spells = data.map((spell) => {
        return JSON.parse(spell.data);
    });
    return spells;
}

// export async function getSpellsByClass(classD: string) {
//     const db = await openDb();
//     const data = await db.all('select * from spells');
//     const spells = data.map((spell) => {
//         return JSON.parse(spell.data);
//     });
//     const spellsByClass = spells.filter((spell: Spell) => {
//         return spell.class.includes(classD);
//     });
//     return spellsByClass;
// }

export async function getSpellsByName(name: string) {
    const data = await getSpells();
    // if lowercase is equal to data[].name return it
    const spellsByName = data.filter((spell: Spell) => {
        return spell.name.toLowerCase() === name.toLowerCase();
    });
    return spellsByName;
}


export async function filterByName(name: string) : Promise<Spell[]> {
    // example:
    // {"name":"Acid Splash","source":"PHB",...
    const data = await getSpells();
    const spells = data.filter((spell: Spell) => {
        return spell.name.toLowerCase().includes(name.toLowerCase());
    });
    return spells;
}