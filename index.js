import router from './routerFile';

const express = require('express')
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));

router(app);

app.listen(8000, () => {
    console.log('Server has been started in port 8000 successfully');
});