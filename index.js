import router from './routerFile';
import CreateAllTable from './src/db/createAllTable.js';

const express = require('express')
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));
// use req.query to get param from url and req.body to get body params

CreateAllTable();   // so that all tables are created and ready

router(app);

app.listen(8000, () => {
    console.log('Server has been started in port 8000 successfully');
});
