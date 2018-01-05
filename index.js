/**
 *Created by Mikael Lindahl on 2018-01-05
 */

"use strict";

const Joi = require('joi');
const helpers = require('./lib/helpers');
const schema = require('./lib/schema');

/**@module waterline-table */

/**
 * Create a table in db
 *
 * - `options` {object}
 *   - `collections` {object} Waterline collections
 *   - `datastore` {object} Waterline datastores
 *   - `table` {string} Name of table to create
 *
 * returns {Promise}
 */
async function create(options) {

    Joi.assert(options, schema.single, "Bad create options for waterline-table");

    assert(options.collections, options.table);

    return helpers.create(options.collections, options.datastores, [options.table])

}

/**
 * Create all tables in db
 *
 * - `options` {object}
 *   - `collections` {object} Waterline collections
 *   - `datastore` {object} Waterline datastores
 *
 * returns {Promise}
 */
async function createAll(options) {

    Joi.assert(options, schema.all, "Bad createAll options for waterline-table");

    return helpers.create(options.collections, options.datastores)

}

/**
 * Drop a table in db
 *
 * - `options` {object}
 *   - `collections` {object} Waterline collections
 *   - `datastore` {object} Waterline datastores
 *   - `table` {string} Name of table to drop
 *
 * returns {Promise}
 */
async function drop(options) {

    Joi.assert(options, schema.single, "Bad drop options for waterline-table");

    assert(options.collections, options.table);

    return helpers.drop(options.collections, options.datastores, [options.table])

}

/**
 * Drop all tables in db
 *
 * - `options` {object}
 *   - `collections` {object} Waterline collections
 *   - `datastore` {object} Waterline datastores
 *
 * returns {Promise}
 */
async function dropAll(options) {

    Joi.assert(options, schema.all, "Bad drop options for waterline-table");

    return helpers.drop(options.collections, options.datastores)

}

module.exports = {
    create,
    createAll,
    drop,
    dropAll
}

