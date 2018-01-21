'use strict';

const Mongoose 	= require('mongoose');
const crypto = require('crypto');

const serverSalt = process.env.SERVER_SALT;


function sha512(password, salt) {
    const hash = crypto.createHmac('sha512', salt);
    hash.update(password);
    const value = hash.digest('hex');
    return {
        salt: salt,
        passwordHash: value
    };
}

//Every user has a username, password, and a picture.

let UserSchema = new Mongoose.Schema({
    username: {type: String, required: true},
    password: {type: String, required: true},
    role: {type: String, required: true, default: 'user'}
});

//! pre-save middleware
/**
 * Before save a user document, Make sure:
 * 1. Hash user's password
 *
 */
UserSchema.pre('save', function(next) {
    let user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    user.password = sha512(user.password, serverSalt).passwordHash;

    next();

});

/**
 * Create an Instance method to validate user's password
 * This method will be used to compare the given password with the password stored in the database
 *
 */
UserSchema.methods.validatePassword = function(password, callback) {
    if(this.password === sha512(password, serverSalt).passwordHash ){
        callback(null, true);
    } else{
        callback(null, false);
    }
};

// Create a user model
let userModel = Mongoose.model('users', UserSchema);

module.exports = userModel;