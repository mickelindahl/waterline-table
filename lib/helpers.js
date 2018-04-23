/**
 *Created by Mikael Lindahl on 2018-01-05
 */

"use strict"

//DB Type conversion type -> columnType
const TYPES = {
    number: 'INTEGER',
    string: 'TEXT',
    boolean: 'BOOLEAN',
    json: 'JSON'
}

/**
 * Crete model definitions that cane to be used for defining tables
 * using `adapter.define` or dropping table with `adapter.drop`
 *
 * @param {object} waterline collections
 * @param {object} waterline datastores
 * @returns {object} model definitions by adapter
 */
function createDefinitions(collections, datastores, tables) {

    // Pull out model configuration
    let models = {};
    for (let key in collections) {

        let model = collections[key];


        if ((model.identity == 'archive')
            || (tables && tables.indexOf(model.identity) == -1)){

            continue
        }

        models[model.identity] = {
            attributes: model.attributes,
            datastore: model.datastore,
            primaryKey: model.primaryKey

        }

    }

    // Create model definitions by adapter
    let definitions = [];
    for (let table in models) {

        let model = models[table];
        let adapter = datastores[model.datastore].adapter;

        let definition = {
            config: JSON.parse(JSON.stringify(model.attributes)),
            datastore: model.datastore,
            adapter,
            table
        }


        for (let key2 in model.attributes) {

            definition.config[key2].columnName = key2;

            if (key2 == model.primaryKey) {

                definition.config[key2].primaryKey = true

            }

            if (model.attributes[key2].autoMigrations) {
                for (let key3 in model.attributes[key2].autoMigrations) {

                    let migration = model.attributes[key2].autoMigrations[key3]
                    definition.config[key2][key3] = migration


                }

                delete definition.config[key2].autoMigrations
            }

            if (!definition.config[key2].columnType) {

                let type = definition.config[key2].type;

                if (definition.config[key2].autoIncrement && type=='number'){

                    definition.config[key2].columnType='SERIAL'

                }else{

                    definition.config[key2].columnType = TYPES[type]
                    
                }
            }
        }

        definitions.push(definition)

    }
    return definitions
}

/**
 * Create tables using adapter define method
 *
 * @param {object} waterline collections
 * @param {object} waterline datastores
 * @returns {Promise.<void>}
 */
async function create(collections, datastores, tables) {

    let definitions = createDefinitions(collections, datastores, tables);

    for (let i = 0; i < definitions.length; i++) {

        let d = definitions[i]

        await new Promise((resolve, reject) => {

            d.adapter.define(d.datastore, d.table, d.config, (err, res) => {

                if (err) {

                    reject(err)

                }

                resolve()

            })
        })
    }

    return "create "+ definitions.length + " ok"
}

/**
 * Function to drop tables from database
 *
 * @param {object} waterline collections
 * @param {object} waterline datastores
 */
async function drop(collections, datastores, tables) {

    let definitions = createDefinitions(collections, datastores, tables);

    for (let i = 0; i < definitions.length; i++) {

        let d = definitions[i];

        await new Promise((resolve, reject) => {

            d.adapter.drop(d.datastore, d.table, undefined, (err, res) => {

                if (err) {

                    reject(err)

                }

                resolve()

            })
        })
    }

    return "drop "+ definitions.length +" ok"
}

function assert(collections, table) {

    if (!collections[table]) {

        throw new Error('Table does not exist!')

    }
}

module.exports={

    assert,
    create,
    drop
}