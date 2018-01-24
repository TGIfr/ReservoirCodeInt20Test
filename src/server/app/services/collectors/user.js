let collectors = {
    register (req, res, next) {
        req.args = {
            email: req.body.email,
            password: req.body.password
        }
        next();
    },
    activate (req, res, next) {
        req.args = {
            token: req.params.token
        }
        next();
    },
    sendAgain (req, res, next) {
        req.args = {
            email: req.body.email
        }
        next();
    }
}

/**
 * user endpoint's  middleware
 * @param path path to endpoint
 * @return {*} function-collector
 */
module.exports = function (path) {
    if (path[1] in collectors) {
        return collectors[path[1]];
    } else {
        return null;
    }
}
