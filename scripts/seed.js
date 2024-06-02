const sqlite3 = require('sqlite3').verbose();
const { randomUUID } = require('crypto');
const fs = require('fs');
const path = require('path');
const { X } = require('react-bootstrap-icons');

function openDatabase(callback) {
    let db = new sqlite3.Database('./database.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
        if (err) {
            console.error(err.message);
            return callback(err, null);
        }
        console.log('Conectado a la base de datos SQLite.');
        callback(null, db);
    });
}

function createTableSpells(db, callback) {
    const createTableSQL = `CREATE TABLE IF NOT EXISTS spells (
        name TEXT PRIMARY KEY,
        class TEXT,
        optionalClass TEXT,
        data TEXT
    );`;

    return db.run(createTableSQL, (err) => {
        if (err) {
            console.error("err_create", err.message);
            return callback(err);
        }
        console.log("Tabla 'spells' creada o ya existente.");
        callback(null);
    });
}

function insertDataSpells(db) {
    const files = [
        './data/spells/spells-phb.json',
        './data/spells/spells-xge.json',
        './data/spells/spells-tce.json',
        './data/spells/spells-sato.json',
        './data/spells/spells-tce.json' // Esta ruta está duplicada, asegúrate de que es correcto.
    ];

    const classFile = './Spells.json';

    // create the array of spells, read the file and save it into a variable
    let spells = [];
    files.forEach(file => {
        const rawData = fs.readFileSync(file);
        const data = JSON.parse(rawData);
        const spellsFormated = data.spell.map(spell => {
            return {
                name: spell.name,
                data: JSON.stringify(spell)
            };
        });
        spells = spells.concat(spellsFormated);
    });

    // insert the spells into the database while reading classFile to add the classes compatibles
    const spClass = JSON.parse(fs.readFileSync(classFile));
    spells.forEach(spell => {
        const name = spell.name;
        const data = spell.data;
        // split "Artificer, Druid, Ranger, Sorcerer, Wizard" into ["Artificer", "Druid", "Ranger", "Sorcerer", "Wizard"]
        const classes = spClass
            .filter(spell => spell.Name === name)
            .map(spell => {
                return spell.Classes ? spell.Classes
                    .split(',')
                    .map(c => c.trim()) : [];
            })[0] || [];
        const optionalClasses = spClass
            .filter(spell => spell.Name === name)
            .map(spell => {
                const a = spell["Optional\/Variant Classes"];
                return a ? a.split(',').map(c => c.trim()) : [];
            })[0] || [];

        return db.run(
            `INSERT INTO spells (name, class, optionalClass, data) VALUES (?, ?, ?, ?)`,
            [
                name,
                JSON.stringify(classes),
                JSON.stringify(optionalClasses),
                JSON.stringify(data)
            ], (err) => {
                if (err) {
                    return console.error(err.message);
                }
            });
    });

}

function createTableItems(db, callback) {
    const createTableSQL = `CREATE TABLE IF NOT EXISTS items (
        name TEXT PRIMARY KEY,
        data TEXT
    );`;

    return db.run(createTableSQL, (err) => {
        if (err) {
            console.error("err_create", err.message);
            return callback(err);
        }
        console.log("Tabla 'items' creada o ya existente.");
        callback(null);
    });
}

function insertDataItems(db) {
    const file = './data/items.json';
    const file2 = './data/items-base.json';
    const rawData = fs.readFileSync(file);
    const rawData2 = fs.readFileSync(file2);
    let data = JSON.parse(rawData)
    const data2 = JSON.parse(rawData2);
    data = data.item.concat(data2.baseitem);
    data.forEach(item => {
        const name = item.name;
        const data = JSON.stringify(item);

        return db.run(`INSERT INTO items (name, data) VALUES (?, ?)`, [name, data], (err) => {
            if (err) {
                return console.error(err.message);
            }
        });
    });
}

function createTableRace(db, callback) {
    const createTableSQL = `CREATE TABLE IF NOT EXISTS races (
        name TEXT PRIMARY KEY,
        data TEXT
    );`;

    return db.run(createTableSQL, (err) => {
        if (err) {
            console.error("err_create", err.message);
            return callback(err);
        }
        console.log("Tabla 'races' creada o ya existente.");
        callback(null);
    });
}

function insertDataRace(db) {
    const file = './data/races.json';
    const rawData = fs.readFileSync(file);
    const data = JSON.parse(rawData);
    data.race.forEach(item => {
        const name = item.name;
        const data = JSON.stringify(item);

        return db.run(`INSERT INTO races (name, data) VALUES (?, ?)`, [name, data], (err) => {
            if (err) {
                return console.error(err.message);
            }
        });
    });
}

function createTableBackground(db, callback) {
    const createTableSQL = `CREATE TABLE IF NOT EXISTS background (
        name TEXT PRIMARY KEY,
        data TEXT
    );`;

    return db.run(createTableSQL, (err) => {
        if (err) {
            console.error("err_create", err.message);
            return callback(err);
        }
        console.log("Tabla 'races' creada o ya existente.");
        callback(null);
    });
}

function insertDataBackground(db) {
    const file = './data/backgrounds.json';
    const rawData = fs.readFileSync(file);
    const jsonData = JSON.parse(rawData); // Renombrar esta variable

    if (!jsonData.background) {
        console.error("No se ha encontrado el campo 'background' en el archivo JSON.");
        return;
    }

    jsonData.background.map(item => {
        const name = item.name;
        const itemData = JSON.stringify(item); // Renombrar esta variable

        db.run(`INSERT INTO background (name, data) VALUES (?, ?)`, [name, itemData], (err) => {
            if (err) {
                return console.error(err.message);
            }
        });
    });
}

function createTableFeat(db, callback) {
    const createTableSQL = `CREATE TABLE IF NOT EXISTS feat (
        name TEXT PRIMARY KEY,
        data TEXT
    );`;

    return db.run(createTableSQL, (err) => {
        if (err) {
            console.error("err_create", err.message);
            return callback(err);
        }
        console.log("Tabla 'races' creada o ya existente.");
        callback(null);
    });
}

function insertDataFeat(db) {
    const file = './data/feats.json';
    const rawData = fs.readFileSync(file);
    const data = JSON.parse(rawData);
    data.feat.forEach(item => {
        const name = item.name;
        const data = JSON.stringify(item);

        return db.run(`INSERT INTO feat (name, data) VALUES (?, ?)`, [name, data], (err) => {
            if (err) {
                return console.error(err.message);
            }
        });
    });
}

function createTableMonsters(db, callback) {
    const createTableSQL = `CREATE TABLE IF NOT EXISTS monsters (
        name TEXT PRIMARY KEY,
        data TEXT
    );`;

    return db.run(createTableSQL, (err) => {
        if (err) {
            console.error("err_create", err.message);
            return callback(err);
        }
        console.log("Tabla 'monsters' creada o ya existente.");
        callback(null);
    });
}

function insertDataMonsters(db) {
    // load ./data/bestiary/index.json to get the paths of the files
    const paths = JSON.parse(fs.readFileSync('./data/bestiary/index.json'));
    Object.values(paths).forEach(file => {
        const fullPath = path.resolve(`./data/bestiary/${file}`);
        const rawData = fs.readFileSync(fullPath);
        const monsterData = JSON.parse(rawData);
        monsterData.monster.forEach(monster => {
            const name = monster.name;
            const data = JSON.stringify(monster);

            return db.run(`INSERT INTO monsters (name, data) VALUES (?, ?)`, [name, data], (err) => {
                if (err) {
                    return console.error(err.message);
                }
            });
        });
    });
}


// create table users and characters
function createTableUsers(db, callback) {
    const createTableSQL = `CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY
    );`;

    return db.run(createTableSQL, (err) => {
        if (err) {
            console.error("err_create", err.message);
            return callback(err);
        }
        console.log("Tabla 'users' creada o ya existente.");
        callback(null);
    });
}

function insertDataUsers(db) {
    const users = [117045338603744539303,];
    users.forEach(user => {
        return db.run(`INSERT INTO users (id) VALUES (?)`, [user], (err) => {
            if (err) {
                return console.error(err.message);
            }
        });
    });
}

// create table campaigns
function createTableCampaigns(db, callback) {
    const createTableSQL = `CREATE TABLE IF NOT EXISTS campaigns (
        id TEXT PRIMARY KEY,
        name TEXT,
        characters TEXT,
        tokens TEXT,
        owner TEXT,
        locations TEXT,
        notes TEXT        
    );`;

    return db.run(createTableSQL, (err) => {
        if (err) {
            console.error("err_create", err.message);
            return callback(err);
        }
        console.log("Tabla 'campaigns' creada o ya existente.");
        callback(null);
    });
}

function insertDataCampaigns(db) {
    // create uuid v4 for every campaign
    const campaigns = [
        {
            id: randomUUID(),
            name: "campaign1",
            characters: ["Gandalf", "Elarien"],
            tokens: {
                "Elarien": {
                    health: 34,
                    maxHealth: 50,
                    armorClass: 15,
                    spellSlots: { 1: 3, 2: 2, 3: 1 },
                    spellSlotsUsed: { 1: 1, 2: 0, 3: 0 },
                    v2D: {
                        dataPath2d: "/content/vikingmedieval_game_character-v2.png",
                        dx: 0,
                        dy: 0,
                        scale: 1,
                        rotation: 0
                    },
                    v3D: {
                        dataPath3d: "/content/vikingmedieval_game_character-v2.glb",
                        dx: 0,
                        dy: 0,
                        dz: 0,
                        scale: 1,
                        rotation: 0
                    }

                },
                "Gandalf": {
                    health: 34,
                    maxHealth: 50,
                    armorClass: 15,
                    spellSlots: { 1: 3, 2: 2, 3: 1 },
                    spellSlotsUsed: { 1: 1, 2: 0, 3: 0 },
                    v2D: {
                        dataPath2d: "/content/vikingmedieval_game_character-v2.png",
                        dx: 0,
                        dy: 0,
                        scale: 1,
                        rotation: 0
                    },
                    v3D: {
                        dataPath3d: "/content/vikingmedieval_game_character-v2.glb",
                        dx: 0,
                        dy: 0,
                        dz: 0,
                        scale: 1,
                        rotation: 0
                    }
                },
                "Orc1": {
                    health: 34,
                    maxHealth: 50,
                    armorClass: 15,
                    spellSlots: { 1: 3, 2: 2, 3: 1 },
                    spellSlotsUsed: { 1: 1, 2: 0, 3: 0 },
                    v2D: {
                        dataPath2d: "/content/vikingmedieval_game_character-v2.png",
                        dx: 0,
                        dy: 0,
                        scale: 1,
                        rotation: 0
                    },
                    v3D: {
                        dataPath3d: "/content/vikingmedieval_game_character-v2.glb",
                        dx: 0,
                        dy: 0,
                        dz: 0,
                        scale: 1,
                        rotation: 0
                    }
                },
                "Orc2": {
                    health: 34,
                    maxHealth: 50,
                    armorClass: 15,
                    spellSlots: { 1: 3, 2: 2, 3: 1 },
                    spellSlotsUsed: { 1: 1, 2: 0, 3: 0 },
                    v2D: {
                        dataPath2d: "/content/vikingmedieval_game_character-v2.png",
                        dx: 0,
                        dy: 0,
                        scale: 1,
                        rotation: 0
                    },
                    v3D: {
                        dataPath3d: "/content/vikingmedieval_game_character-v2.glb",
                        dx: 0,
                        dy: 0,
                        dz: 0,
                        scale: 1,
                        rotation: 0
                    }
                },
                "Orc3": {
                    health: 34,
                    maxHealth: 50,
                    armorClass: 15,
                    spellSlots: { 1: 3, 2: 2, 3: 1 },
                    spellSlotsUsed: { 1: 1, 2: 0, 3: 0 },
                    v2D: {
                        dataPath2d: "/content/vikingmedieval_game_character-v2.png",
                        dx: 0,
                        dy: 0,
                        scale: 1,
                        rotation: 0
                    },
                    v3D: {
                        dataPath3d: "/content/vikingmedieval_game_character-v2.glb",
                        dx: 0,
                        dy: 0,
                        dz: 0,
                        scale: 1,
                        rotation: 0
                    }
                },
                "Orc4": {
                    health: 34,
                    maxHealth: 50,
                    armorClass: 15,
                    spellSlots: { 1: 3, 2: 2, 3: 1 },
                    spellSlotsUsed: { 1: 1, 2: 0, 3: 0 },
                    v2D: {
                        dataPath2d: "/content/vikingmedieval_game_character-v2.png",
                        dx: 0,
                        dy: 0,
                        scale: 1,
                        rotation: 0
                    },
                    v3D: {
                        dataPath3d: "/content/vikingmedieval_game_character-v2.glb",
                        dx: 0,
                        dy: 0,
                        dz: 0,
                        scale: 1,
                        rotation: 0
                    }
                },
                "tarrasque": {
                    health: 34,
                    maxHealth: 50,
                    armorClass: 15,
                    spellSlots: { 1: 3, 2: 2, 3: 1 },
                    spellSlotsUsed: { 1: 1, 2: 0, 3: 0 },
                    v2D: {
                        dataPath2d: "/content/vikingmedieval_game_character-v2.png",
                        dx: 0,
                        dy: 0,
                        scale: 1,
                        rotation: 0
                    },
                    v3D: {
                        dataPath3d: "/content/vikingmedieval_game_character-v2.glb",
                        dx: 0,
                        dy: 0,
                        dz: 0,
                        scale: 1,
                        rotation: 0
                    }
                }
            },
            owner: 117045338603744539303,
            locations: [
                {
                    name: "location1",
                    description: "description1",
                    data: {}
                },
                {
                    name: "location2",
                    description: "description2",
                    data: {
                        "Gandalf": { X: 10, Y: 0, Z: 0 },
                        "Orc1": { X: 1, Y: 0, Z: 0 },
                        "Orc2": { X: 0, Y: 1, Z: 0 },
                        "Orc3": { X: 0, Y: 10, Z: 0 },
                        "Tarrasque": { X: 10, Y: 10, Z: 0 }
                    },
                    map: {
                        v2D: {
                            dataPath2d: "/content/vikingmedieval_game_character-v2.png",
                            x: 0,
                            y: 0,
                            scale: 1,
                            rotation: 0
                        },
                        v3D: {
                            dataPath3d: "/content/vikingmedieval_game_character-v2.glb",
                            x: 0,
                            y: 0,
                            z: 0,
                            scale: 1,
                            rotation: 0
                        }
                    }
                }
            ],
            notes: [
                {
                    title: "note1",
                    content: "content1"
                },
                {
                    title: "note2",
                    content: "content2"
                }
            ]
        }
    ]

    campaigns.forEach(campaign => {
        return db.run(`INSERT INTO campaigns (id, name, characters, tokens, owner, locations, notes) VALUES (?, ?, ?, ?, ?, ?, ?)`, [campaign.id, campaign.name, JSON.stringify(campaign.characters), JSON.stringify(campaign.tokens), campaign.owner, JSON.stringify(campaign.locations), JSON.stringify(campaign.notes)], (err) => {
            if (err) {
                return console.error(err.message);
            }
        });
    });
}


// user_id references users(id), subclass is array of strings
function createTableCharacters(db, callback) {
    const createTableSQL = `CREATE TABLE IF NOT EXISTS characters (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT,
        name TEXT,
        level INTEGER,
        class TEXT,
        stats TEXT,
        alignment TEXT,
        feats TEXT,
        skills TEXT,
        spells TEXT,
        items TEXT,
        campaign TEXT,
        FOREIGN KEY(user_id) REFERENCES users(id)
    );`;

    return db.run(createTableSQL, (err) => {
        if (err) {
            console.error("err_create", err.message);
            return callback(err);
        }
        console.log("Tabla 'characters' creada o ya existente.");
        callback(null);
    });
}

function insertDataCharacters(db) {
    const characters = [
        {
            user_id: "117045338603744539303",
            name: "Gandalf",
            level: 20,
            class: { "Druid": 3, "Cleric": 1 },
            stats: {
                str: 10,
                dex: 10,
                con: 10,
                int: 20,
                wis: 10,
                cha: 10
            },
            alignment: "Neutral Good",
            feats: ["feat1", "feat2"],
            skills: ["skill1", "skill2"],
            spells: ["fireball", "magic missile"],
            items: ["staff", "robe"],
            campaign: "campaign1"
        }
        , {
            user_id: "117045338603744539303",
            name: "Elarien",
            level: 5,
            class: { "Druid": 3, "Cleric": 1 },
            stats: {
                str: 10,
                dex: 10,
                con: 10,
                int: 10,
                wis: 20,
                cha: 10
            },
            alignment: "Chaotic Good",
            feats: ["feat1", "feat2"],
            skills: ["skill1", "skill2"],
            spells: ["Poison Spray", "Resistance", "Control Flames", "Magic Stone", "Jump", "Find Traps", "Flaming Sphere"],
            items: ["staff", "robe"],
            campaign: "campaign1"
        }
    ];
    characters.forEach(character => {
        return db.run(
            `INSERT INTO characters (user_id, name, level, class, stats, alignment, feats, skills, spells, items, campaign) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                character.user_id,
                character.name,
                character.level,
                JSON.stringify(character.class),
                JSON.stringify(character.stats),
                character.alignment,
                JSON.stringify(character.feats),
                JSON.stringify(character.skills),
                JSON.stringify(character.spells),
                JSON.stringify(character.items),
                character.campaign
            ], (err) => {
                if (err) {
                    return console.error(err.message);
                }
                console.log("Character inserted");
            });
    }
    );
}


function createTableClasses(db, callback) {
    const createTableSQL = `CREATE TABLE IF NOT EXISTS classes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        data TEXT
    );
    `;
    return db.run(createTableSQL, (err) => {
        if (err) {
            console.error("err_create", err.message);
            return callback(err);
        }
        console.log("Tabla 'classes' creada o ya existente.");
        callback(null);
    });
}

function insertDataClasses(db) {
    // load every .json in ./data/class
    const paths = JSON.parse(fs.readFileSync('./data/class/index.json'));
    Object.values(paths).forEach(file => {
        const fullPath = path.resolve(`./data/class/${file}`);
        const rawData = fs.readFileSync(fullPath);
        const classData = JSON.parse(rawData);
        const name = classData.class[0].name;
        const data = JSON.stringify(classData);

        return db.run(`INSERT INTO classes (data, name) VALUES (?, ?)`, [data, name], (err) => {
            if (err) {
                return console.error(err.message);
            }
        });
    });
}


// Uso de funciones
openDatabase((err, db) => {
    if (err) return;
    createTableSpells(db, (err) => {
        if (err) return;
        insertDataSpells(db);
    });
    createTableItems(db, (err) => {
        if (err) return;
        insertDataItems(db);
    });
    createTableRace(db, (err) => {
        if (err) return;
        insertDataRace(db);
    });
    createTableBackground(db, (err) => {
        if (err) return;
        insertDataBackground(db);
    });
    createTableFeat(db, (err) => {
        if (err) return;
        insertDataFeat(db);
    });
    createTableMonsters(db, (err) => {
        if (err) return;
        insertDataMonsters(db);
    });
    createTableUsers(db, (err) => {
        if (err) return;
        insertDataUsers(db);
    });
    createTableCampaigns(db, (err) => {
        if (err) return;
        insertDataCampaigns(db);
    });
    createTableCharacters(db, (err) => {
        if (err) return;
        insertDataCharacters(db);
    });
    createTableClasses(db, (err) => {
        if (err) return;
        insertDataClasses(db);
    });
    db.close();

});

