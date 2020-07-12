import { pool } from './connecting.js';

function executeQuery(tableName, query) {
    return new Promise((resolve, reject) => {
        pool.connect((err, client, done) => {
            if (err) throw err;
            client.query(query, (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res);
                }
                client.end();
            });
        });
    });
}

export default executeQuery;