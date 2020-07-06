// all the router code will be placed here
import createUser from './src/db/createUser.js';
import createTable from './src/db/creatingTable.js';
const createUserTableName = 'users';

export default function router(app) {

    app.get('/', (req, res) => {
        console.log('success', req);
        res.send('Hello World!');
    });


    app.get('/create', (req, res) => {          // try to call this on app start
        createTable(createUserTableName, req);
        res.send('users table created!');
    });

    app.post('/register-user', (req, res) => {
        console.log('params', req.params);
        console.log('body', req.body);
        console.log('query', req.query);
        console.log('req', req);
        createUser(createUserTableName).then(resp => {
            console.log('response', resp.error);
            const result = {
                status: 'success',
                message: 'an OTP has been sent to your device',
                otp_status: 'successful'
            }
            res.send('user created!');
        }).catch((err) => {
            const errorMessage = err.toString().includes('duplicate key value violates unique constraint') ? 'device already registered' : 'unknown error occured';
            const result = {
                status: 'failure',
                message: errorMessage,
                otp_status: 'unsuccessful'
            }
            res.send(result);
        });
    });
}