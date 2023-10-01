const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const vm_router = require('./routers/vm_router');

const app = express();

const PORT = 1339;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

app.use('/vm', vm_router);

app.listen(PORT, () => {
    console.log("Connected to port!");
})