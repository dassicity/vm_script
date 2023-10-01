const express = require('express');

const vm_controller = require('../controllers/vm_controller');

const router = express.Router();

router.post('/instance', vm_controller.post_instance);

module.exports = router;