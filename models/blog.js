
/*========================
Import Node Modules
====================*/



const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

/* Check for Title  [ Start ] */

let titleLengthChecker = (title) => {
    if (!title) {
        return false;
    } else {
        if (title.length < 5 || title.length > 50) {
            return false;
        }
        else {
            return true;
        }
    }
};


const alphaNumericTitlechecker = (title) => {
    if (!title) {
        return false;
    } else {
        const regExp = new RegExp(/^[a-zA-Z0-9]+$/);
        return regExp.test(title);
    }
};

// Array of title vaidators
const titleValidators = [
    {
        validator: titleLengthChecker, message: 'Title must be at least 5 charaters but no more then 30'
    },
    {
        validator: alphaNumericTitlechecker, message: 'Title Must be alphanumeric !'
    }
]

/* Check for Email  [ End ] */

/* Check for Username [start] */

let bodyLengthChecker = (body) => {
    if (!body) {
        return false;
    } else {
        if (body.length < 5 || body.length > 500) {
            return false;
        } else {
            return true;
        }
    }
};




const bodyValidators = [
    {
        validator: bodyLengthChecker,
        message: 'Body must be at least 5 charcters but no more then 500'
    }
];

/* Check for Username [End] */

/* Check for Password [start] */

let commentLengthChecker = (comment) => {
    if (!comment[0]) {
        return false;
    } else {
        if (comment[0].length < 1 || comment[0].length > 200) {
            return false;
        } else {
            return true;
        }
    }
};

let validPassword = (password) => {
    if (!password) {
        return false;
    } else {
        const regExp = new RegExp(/^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d])(?=.*?[\W]).{8,35}$/);
        return regExp.test(password);
    }
}

const commentValidators = [
    {
        validator: commentLengthChecker,
        message: 'Commnets may not be exceed 200 charecters.'
    }
];
/* Check for Password [end] */


// @ this is databse schema..... \|/...........

const blogSchema = new Schema({
    title: { type: String, required: true , validate: titleValidators},
    body: { type: String, required: true , validate: bodyValidators},
    createdBy: { type: String },
    createAt: { type: Date, default: Date.now() },
    likes: { type: Number, default: 0 },
    likesBy: { type: Array },
    dislikes: { type: Number, default: 0 },
    dislikesBy: { type: Array },
    comments: [
        {
            comment: { type: String , validate:commentValidators},
            commentator: { type: String }
        }
    ]
});

// @ ........................... \|/............


module.exports = mongoose.model('Blog', blogSchema);