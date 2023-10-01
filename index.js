const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session')
require('dotenv').config();
const MongoDBStore = require('connect-mongodb-session')(session);

const User = require('./models/users');


const vm_router = require('./routers/vm_router');
const auth_router = require('./routers/auth');

const app = express();

const PORT = process.env.PORT;

const store = new MongoDBStore(
    {
        uri: process.env.MONGODB_URI,
        collection: 'sessions'
    }
);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(session({ secret: 'dassic', saveUninitialized: false, resave: false, store: store }));

app.use((req, res, next) => {
    // if (!req.session.user) {
    //     console.log("Inside app.js -> No user");
    //     return next();
    // }

    console.log("Hello");
    User.findById('651945650994242b6ede7067')
        .then(user => {
            if (!user) {
                next();
            }
            req.user = user;
            // console.log("Inside app.js -> findById");
            next();
        })
        .catch(err => {
            // console.log(err)
            throw new Error(err);
        });
})

app.use('/auth', auth_router);
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