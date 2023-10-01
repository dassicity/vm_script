const express = require('express');

const vm_controller = require('../controllers/vm_controller');
const isAuth = require('../middleware/is_auth');

const router = express.Router();

router.post('/create_instance', vm_controller.post_instance);

router.get('/status', vm_controller.get_status);

module.exports = router;