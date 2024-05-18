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
        id INTEGER PRIMARY KEY AUTOINCREMENT,
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

    files.forEach(file => {
        const fullPath = path.resolve(file);
        const rawData = fs.readFileSync(fullPath);
        const spells = JSON.parse(rawData);

        return spells.spell.forEach(spell => {
            const data = JSON.stringify(spell);
            return db.run(`INSERT INTO spells (data) VALUES (?)`, [data], (err) => {
                if (err) {
                    return console.error(err.message);
                }
                console.log(`Se ha insertado un registro a la base de datos.`);
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

// user_id references users(id), subclass is array of strings
function createTableCharacters(db, callback) {
    const createTableSQL = `CREATE TABLE IF NOT EXISTS characters (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT,
        name TEXT,
        level INTEGER,
        class TEXT,
        subclass TEXT,
        stats TEXT,
        alignment TEXT,
        skills TEXT,
        other_class TEXT,
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

