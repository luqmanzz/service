// all the router code will be placed here
import { InsertData, saveOTP } from './src/db/CRUD.js';
import validate from './src/login/validate.js';
import sendOTP from './src/login/sendOTP.js';

function unknownResponse(res, additionalMsg) {
    const error = 'Unknown error occured';
    const errorMessage = !additionalMsg ? error : `${additionalMsg} and internal ${error}`;
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

    app.get('/send-otp', (req, res) => {
        let checkParam = validate('send-otp', req);
        if (Object.keys(checkParam).includes('false')) {
            const result = {
                status: 'failure',
                message: checkParam[Object.keys(checkParam)]
            }
            res.send(result);
        } else {
            const number = `${req.body.mobile_number}`;
            sendOTP(number).then((resp) => {
                req.body.OTP = resp;
                saveOTP('send-otp', req).then(() => {
                    const result = {
                        status: 'success',
                        message: 'An OTP has been sent to your device'
                    }
                    res.send(result);
                }).catch(() => {
                    unknownResponse(res, 'OTP Sent');
                });
            }).catch(() => {
                const result = {
                    status: 'failure',
                    message: 'OTP failed to send'
                }
                res.send(result);
            });
        }
    });

    app.get('/verify-otp', (req, res) => {
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
                            message: 'An OTP has been sent to your device',
                            otp_status: 'successful'
                        }
                        res.send(result);
                    }).catch(() => {
                        unknownResponse(res, 'OTP Sent');
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
