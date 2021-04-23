const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const auth = require('../../middleware/auth');
const UserModel = require('../../models/User/user-model');

const isProduction = process.env.NODE_ENV === 'production';
const tokenSettings = {
  path: '/',
  domain: isProduction ? process.env.COOKIE_DOMAIN : 'localhost', // Domain name for the cookie. Defaults to the domain name of the app.
  httpOnly: false, // Flags the cookie to be accessible only by the web server.
  maxAge: 1000 * 60 * 60 * 24, // Convenient option for setting the expiry time relative to the current time in milliseconds.
  secure: isProduction, // Marks the cookie to be used with HTTPS only.
  sameSite: isProduction ? 'None' : 'Lax', // Value of the “SameSite” Set-Cookie attribute.
};

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findByCredentials(email, password);
    if (!user) {
      return res.status(401).send({
        error: 'Login failed! Check authentication credentials',
      });
    }

    const token = await user.generateAuthToken();

    res.setHeader('Access-Control-Allow-Credentials', true);
    res
      .status(200)
      .cookie('token', token, tokenSettings)
      .send({ user, headers: res.headers });
  } catch (error) {
    res.status(400).send(error);
  }
});

// LOGOUT
router.get('/logout', async (req, res) => {
  try {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.status(200).cookie('token', '').send({ message: 'SUCCESS' });
  } catch (error) {
    res.status(400).json({ error: error });
  }
});

// GET USERS LIST
router.get('/list', auth, async (req, res) => {
  try {
    const users = await UserModel.find();
    if (!users) {
      return res.status(401).send({ error: 'Users not found' });
    }
    res.status(201).send({ users });
  } catch (error) {
    res.status(400).send(error);
  }
});

// USER AUTHENTICATION ROUTE
router.get('/auth', async (req, res) => {
  try {
    const token = req.cookies.token;
    const data = jwt.verify(token, process.env.JWT_SECRET);
    const user = await UserModel.findOne({ _id: data._id });
    res.status(200).send({ user });
  } catch (error) {
    console.error({ error });
    res.status(401).send({
      error: 'Not authorized to access this resource',
    });
  }
});

module.exports = router;
