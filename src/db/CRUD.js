import executeQuery from './executeQuery.js';

function constructRegisterQuery(request) {
    const body = request.body;
    const mobile = body.mobile_number;
    const countryCode = body.country_code;
    const password = body.password;
    const otp = body.OTP ? body.OTP : '';
    return {
        'users': `INSERT INTO 
        users (mobile_number,country_code,password,otp) 
        VALUES(
            '${mobile}','${countryCode}','${password}','${otp}'
        );`
    };
}

function constructOTPquery(request) {
    const body = request.body;
    const mobile = body.mobile_number;
    const otp = body.OTP;
    return {
        'users': `UPDATE users
        SET otp = '${otp}'
        WHERE mobile_number = ${mobile};`
    };
}

function constructDeleteOTPQuery(request) {
    const body = request.body;
    const mobile = body.mobile_number;
    return {
        'users': `UPDATE users
        SET otp = ''
        WHERE mobile_number = ${mobile};`
    };
}

function getQuery(api, request) {
    switch (api) {
        case "register-user": return constructRegisterQuery(request);
        case "send-otp": return constructOTPquery(request);
        default: break;
    }
}

function executeDeleteOTP(request) {
    let query = constructDeleteOTPQuery(request);
    let tableName = Object.keys(query)[0];
    query = query[tableName];
    console.log('new OTP will be deleted after 15mins');
    setTimeout(function () {
        execute(tableName, query);
    }, 15 * 60 * 1000); // have to check if this need to be consoled for failure in otp removal [internal]
}

function saveOTP(api, request) {
    let query = getQuery(api, request);
    query = query[Object.keys(query)[0]];
    return execute('users', query)
        .then((resp) => {
            executeDeleteOTP(request);
            return resp;
        }).catch(err => {
            console.log('failed to delete OTP: ', err);
        });
}

function InsertData(api, request) {
    let query = getQuery(api, request);
    const tableName = Object.keys(query)[0];
    query = query[tableName];

    return execute(tableName, query)
        .then((resp) => {
            executeDeleteOTP(request);
            return resp;
        }).catch(err => {
            if (err.toString().includes('duplicate key value violates unique constraint')) {
                query = constructOTPquery(request);
                query = query[Object.keys(query)[0]];
                return execute(tableName, query).then((resp) => {
                    executeDeleteOTP(request);
                    return resp;
                }).catch(err => {
                    console.log('failed to delete OTP: ', err);
                });
            } else {
                return err;
            }
        });
}

function execute(tableName, query) {
    return executeQuery(tableName, query)
        .then((resp) => {
            console.log('table updated :', tableName);
            return new Promise((resolve, reject) => { resolve(resp) });
        }).catch(err => {
            console.log(`${tableName} table updation failed: `, err);
            return new Promise((resolve, reject) => { reject(err) });
        });
}

export {
    InsertData,
    saveOTP
};
