const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    numOfVMId: {
        type: Number,
        default: 0
    },
    vmIDs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Machine'
    }],
});

const User = mongoose.model('User', userSchema);

module.exports = User;