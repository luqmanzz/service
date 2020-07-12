function validateUser(request) {
    var body = request.body;
    let mobile = body.mobile_number;
    let countryCode = body.country_code;
    let password = request.password;
    return !validateCountryCode(countryCode) ? { false: 'country code is invalid' } :
        (
            !validateMobile(mobile) ? { false: 'mobile number is invalid' } :
                ((!validatePassword(password)) ? { false: `password doesn't match password policy` } : { true: 'OK' })
        );
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
        default: break;
    }
}