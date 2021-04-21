const express = require('express');
const router = express.Router();
const applicationModel = require('../../models/Application/application-model');

// GET CONFIG
router.get('/', (req, res) => {
    applicationModel.findOne({ id: 'appconfig' }).then(data => res.send(data));
});

module.exports = router;
