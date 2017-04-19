const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const path = require('path');
const api = require('./api');

const app = express();

app.use(bodyParser.json({limit: '50mb'}));
app.use(morgan('combined'));

const assetsPath = path.join(__dirname, '..', 'dist');
app.use('/', express.static(assetsPath));

app.use('/api', api);

const port = process.env.PORT;
app.listen(port || 4000, () => console.log(`Listening on ${port || 4000}`));
