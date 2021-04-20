const express = require('express');
const errorHandler = require('errorhandler');
const path = require('path');

const { PUBLIC_FILES_PATH, PUBLIC_FILES_DIR } = process.env;

// APP SETTINGS
const app = express();

app.use(errorHandler());
app.use(
    PUBLIC_FILES_PATH,
    express.static(path.join(__dirname, PUBLIC_FILES_DIR))
);

// ROUTES

// SERVER
app.listen(4000, () => console.log('Server running on http://localhost:4000/'));
