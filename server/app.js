require('dotenv').config()
const express = require('express');
const app = express();

const cors = require('cors')
const mongoose = require('mongoose');

const routes = require('./routes');
const errHandling = require('./middlewares/errHandling')

mongoose.connect("mongodb://localhost:27017/fancy-todo", { useNewUrlParser:true })
.then(()=> {
     console.log('Database connected')
})
.catch(err => {
     console.log('Database failed to connect')
})
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cors())
app.use('/', routes);
app.use(errHandling)
// app.use(function (err, req, res, next) {
//      console.log(err.response)
//      res.status(500).send({message : 'Internal Server Error' })
//  })

const port = process.env.PORT || 3000;
app.listen(port, function() {
     console.log('App listening on port', port);
})