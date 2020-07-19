const API_KEY = `tKgU6d5Wn8Qhuk1HFcSpTvyeZAG23Rxs9wbB0MqOEIjoV47LalSo5U3MV0kuWGcIENQngvZAtOBDYdJC`;
//current APIKEY registered with fast2sms
var unirest = require("unirest");
var req = unirest("GET", "https://www.fast2sms.com/dev/bulk");

export default function sendOTP(number) {
    const OTP = generateOTP();
    req.query({
        "authorization": API_KEY,
        "sender_id": "FSTSMS",
        "language": "english",
        "route": "qt",
        "numbers": `${number}`,
        "message": "32020",
        "variables": "{AA}",
        "variables_values": `${OTP}`
    });
    req.headers({
        "cache-control": "no-cache"
    });
    return new Promise((resolve, reject) => {
        req.end(function (res) {
            if (res.error) reject(res.error);
            return resolve(OTP);
        });
    });
}

function generateOTP() {
    const otp = parseInt(Math.floor(100000 + Math.random() * 900000).toString().substr(0, 4));  // generates a random 4 digit number
    return otp;
}
