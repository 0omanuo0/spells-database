const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

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

        return db.run(`INSERT INTO spells (name, class, optionalClass, data) VALUES (?, ?, ?, ?)`, [name, JSON.stringify(classes), JSON.stringify(optionalClasses), JSON.stringify(data)], (err) => {
            if (err) {
                return console.error(err.message);
            }
            console.log(`Se ha insertado un registro spell a la base de datos.`);
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
            console.log(`Se ha insertado un registro item a la base de datos.`);
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
            console.log(`Se ha insertado un registro item a la base de datos.`);
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
            console.log(`Se ha insertado un registro item a la base de datos.`);
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
            console.log(`Se ha insertado un registro item a la base de datos.`);
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

// user_id references users(id), subclass is array of strings
function createTableCharacters(db, callback) {
    const createTableSQL = `CREATE TABLE IF NOT EXISTS characters (
        id INTEGER  AUTOINCREMENT,
        user_id TEXT PRIMARY KEY,
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
    console.log("PATHS: ", paths);
    Object.values(paths).forEach(file => {
        console.log("FILE: ", file);
        const fullPath = path.resolve(`./data/class/${file}`);
        const rawData = fs.readFileSync(fullPath);
        const classData = JSON.parse(rawData);
        const name = classData.class[0].name;
        const data = JSON.stringify(classData);

        return db.run(`INSERT INTO classes (data, name) VALUES (?, ?)`, [data, name], (err) => {
            if (err) {
                return console.error(err.message);
            }
            console.log(`Se ha insertado un registro class a la base de datos.`);
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
    createTableUsers(db, (err) => {
        if (err) return;
    });
    createTableCharacters(db, (err) => {
        if (err) return;
    });
    createTableClasses(db, (err) => {
        if (err) return;
        insertDataClasses(db);
    });
    db.close();

});

