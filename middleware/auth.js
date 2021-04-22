const jwt = require('jsonwebtoken');
const UsersModel = require('../models/User/user-model');

const auth = async (req, res, next) => {
    try {
        console.log({ req });
        const token = req.cookies.token;
        console.log({ token });
        const data = jwt.verify(token, process.env.JWT_KEY);
        const user = await UsersModel.findOne({ _id: data._id });
        req.user = user;
        next();
    } catch (error) {
        console.log({ auth_error: error });
        res.status(401).send({
            middlewareAuthError: 'Not authorized to access this resource',
        });
    }
};
module.exports = auth;
