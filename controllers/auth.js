const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/users');
require('dotenv').config();

exports.signUp = (req, res, next) => {

    const email = req.body.email;
    const password = req.body.password;

    console.log("Inside Sign Up");

    bcrypt.hash(password, 12)
        .then(hashedPassword => {
            const user = new User({
                email: email,
                password: hashedPassword,
                numOfVMId: 0,
                vmIDs: []
            });

            return user.save();
        })
        .then(user => {
            res.status(201).redirect('/');
        })
        .catch(error => {
            if (!error.statusCode) {
                error.statusCode = 500;
            }
            next(error);
        })
}

exports.signIn = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    let loadedUser;

    console.log("Inside Sign In");

    User.findOne({ email: email })
        .then(user => {
            if (!user) {
                const error = new Error("A user with this email id was not found.")
                error.statusCode = 401;
                throw error;
            }
            loadedUser = user;
            return bcrypt.compare(password, user.password);
        })
        .then(isTrue => {
            if (!isTrue) {
                const error = new Error("Passwords do not match.")
                error.statusCode = 401;
                throw error;
            }
            // const token = jwt.sign({
            //     email: loadedUser.email,
            //     userId: loadedUser._id.toString()
            // }, process.env.WEB_TOKEN, {
            //     expiresIn: '1h'
            // })

            // req.user = loadedUser;
            // req.token = token;
            // console.log(req.user);

            // res.status(201).json({
            //     token: token,
            //     userId: loadedUser._id.toString()

            // });

            console.log(req.session);

            req.session.loggedIn = true;
            req.session.user = user;

            return req.session.save(err => {
                res.redirect('/');
            });

        })
        .catch(error => {
            if (!error.statusCode) {
                error.statusCode = 500;
            }
            next(error);
        })
}