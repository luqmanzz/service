import executeQuery from './executeQuery.js';

function constructRegisterQuery(request) {
    const body = request.body;
    const mobile = body.mobile_number;
    const countryCode = body.country_code;
    const password = body.password;
    return {
        'users': `INSERT INTO 
        users (mobile_number,country_code,password) 
        VALUES(
            '${mobile}','${countryCode}','${password}'
        );`
    };
}

function getQuery(api, request) {
    switch (api) {
        case "register-user": return constructRegisterQuery(request);
        default: break;
    }
}

function InsertData(api, request) {
    let query = getQuery(api, request);
    const tableName = Object.keys(query)[0];
    query = query[tableName];
    return executeQuery(tableName, query)
        .then((resp) => {
            console.log('table updated :', tableName);
            return new Promise((resolve, reject) => { resolve(resp) });
        }).catch(err => {
            console.log(`${tableName} table updation failed: `, err);
            return new Promise((resolve, reject) => { reject(err) });
        });
}

export default InsertData;