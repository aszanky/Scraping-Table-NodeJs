const mongoose = require('mongoose');
const config = require('./config/index');

module.exports = callback => {
    let db = mongoose.connect(config.mongoUrl, { useNewUrlParser: true });
    callback(db);
}
