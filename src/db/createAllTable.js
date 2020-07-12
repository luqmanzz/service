import executeQuery from './executeQuery.js';

const queries = {
    'users': `CREATE TABLE IF NOT EXISTS users (
        mobile_number DECIMAL(10) NOT NULL PRIMARY KEY,
        country_code VARCHAR(3) NOT NULL,
        password VARCHAR (255) NOT NULL
        );`
};

function CreateAllTable() {
    Object.keys(queries).forEach(table => {
        executeQuery(table, queries[table])
            .then(() => {
                console.log('table created :', table);
            }).catch(err => {
                console.log(`${table} creation failed: `, err);
            });
    });
}

export default CreateAllTable;