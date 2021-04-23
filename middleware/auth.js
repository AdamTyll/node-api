const jwt = require('jsonwebtoken');
const UserModel = require('../models/User/user-model');

const auth = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    const data = jwt.verify(token, process.env.JWT_SECRET);
    const user = await UserModel.findOne({ _id: data._id });
    req.user = user;
    next();
  } catch (error) {
    res.status(401).send({
      error: 'Not authorized to access this resource',
    });
  }
};
module.exports = auth;
