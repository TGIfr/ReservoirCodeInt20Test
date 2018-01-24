'use strict';

const DB = require('@DB');
const Meme = require('@DBschemas/meme');

async function create (data) {
    if (await DB.methods.get.oneByQuery(Meme, data)) throw new Error('Meme is already exist');

    return await DB.methods.create(Meme, data);
}

function getById (id) {
    return DB.methods.get.byID(Meme, id);
}

function find (params) {
    return DB.methods.get.oneByQuery(Meme, params);
}

function removeById (id) {
    return DB.methods.remove.byID(Meme, id);
}

function getAll () {
    return DB.methods.get.all(Meme);
}

function byQuery (query, pagination) {
    return DB.methods.get.byQuery(Meme, query, pagination);
}

async function size () {
    return (await Meme.paginate({}, {limit: 0})).total;
}

async function random () {
    let result = await Meme.paginate({}, {offset: Math.floor(Math.random() * (await size() - 1)), limit: 1});
    return result.docs[0];
}


module.exports = {
    create,
    getById,
    get: {
        byQuery
    },
    find,
    removeById,
    getAll,
    random
}