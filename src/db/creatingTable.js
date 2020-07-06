import { pool } from './connecting.js';

function createTable(tableName, args = {}) {
    const query =
        `CREATE TABLE IF NOT EXISTS ${tableName} (
    mobile_number DECIMAL(10) NOT NULL PRIMARY KEY,
    country_code VARCHAR(3) NOT NULL,
    password VARCHAR (255) NOT NULL
    );`;
    console.log('psql', args);
    return new Promise((resolve, reject) => {
        pool.connect((err, client, done) => {
            if (err) throw err;
            client.query(query, (err, res) => {
                if (err) {
                    console.log('ERR:', err.stack);
                    console.log('some error', err);
                    reject(err);
                } else {
                    console.log(res);
                    console.log('Table is successfully created');
                    client.end();
                    resolve(res);
                }
            });
        });
    });
}

export default createTable;