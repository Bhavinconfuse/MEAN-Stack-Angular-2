const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema =  mongoose.Schema;
const bcrypt =  require('bcrypt-nodejs');

/* Check for Email  [ Start ] */

let emailLengthChecker = (email) => {
    if(!email){
        return false;
    }else{
        if(email.length < 5 || email.length > 30 ){
            return false;
        }
        else{
            return true;
        }
    }
};


const validEmailchecker = (email) => {
    if(!email){
        return false;
    }else{
        const regExp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
        return regExp.test(email);
    }
};
const emailValidators = [
    {
        validator: emailLengthChecker, message: 'E-mail must be at least 5 charaters but no more then 30'
    },
    {
        validator: validEmailchecker, message: 'Must be Valid Email !'
    }
]

/* Check for Email  [ End ] */

/* Check for Username [start] */

let usernameLengthChecker = (username) => {
    if(!username){
        return false;
    }else{
        if(username.length < 3 || username.length > 15){
            return false;
        }else{
            return true;
        }
    }
};


let validUsername = (username) => {
    if(!username){
        return false;
    }else{
        const regExp = new RegExp(/^[a-zA-Z0-9]+$/);
        return regExp.test(username);
    }
}


const usernameValidators = [
    {
        validator: usernameLengthChecker,
        message: 'Username must be at least 3 charcters but no more then 15'
    },
    {
        validator: validUsername,
        message: 'Username must not have any special charecter'
    }
];

/* Check for Username [End] */

/* Check for Password [start] */

    let passwordLengthChecker = (password) =>{
        if(!password){
            return false;
        }else{
            if(password.length < 8 || password.length > 35){
                return false;
            }else{
                return true;
            }
        }
    };

    let validPassword = (password) => {
        if(!password){
            return false;
        }else{
            const regExp = new RegExp(/^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d])(?=.*?[\W]).{8,35}$/);
            return regExp.test(password);
        }
    }

    const passwordValidators = [
        {
            validator: passwordLengthChecker,
            message: 'Password must be at least 8 charecter but no more then 35'
        },
        {
            validator: validPassword,
            message: 'Must have ate least one uppercase, lowercase, special cheracters, and number'
        }
    ];
/* Check for Password [end] */


// @ this is databse schema..... \|/...........

const userSchema = new Schema ({
    email: {type: String, required: true, unique: true, lowwercase: true, validate: emailValidators},
    username: {type: String, required: true, unique: true, lowwercase: true, validate: usernameValidators},
    password: {type: String, required: true, validate: passwordValidators}
    
})
// @ ........................... \|/............


userSchema.pre('save', function(next) {
    if(!this.isModified('password'))
    return next();

    bcrypt.hash(this.password, null,null, (err, hash) => {
        if(err) return next(err);
        this.password = hash;
        next();
         
    });
});


userSchema.methods.comparePassword = function(password) { 
    return bcrypt.compareSync(password, this.password);
}
module.exports =  mongoose.model('User',userSchema);