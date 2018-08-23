const express = require('express');
const app =  express();
const mongoose = require('mongoose');
const config =  require('./config/database');
const path = require('path');

mongoose.Promise = global.Promise;
mongoose.connect(config.uri,{ useNewUrlParser: true }, (err) =>{
    if(err){
        console.log('Could not connect to databse: ', err);
    }else{
        console.log(config.secret);
        console.log('connected to Databse: '+ config.db);
    }
});

app.use(express.static(__dirname + '/client/dist/client/')); 

app.get('*', (req, res, next) => {
    res.sendFile(path.join(__dirname + '/client/dist/client/index.html'));
});

app.listen(8080, () =>{
    console.log('Listing on port 8080');
});