const { Pool } = require('pg');

export const pool = new Pool({
    user: 'test',
    host: 'localhost',
    database: 'testdb',
    password: '1234',
    port: 5432,
});

pool.on('error', (err, client) => {
    console.error('Error:', err);
    return err;
});