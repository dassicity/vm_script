const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();


const vm_router = require('./routers/vm_router');

const app = express();

const PORT = process.env.PORT;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

app.use('/', vm_router);

mongoose.connect(process.env.MONGODB_URI)
    .then(res => {
        const server = app.listen(PORT);
        if (server) {
            console.log("Connected to DB");
        }
    })
    .catch(err => {
        console.log(err);
    })