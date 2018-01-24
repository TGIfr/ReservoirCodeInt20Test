const passport = require('passport');
const BearerStrategy = require('passport-http-bearer').Strategy;
const BasicStrategy = require('passport-http').BasicStrategy;
const config = require('@config');
const DBusers = require('@DB').User;


const Utils = require('@utils');
let strategies = {
    // username & password auth
    basic: {
        init () {
            passport.use(new BasicStrategy(
                async function (username, password, done) {
                    try {
                        const user = await DBusers.get.byCredentials(username, password);
                        if (user) {
                            return done(null, user);
                        }
                        else {
                            return done(null, false);
                        }
                    } catch (err) {
                        err.status = 400;
                        console.log('basic auth: ', err)
                        return done(err);
                    }
                }
            ))
        }
    },
    // bearer token's auth, with access-tokens
    JWTAccess: {
        init () {
            passport.use('access-token', new BearerStrategy(
                async function (token, done) {
                    try {
                        const decode = Utils.tokens.decode('access', token);
                        const me = await DBusers.get.byToken('access', decode);
                        if (me) {
                            return done(null, me);
                        } else {
                            return done(null, false);
                        }
                    } catch (err) {
                        err.status = 400;
                        console.log('access', err)
                        return done(err);
                    }
                }
            ));
        }
    },
    // bearer token's auth, with refresh-tokens
    JWTRefresh: {
        init () {
            passport.use('refresh-token', new BearerStrategy(
                async function (token, done) {
                    try {
                        const decode = Utils.tokens.decode('refresh', token);
                        const me = await DBusers.get.byToken('refresh', decode);
                        if (me) {
                            return done(null, me);
                        } else {
                            return done(null, false);
                        }
                    } catch (err) {
                        err.status = 400;
                        console.log('refresh', err)
                        return done(err);
                    }
                }
            ));
        }
    }
}


module.exports=(app) =>{
    Object.keys(strategies).forEach(name => {
        strategies[name].init();
        console.log(`+Auth ${name}: initialized`);
    })
    app.use(passport.initialize());
    console.log('+Auth: initialized');
}