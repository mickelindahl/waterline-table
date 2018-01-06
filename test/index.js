/**
 *Created by Mikael Lindahl on 2018-01-05
 */

"use strict";

const code = require("code");
const Lab = require("lab");
const pg = require('sails-postgresql');
const disk = require('sails-disk');
const Waterline = require('waterline');
const wt = require('../index');
const dotenv=require('dotenv');

dotenv.config({path:__dirname+'/.env'});

let lab = exports.lab = Lab.script();

async function start(adapter_type) {

    const orm = new Waterline();

    let m1 = {
        identity: 'test_table_1',
        migrate: 'alter',
        datastore: 'test_datastore',
        schema: true,
        attributes: {
            id: {type: 'number', autoMigrations: {autoIncrement: true, columnType: 'INTEGER'}},
            text: {type: 'string', autoMigrations: {columnType: 'TEXT'}},
            created_at: {type: 'string', autoCreatedAt: true, autoMigrations: {columnType: 'TIMESTAMP'}},
            updated_at: {type: 'string', autoUpdatedAt: true, autoMigrations: {columnType: 'TIMESTAMP'}},
        },
        primaryKey: 'id'
    };

    let m2 = {
        identity: 'test_table_2',
        migrate: 'alter',
        datastore: 'test_datastore',
        schema: true,
        attributes: {
            id: {type: 'number', autoMigrations: {autoIncrement: true, columnType: 'INTEGER'}},
            text: {type: 'string'},
        },
        primaryKey: 'id'
    };

    orm.registerModel(Waterline.Collection.extend(m1));
    orm.registerModel(Waterline.Collection.extend(m2));

    let datastores;
    let adapter;

    // Postgresql
    if (adapter_type == "postgresql") {

        datastores = {
            test_datastore: {
                adapter: 'myAdapter',
                url: process.env.POSTGRESQL_URL,
                pool: false,
                ssl: false
            }
        };
        adapter = pg

    } else if (adapter_type == "disk") {

        datastores = {
            test_datastore: {
                adapter: 'myAdapter',
            }
        };
        adapter = disk

    }

    const adapters = {
        myAdapter: adapter
    };

    let config = {
        adapters: adapters,
        datastores: datastores
    };

    return new Promise((resolve, reject) => {

        orm.initialize(config, function (err, data) {
            if (err) reject(err);

            resolve({data, adapter})

        })
    }).catch(err => {

        console.log(err)
    });
    ;
}

let _adapter;

// The order of tests matters!!!
lab.experiment("Waterline table", () => {

    lab.afterEach(() => {

        return new Promise(resolve => {
            _adapter.teardown(null, () => {
                resolve()
            })
        })

    });

    lab.test('Disk create and drop',
        async () => {

            let options;

            await start('disk').then(result => {

                _adapter = result.adapter;

                options = result.data;
                options.table = 'test_table_1';
                return wt.create(options)

            }).then(result => {

                code.expect(result).to.equal('create 1 ok');

                return wt.drop(options)

            }).then(result => {

                code.expect(result).to.equal('drop 1 ok');

                delete options.table;

                return wt.createAll(options)

            }).then(result => {

                code.expect(result).to.equal('create 2 ok');

                return wt.dropAll(options)

            }).then(result => {

                code.expect(result).to.equal('drop 2 ok');

            })
        })
});
