const express = require('express');
// const bodyParser = require('body-parser');

const config = require('./config/index');
const routes = require('./routes');

const app = express();

// middleware
// parse application/json
// app.use(bodyParser.json());

// api routes
app.use('/', routes);

app.listen(config.port, () => {
    console.log(`Started on port ${config.port}`);
});
// console.log(config.port);