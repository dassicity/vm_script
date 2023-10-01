// const jwt = require('jsonwebtoken');
// require('dotenv').config();

module.exports = (req, res, next) => {
    if (!req.session.loggedIn) {
        return res.redirect('/');
    }

    next();
}