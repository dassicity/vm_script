const express = require('express');

const auth_controller = require('../controllers/auth');

const router = express.Router();

router.post('/signin', auth_controller.signIn);

router.post('/signup', auth_controller.signUp);

module.exports = router;