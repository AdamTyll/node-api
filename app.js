const express = require('express');
const mongoose = require('mongoose');
const errorHandler = require('errorhandler');
const path = require('path');
const dotenv = require('dotenv');
var cors = require('cors');

const usersModel = require('./models/User/user-model');

//ENV CONFIG
dotenv.config();

const {
    ADMIN_USER_EMAIL,
    ADMIN_USER_PASS,
    PUBLIC_FILES_PATH,
    PUBLIC_FILES_DIR,
    DATABASE_URL,
    DATABASE_USER,
    DATABASE_PASSWORD,
    COOKIE_DOMAIN,
} = process.env;

// MONGO CONNECTION
mongoose.promise = global.Promise;
mongoose.set('useFindAndModify', false);
mongoose.connect(DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    auth: { user: DATABASE_USER, password: DATABASE_PASSWORD },
});

// MONGOOSE EVENTS
mongoose.connection.on('connected', () => console.log('Database connected'));
mongoose.connection.on('error', err => {
    console.error(err);
});

// APP SETTINGS
const app = express();

app.use(errorHandler());
const corsOptions = {
    origin: [
        '*',
        COOKIE_DOMAIN,
        'http://127.0.0.1',
        'http://104.142.122.231',
        'http://localhost:3000',
    ],
    credentials: true,
    exposedHeaders: ['set-cookie'],
};
app.use(cors(corsOptions));
app.use(
    PUBLIC_FILES_PATH,
    express.static(path.join(__dirname, PUBLIC_FILES_DIR))
);
app.use(express.json());

// ROUTES
const userRoute = require('./routes/User');
app.use('/user', userRoute);

const applicationRoute = require('./routes/Application');
app.use('/app', applicationRoute);

// PROPAGATE ADMIN USER
async function createAdminIfNotExists() {
    const user = await usersModel
        .findByCredentials(ADMIN_USER_EMAIL, ADMIN_USER_PASS)
        .catch(e => console.error(e));
    if (!user) {
        const adminUser = new usersModel({
            name: 'admin',
            email: ADMIN_USER_EMAIL,
            password: ADMIN_USER_PASS,
        });
        await adminUser.save();
    }
}

createAdminIfNotExists();

// SERVER
app.listen(4000, () => console.log('Server running on http://localhost:4000/'));
