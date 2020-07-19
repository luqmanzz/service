// all the router code will be placed here
import InsertData from './src/db/CRUD.js';
import validate from './src/login/validate.js';
import sendOTP from './src/login/sendOTP.js';

function unknownResponse(res) {
    const errorMessage = 'Unknown error occured';
    const result = {
        status: 'failure',
        message: errorMessage,
        otp_status: 'unsuccessful'
    }
    res.send(result);
}

export default function router(app) {

    app.get('/', (req, res) => {
        res.send('Hello World!');
    });

    app.post('/register-user', (req, res) => {
        let checkParam = validate('register-user', req);
        checkParam.then((checkParam) => {
            if (Object.keys(checkParam).includes('false')) {
                const result = {
                    status: 'failure',
                    message: checkParam[Object.keys(checkParam)],
                    otp_status: 'unsuccessful'
                }
                res.send(result);
            } else {
                const number = `${req.body.mobile_number}`;
                sendOTP(number).then((resp) => {    // works only for indian number
                    req.body.OTP = resp;
                    InsertData("register-user", req).then(response => {
                        const result = {
                            status: 'success',
                            message: 'an OTP has been sent to your device',
                            otp_status: 'successful'
                        }
                        res.send(result);
                    }).catch(() => {
                        unknownResponse(res);
                    });
                }).catch(() => {
                    const result = {
                        status: 'failure',
                        message: 'OTP failed to send',
                        otp_status: 'unsuccessful'
                    }
                    res.send(result);
                });
            }
        }).catch(() => {
            unknownResponse(res);
        });
    });
}
