const express = require('express');

const vm_controller = require('../controllers/vm_controller');

const router = express.Router();

router.post('/create_instance', vm_controller.post_instance);

router.post('/status:vmid', vm_controller.get_status);

module.exports = router;