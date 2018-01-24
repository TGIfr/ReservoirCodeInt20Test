"use strict";

const router = require('express').Router();
const DBmeme = require('@DB').Meme;
const Utils = require('@utils');
const passport = require('passport');
const errorHandler = require('@errorHandler');
const config = require('@config');

function getSort (query) {
    switch (query.sort) {
        case "rating":
            return {rating: -1}
        case "date":
            return {date: 1}
        default:
            return {title: -1}
    }
}

router.get('/', async (req, res, next) => {
    try {
        let result = await DBmeme.get.byQuery({}, {
            page: Number(req.query.page) || 1,
            limit: Number(req.query.limit) || config.PAGINATION_LIMIT,
            sort: getSort(req.query)
        });
        res.json({
            success: true,
            items: result.docs,
            limit: result.limit,
            total: result.total,
            page: result.page
        })
    } catch (err) {
        console.log(err)
        return errorHandler(res, 400, err);
    }
});
async function random2 () {
    let arr = [await DBmeme.random(), await DBmeme.random()];
    if (arr[0] == arr[1]) {
        return random2();
    } else {
        return arr;
    }
}

router.get('/random2', passport.authenticate(['access-token'], {session: false}), async (req, res, next) => {
    try {
        const randomArr = await random2();

        res.json({success: true, items: randomArr});
    } catch (err) {
        return errorHandler(res, 400, err);
    }
});


router.post('/vote', passport.authenticate(['access-token'], {session: false}), async (req, res, next) => {
    try {
        const winner = await DBmeme.getById(req.body.winnerId);
        const loser = await DBmeme.getById(req.body.loserId);
        if (!winner || !loser) {
            return errorHandler(res, 400, "No id of memes found")
        }
        const newRating = Utils.calculateNewRating(winner.rating, loser.rating);

        await winner.updateRating(newRating[0]);
        await loser.updateRating(newRating[1]);

        return res.json({success: true});
    } catch (err) {
        return errorHandler(res, 400, err);
    }

});

router.get('/:id', async (req, res, next) => {
    try {
        let result = await DBmeme.getById(req.params.id);
        if (result) {
            return res.json({
                success: true,
                item: result
            })
        } else {
            return errorHandler(res, 404, "No such meme found");
        }
    } catch (err) {
        console.log(err)
        return errorHandler(res, 400, err);
    }
});
router.delete('/:id',passport.authenticate(['access-token'], {session: false}), Utils.verifyAdmin, async (req, res, next) => {
    try {
        let result = await DBmeme.removeById(req.params.id);
        if (result) {
            return res.json({
                success: true,
                item: result
            })
        } else {
            return errorHandler(res, 404, "No such meme found");
        }
    } catch (err) {
        console.log(err)
        return errorHandler(res, 400, err);
    }
});
module.exports = router;