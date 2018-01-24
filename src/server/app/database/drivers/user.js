'use strict';

const DB = require('@DB');
const User = require('@DBschemas/user');

module.exports.create = function (data) {
    return DB.methods.create(User, data);
};

module.exports.removeById = function(userId){
    return DB.methods.remove.byID(User, userId);
}
module.exports.get = {
    byID () {
        return DB.methods.get.byID(User, id);
    },
    async byCredentials (email, password) {
        let user = await DB.methods.get.oneByQuery(User, {email: email})
        if (user && await user.comparePasswords(password)) {
            return user;
        } else {
            return null;
        }
    },
    byEmail (email) {
        return DB.methods.get.oneByQuery(User, {email: email});
    },
    async byToken (name, token) {
        const user = await DB.methods.get.byID(User, token.id);
        if (user && user.verifyToken(name, token)) return user;
        else return null;
    },
}
