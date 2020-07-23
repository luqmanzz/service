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

function constructSetVerified(request) {
    const body = request.body;
    const mobile = body.mobile_number;
    return {
        'users': `UPDATE users
        SET verified = true
        WHERE mobile_number = ${mobile};`
    }
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

function constructGetOTPQuery(request) {
    const body = request.body;
    const mobile = body.mobile_number;
    return {
        'users': `select otp
        from users
        WHERE mobile_number = ${mobile};`
    };
}

function getQuery(api, request) {
    switch (api) {
        case "register-user": return constructRegisterQuery(request);
        case "send-otp": return constructOTPquery(request);
        case "verify-otp": return constructGetOTPQuery(request);
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
    const tableName = Object.keys(query)[0];
    query = query[tableName];
    return execute(tableName, query)
        .then((resp) => {
            executeDeleteOTP(request);
            return resp;
        }).catch(err => {
            console.log('failed to delete OTP: ', err);
        });
}

async function executeGetQuery(tableName, query) {
    return await executeQuery(tableName, query).then((resp) => {
        return new Promise((resolve, reject) => { resolve(resp && resp.rows) });
    }).catch(err => {
        console.log(`error occured when getting data from ${tableName}`, err);
        return new Promise((resolve, reject) => { reject(err) });
    });
}

function getOTP(api, request) {
    const otp = request.body.otp;
    let query = getQuery(api, request);
    let tableName = Object.keys(query)[0];
    query = query[tableName];
    return executeGetQuery(tableName, query)
        .then((resp) => {
            const dbOTP = resp && resp[0] && resp[0].otp;
            if (dbOTP === otp) {
                query = constructSetVerified(request);
                let tableName = Object.keys(query)[0];
                query = query[tableName];
                return execute(tableName, query)
                    .then(() => {
                        return new Promise((resolve, reject) => { resolve(true) });
                    }).catch(err => {
                        return new Promise((resolve, reject) => { reject(err) });
                    });
            } else if (!dbOTP) {
                return new Promise((resolve, reject) => { resolve('noRecord') });
            } else {
                return new Promise((resolve, reject) => { resolve(false) });
            }
        }).catch(err => {
            console.log('failed to fetch otp from users for ', request.body.OTP);
            return new Promise((resolve, reject) => { reject(err) });
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
    saveOTP,
    executeGetQuery, //for globally getting data
    getOTP
};
