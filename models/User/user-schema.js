const mongoose = require('mongoose');
const validator = require('validator');

module.exports = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: value => {
            if (!validator.isEmail(value)) {
                throw new Error({ error: 'Invalid Email address' });
            }
        },
    },
    password: {
        type: String,
        required: true,
        minLength: 7,
        select: false,
    },
    isActive: {
        type: Boolean,
        required: true,
        default: false,
    },
});
