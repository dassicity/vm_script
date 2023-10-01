const mongoose = require('mongoose');

const vmSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    instance_id: {
        type: String,
    },
});

const Machine = mongoose.model('Machine', vmSchema);

module.exports = Machine;