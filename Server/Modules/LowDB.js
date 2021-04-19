/* ============================================================================
                              DATABASE LOWDB
=============================================================================== */

const Category = (Database) => {
    var low = require('lowdb');
    FileSync = require('lowdb/adapters/FileSync');
    adapter = new FileSync(`./Server/Database/${Database}.json`);
    db = low(adapter);
    return db
}

module.exports = Category;