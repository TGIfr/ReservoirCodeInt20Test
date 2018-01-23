let collectors = {
    register (req, res, next) {
        req.args = {
            username: req.body.username,
            password: req.body.password
        }
        console.log(req.args)
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