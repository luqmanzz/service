// all the router code will be placed here
import InsertData from './src/db/CRUD.js';
import validate from './src/login/validate.js';

export default function router(app) {

    app.get('/', (req, res) => {
        res.send('Hello World!');
    });

    app.post('/register-user', (req, res) => {
        let checkParam = validate('register-user', req);
        if (!Object.keys(checkParam)) {
            const result = {
                status: 'failure',
                message: checkParam[Object.keys(checkParam)],
                otp_status: 'unsuccessful'
            }
            res.send(result);
        }

        InsertData("register-user", req).then(resp => {
            const result = {
                status: 'success',
                message: 'an OTP has been sent to your device',
                otp_status: 'successful'
            }
            res.send(result);
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
