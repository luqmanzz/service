import router from './routerFile';
import CreateAllTable from './src/db/createAllTable.js';

const express = require('express');
const rateLimit = require("express-rate-limit");
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));
// use req.query to get param from url and req.body to get body params
const apiLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 15 minutes
    max: 10,
    message: "Too many attempts called from this IP, please try again after one hour"
});
app.use('/register-user', apiLimiter);

CreateAllTable();   // so that all tables are created and ready

router(app);

app.listen(8000, () => {
    console.log('Server has been started in port 8000 successfully');
});
