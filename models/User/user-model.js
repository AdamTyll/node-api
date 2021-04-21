const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userSchema = require('./user-schema');

//hash password before user save
userSchema.pre('save', async function (next) {
    const user = this;

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }

    next();
});

//generate authentication token
userSchema.methods.generateAuthToken = async function () {
    const { JWT_SECRET } = process.env;
    const user = this;
    const token = jwt.sign({ _id: user._id }, JWT_SECRET);

    return token;
};

//find user by credentials (email,password)
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await UsersModel.findOne({ email });
    const result = await UsersModel.findOne({ email }).select('password');

    if (!result) {
        throw new Error({ error: 'Invalid login credentials' });
    }

    const isPasswordMatch = await bcrypt.compare(password, result.password);

    if (!isPasswordMatch) {
        throw new Error({ error: 'Invalid login credentials' });
    }

    return user;
};

const UsersModel = mongoose.model('User', userSchema);

module.exports = UsersModel;
