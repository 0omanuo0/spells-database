// db.ts
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import type { Spell, User,  Character, Item } from '@/lib/types';

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

export async function getItem(id: string) {
    const db = await openDb();
    let item : Item | undefined = await db.get(`SELECT * FROM items WHERE name=?`, [id]);
    if (item) item.data = item.data ? JSON.parse(item.data as string) : {};
    return item;
}

export async function getAllItems() {
    const db = await openDb();
    const data = await db.all('select * from items');
    const items = data.map((item) => {
        return JSON.parse(item.data);
    });
    return items;
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

export async function getSpellsByClass(classD: string) {
    const db = await openDb();
    const data = await db.all('select * from spells');
    // data is {id: number, class:string[] data: string}[]
    const spell = data.map((spell) => {
        // return the spell and the classes
        return [JSON.parse(spell.data) as string, spell.class as string];
    });
    // filter spells if classD is in classes and return spell[0]
    const spells = spell.filter((spell) => {
        return spell[1].includes(classD);
    }).map((spell) => {
        return JSON.parse(spell[0]);
    });
    return spells as Spell[];
}

export async function getSpellsByName(name: string) {
    // filter by name with sql (to lower case name and spell.name)
    const db = await openDb();
    const data = await db.all('select * from spells where lower(name) like ?', [ name.toLowerCase()]);
    const spells = data.map((spell) => {
        return JSON.parse(spell.data);
    });
    return JSON.parse(spells[0]);
    
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