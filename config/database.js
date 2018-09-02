const crypto = require('crypto').randomBytes(256).toString('hex'); // Provides cryptographic functionality (Openssl's hash, HMAC, cipher, decipher, sign and verify functions)

//exports config Objects...
module.exports = { 
    // uri: 'mongodb://localhost:27017/mean-angular-2', // Databse URI And Databse Name
    uri: 'mongodb://confuse:confuse57@ds239682.mlab.com:39682/angular-mean-2-app', // Production
    secret : crypto, // Crypto-creted secret
    db: 'angular-mean-2-app' // Databse name
}