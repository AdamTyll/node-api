const mongoose = require('mongoose');
const appConfigSchema = require('./application-schema');

const appConfigModel = mongoose.model('appConfig', appConfigSchema);

module.exports = appConfigModel;
