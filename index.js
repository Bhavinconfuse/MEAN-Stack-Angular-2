/* ====================

IMPORT NODE MODULE
======================= */

const express = require('express'); // Fast , unpoinionated, minimalist, web framework  for node.
const app =  express(); // Initiate Express Applcation.
const router = express.Router();
const mongoose = require('mongoose'); // Node Tool For mongoDB. 
const config =  require('./config/database'); // Mongoose Config
const path = require('path');// NodeJs Package for file paths
const authentication = require('./routes/authentication')(router);
const blogs = require('./routes/blogs')(router);
const bodyParser = require('body-parser');
const cors =  require('cors');
const port = process.env.PORT || 8000;

// Databse Connection
mongoose.Promise = global.Promise;
mongoose.connect(config.uri,{ useNewUrlParser: true }, (err) =>{
    if(err){
        console.log('Could not connect to databse: ', err);
    }else{
        console.log(config.secret);
        console.log('connected to Databse: '+ config.db);
    }
});
// Provide static directory for frontend
// parse application/x-www-form-urlencoded
// MIDDLeWare

app.use(cors({
    origin: 'http://localhost:4200'
    // origin: 'http://192.168.137.167:4200'

}))

app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())
app.use(express.static(__dirname + '/public')); 
app.use('/authentication', authentication);
app.use('/blogs', blogs);

//  Connect server to angular 2  Index.html
app.get('*', (req, res, next) => {
    res.sendFile(path.join(__dirname + '/public/index.html'));
});


// Start Server: Listen on port 8080
app.listen(port ,() =>{
    console.log('Listing on port ' + port);
});