
import { pool } from './connecting.js';

async function createUser(tableName, args = {}) {
    const query =
        `INSERT INTO 
            users (mobile_number,country_code,password) 
            VALUES(
                '9080456922','+91','Kadarmds@123'
        );`;
    return new Promise((resolve, reject) => {
        pool.connect((err, client, done) => {
            if (err) throw err;
            done();
            client.query(query, (err, res) => {
                if (err) {
                    console.log('ERR:', err.stack);
                    reject(err);
                } else {
                    console.log('user added successfully');
                    client.end();
                    resolve(res);
                }
            });
        });
    });
}

export default createUser;
