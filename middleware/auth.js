const jwt = require('jsonwebtoken');
const UsersModel = require('../models/User/user-model');

const auth = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        const data = jwt.verify(token, process.env.JWT_SECRET);
        const user = await UsersModel.findOne({ _id: data._id });
        req.user = user;
        next();
    } catch (error) {
        console.error({ error });
        res.status(401).send({
            middlewareAuthError: 'Not authorized to access this resource',
        });
    }
};
module.exports = auth;
