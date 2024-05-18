// db.ts
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { type Spell, type User, type Character } from '@/lib/types';

import { openDb } from '@/lib/data';

sqlite3.verbose();

export async function setCharacterSpells(id: string, spells:string[]): Promise<Character> {
    const db = await openDb();
    const character = await db.get(`SELECT * FROM characters WHERE id=?`, [id]);
    return character;
}