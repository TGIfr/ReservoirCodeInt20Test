const router = require('express').Router();
const DBuser = require('@DB').User;
const Utils = require('@utils');
const passport = require('passport');
const errorHandler = require('@errorHandler');
const config = require('@config');

router.get('/', passport.authenticate(['access-token'],{session: false}),
    Utils.verifyAdmin(), async (req, res, next) => {
    try {
        res.json(await DBuser.paginate({},
            {
                page: req.query.page || 1,
                sort: {rating: -1}
            })
        );
    } catch (err) {
        return errorHandler(res, err);
    }
});

router.delete('/', passport.authenticate(['access-token'], {session: false}),
    Utils.verifyAdmin(),
    async (req, res, next) => {
    try {
        const userToDel = DBuser.get.byID(req.query.id);
        if(!userToDel)
            return errorHandler(res,400,'No id or such user not found');

        if(userToDel.role === 'admin')
            return errorHandler(res,403,'Delete admin, orly?!');


        DBuser.removeById(req.query.id);
        res.status(200).json({success: true, message: 'deleted successfully'}).end();


    } catch (err) {
        return errorHandler(res, err);
    }
});