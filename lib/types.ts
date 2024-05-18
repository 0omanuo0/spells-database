export const spell_school = {
    "A": "abjuration",
    "C": "conjuration",
    "D": "divination",
    "E": "enchantment",
    "I": "illusion",
    "N": "necromancy",
    "T": "transmutation",
    "V": "evocation"
}
export const dataParserStats = {
    "str": "Strength",
    "dex": "Dexterity",
    "con": "Constitution",
    "int": "Intelligence",
    "wis": "Wisdom",
    "cha": "Charisma"
}

export const bonusParser : {[n in number]:number} = {
    1: -5,
    2: -4,
    3: -4,
    4: -3,
    5: -3,
    6: -2,
    7: -2,
    8: -1,
    9: -1,
    10: 0,
    11: 0,
    12: 1,
    13: 1,
    14: 2,
    15: 2,
    16: 3,
    17: 3,
    18: 4,
    19: 4,
    20: 5,
}

export const schoolParser : {[n in string]:string} = {
    "A": "abjuration",
    "C": "conjuration",
    "D": "divination",
    "E": "enchantment",
    "I": "illusion",
    "N": "necromancy",
    "T": "transmutation",
    "V": "evocation"
}

export const SkillsList = {
    "Acrobatics": "Dex",
    "Animal Handling": "Wis",
    "Arcana": "Int",
    "Athletics": "Str",
    "Deception": "Cha",
    "History": "Int",
    "Insight": "Wis",
    "Intimidation": "Cha",
    "Investigation": "Int",
    "Medicine": "Wis",
    "Nature": "Int",
    "Perception": "Wis",
    "Performance": "Cha",
    "Persuasion": "Cha",
    "Religion": "Int",
    "Sleight of Hand": "Dex",
    "Stealth": "Dex",
    "Survival": "Wis"
}

export function proficiencyBonus(level:number):number {
    return Math.ceil(level/4) + 1;
}

export function addPlus(value:number):string {
    return value > 0 ? `+${value}` : value.toString();
}


export type Character = {
    id: number,
    name: string,
    level: number,
    class: string,
    subclass: string,
    stats: string,
    alignment: string,
    skills: string[],
    other_class: string[],
    spells: string,
    items: {[amount in string]:number}[],
    campaign: string
}

export type User = {
    id: string,
    characters: Character[]
}

export type Spell = {
    name: string,
    source: string,
    page: number,
    srd: boolean,
    basicRules: boolean,
    level: number,
    school: string,
    time: {
        number: number,
        unit: string
    }[],
    range: {
        type: string,
        distance: {
            type: string,
            amount: number
        }
    },
    components: {
        v: boolean,
        s: boolean,
        m: boolean,
    },
    duration: {
        type: string,
        duration: {
            type: string,
            amount: number
        }
    }[],
    entries: string[],
    entriesHigherLevel: {[n:string]:string}[],
    scalingLevelDice: {
        label: string,
        scaling: {
            [key: string]: string
        }
    },
    damageInflict: string[],
    savingThrow: string[],
    miscTags: string[],
    areaTags: string[]
}