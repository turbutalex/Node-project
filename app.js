const express = require('express');
const  path =require('path');
const routes = require('./routes/index');
const bodyparser = require('body-parser');

const app = express();
app.use(express.static('public'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(bodyparser.urlencoded({extended:true }));
app.use('/', routes);


module.exports = app;