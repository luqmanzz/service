import { executeGetQuery } from '../db/CRUD.js';

function validateUser(request) {
    const body = request.body;
    const mobile = body.mobile_number;
    const countryCode = body.country_code;
    const password = body.password;
    const getVerified = constructVerifiedQuery(request);
    return executeGetQuery('users', getVerified).then((resp) => {
        let result = (resp[0] && resp[0].verified === false) ? false : true;
        if (!Object.keys(resp).length) {
            result = false;
        }
        if (!result) {
            return !validateCountryCode(countryCode) ? { false: 'country code is invalid' } :
                (
                    !validateMobile(mobile) ? { false: 'Please enter a valid device number' } :
                        (!validatePassword(password) ? { false: `password doesn't match password policy` } : { true: 'OK' })
                );
        } else {
            return ({
                false: `device already registered`
            });
        }
    }).catch(err => {
        console.log(`error occured when getting verified data for `, mobile + err);
        return ({
            false: `unknown error occured`
        });
    });
}

function validateNumberAndCode(request) {
    const body = request.body;
    const mobile = body.mobile_number;
    const countryCode = body.country_code;
    if (validateCountryCode(countryCode)) {
        return (!validateMobile(mobile) ? { false: 'Please enter a valid device number' }
            : { true: 'OK' });
    } else {
        return { false: 'country code is invalid' };
    }
}

function validateVerifyOTP(request) {
    const body = request.body;
    const mobile = body.mobile_number;
    const countryCode = body.country_code;
    const otp = body.otp;
    if (validateCountryCode(countryCode)) {
        return (!validateMobile(mobile) ? { false: 'Please enter a valid device number' }
            : (!isValidOTP(otp) ? { false: 'Please enter a six digit OTP' } : { true: 'OK' }));
    } else {
        return { false: 'country code is invalid' };
    }
}

function isValidOTP(otp) {
    return (!isNaN(otp) && otp.length === 6) ? true : false;
}

function constructVerifiedQuery(request) {
    return `select verified from users where mobile_number=${request.body.mobile_number}; `;
}

function validateCountryCode(code) {
    let regex = /^(\+?\d{1,3}|\d{1,4})$/;
    return regex.test(code) ? true : false;
}

function validateMobile(number) {
    let regex = /^([0|\+[0-9]{1,5})?([7-9][0-9]{9})$/;
    return regex.test(number) ? true : false;
}

function validatePassword(password) {
    let regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return regex.test(password) ? true : false;
}

export default function validate(api, request) {
    switch (api) {
        case "register-user": return validateUser(request);
        case "send-otp": return validateNumberAndCode(request);
        case "verify-otp": return validateVerifyOTP(request);
        default: break;
    }
}
