
const express = require('express');
const config = require('../config/index');
const initializeDb = require('../db');
const kurs = require('../controllers/kurs');

let router = express();

//connect to db
initializeDb(db => {
    router.use('/api', kurs({ config, db}));
})

module.exports = router;