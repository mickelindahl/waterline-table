# Waterline table
Library for creating and dropping tables using sails and
waterline. I created this library because when using
waterline 0.1.3-9 together with sails-postgresql the
tables were not automatically created at orm initialization.
The library takes care of converting the model into a
database definition that can be used to create a table.
That includes making sure autoMigrations is put onto
definition, primaryKey is set and columnType is defined
if not included in autoMigrations. Hopefully future releases
of waterline will take care of this.

## Install
npm install --save waterline-table

## Usage
```JavaScript

    const wt = require('waterline-table');
    const Waterline=require('waterline');

    const orm = new Waterline();

    let model = {
        identity: 'test',
        attributes: {
            id: {type: 'number', autoMigrations: {autoIncrement: true, columnType: 'INTEGER'}},
            expired_at: {type: 'ref', autoMigrations: {columnType: 'TIMESTAMP'}},
            text: {type: 'string'},
        },
        primaryKey: 'id'
    };
    
    orm.registerModel(Waterline.Collection.extend(model));

    const datastores = {
            default: {
                adapter: 'myAdapter',
            }
        };
    
    const adapters = {
        myAdapter: require('sails-disk')
    };
    
    let config = {
        adapters: adapters,
        datastores: datastores
    };
    
    orm.initialize(config, function (err, data) {
            if (err) throw err;

            let options = result.data;
            options.table = 'test';

            wt.create(options)

        })
```
## API
<a name="module_waterline-table"></a>

## waterline-table

* [waterline-table](#module_waterline-table)
    * [~create()](#module_waterline-table..create)
    * [~createAll()](#module_waterline-table..createAll)
    * [~drop()](#module_waterline-table..drop)
    * [~dropAll()](#module_waterline-table..dropAll)

<a name="module_waterline-table..create"></a>

### waterline-table~create()
Create a table in db

- `options` {object}
  - `collections` {object} Waterline collections
  - `datastore` {object} Waterline datastores
  - `table` {string} Name of table to create

returns {Promise}

**Kind**: inner method of [<code>waterline-table</code>](#module_waterline-table)  
<a name="module_waterline-table..createAll"></a>

### waterline-table~createAll()
Create all tables in db

- `options` {object}
  - `collections` {object} Waterline collections
  - `datastore` {object} Waterline datastores

returns {Promise}

**Kind**: inner method of [<code>waterline-table</code>](#module_waterline-table)  
<a name="module_waterline-table..drop"></a>

### waterline-table~drop()
Drop a table in db

- `options` {object}
  - `collections` {object} Waterline collections
  - `datastore` {object} Waterline datastores
  - `table` {string} Name of table to drop

returns {Promise}

**Kind**: inner method of [<code>waterline-table</code>](#module_waterline-table)  
<a name="module_waterline-table..dropAll"></a>

### waterline-table~dropAll()
Drop all tables in db

- `options` {object}
  - `collections` {object} Waterline collections
  - `datastore` {object} Waterline datastores

returns {Promise}

**Kind**: inner method of [<code>waterline-table</code>](#module_waterline-table)  
## Tests

npm test

## Contributing

Feel free to submit issues and pull request on bugs or feature request.

In lieu of a formal styleguide, take care to maintain the existing coding style.
Add unit tests for any new or changed functionality.