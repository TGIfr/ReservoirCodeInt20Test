"use strict";

const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const config = require('@config');
const fs = require('fs-promise');
const fileType = require("file-type");
const commonmark = require('commonmark');
const ObjectID = require('mongoose').Types.ObjectId;
function sendError (res, code, err) {
    return res.status(code).json({success: false, message: err.message || err}).end();
}
/**
 * converts & validates pagination options
 * @param options options to convert
 */
exports.pagination = function (options) {
    let args = {};
    if (options.sort) {
        args.sort = options.sort;
    }
    if (options.page && options.page > 0) {
        args.page = options.page;
    } else {
        args.page = 1;
    }
    if (options.limit && options.limit >= 0) {
        args.limit = options.limit;
    } else {
        args.limit = Number.parseInt(config.PAGINATION_LIMIT);
    }
    return args;
}
exports.crypto = {
    /**
     * get hash of string, with this salt
     * @param plainData plain string to hashed
     * @param salt salt for hashing
     * @returns {String} hex-string with hashed data
     */
    hash: (plainData, salt) => {
        return crypto
            .createHmac('sha512', salt)
            .update(plainData)
            .digest('hex');
    },
    /**
     * Compare two strings, plain and hashed
     * @param plainData plain string to compare
     * @param hash hashed string to compare
     * @param salt salt for crypting
     * @returns {boolean} is two strings are equals
     */
    compare: (plainData, hash, salt) => {
        return this.crypto.hash(plainData, salt) == hash;
    },
    /**
     * return random generated string
     * @param length count of bytes in string
     * @returns {string} random generated string
     */
    random: (length) => {
        return crypto
            .randomBytes(length + 1)
            .toString('base64').substr(0, length);
    }
}
exports.tokens = {
    algorithm: 'HS256',
    secret (name) {
        switch (name) {
            case 'access':
                return process.env.ACCESS_TOKENS_SECRET;
            case 'refresh':
                return process.env.REFRESH_TOKENS_SECRET;
            case 'activation':
                return process.env.ACTIVATION_TOKENS_SECRET;
            default:
                throw new Error("Invalid token name")
        }
    },
    /**
     * generate new token, with specified name and data
     * @param name on of 'access' or 'refresh'
     * @param data data to store in token
     * @returns {String} string created token
     */
    generate (name, data) {
        return jwt.sign(
            data,
            this.secret(name),
            {
                algorithm: this.algorithm,
                expiresIn: config.security.TOKEN_LIFE[name]
            }
        )
    },
    /**
     * decode token
     * @param name one of 'access', 'refresh'
     * @param token string with token
     * @returns {{}} decoded token
     */
    decode (name, token) {
        return jwt.verify(
            token,
            this.secret(name),
            {
                algorithms: [this.algorithm]
            }
        )
    }
}
exports.errors = {
    InvalidRequesDataError (msg) {
        return {
            name: 'InvalidRequesDataError',
            message: msg
        }
    }
}
exports.sendError = sendError;
exports.fs = {
    /**
     * read file from file storage
     * @param pathToFile path to file
     * @returns {*}
     */
    read (pathToFile) {
        return fs.readFile(pathToFile, 'utf8');
    }
}
exports.md = {
    reader: new commonmark.Parser(),
    writer: new commonmark.HtmlRenderer({safe: true}),
    /**
     * render string as Markdown
     * @param text text to render
     */
    render (text) {
        var parsed = this.reader.parse(text);
        return this.writer.render(parsed); // result is a String
    }
}
exports.files = {
    ext: {
        images: ["png", "jpg", "jpeg"]
    },
    /**
     * return extention of file
     * @param {file} to process
     * @returns {String} extention of file
     */
    extOf (data) {
        return fileType(data).ext
    },
    /**
     * check is file is image by magic number
     * @param file file to check
     * @returns {boolean}
     */
    isImage (file) {
        try {
            return this.ext.images.indexOf(this.extOf(file.data)) !== -1;
        } catch (e) {
            return false;
        }
    }
}
exports.isValid = {
    id (str) {
        return ObjectID.isValid(str);
    }
}
exports.convert = {
    str2id (str) {
        if (typeof str != 'string') str;
        try {
            return new ObjectID.createFromHexString(str);
        } catch (e) {
            return undefined;
        }
    },
    nau2user (nau) {
        return {
            email: nau.email,
            password: nau.password
        }
    }
}
exports.parseJSON = function (str) {
    try {
        return JSON.parse(str);
    } catch (err) {
        return null;
    }
}
exports.verifyAdmin = function (req, res, next) {
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        return sendError(req, 403, "Forbidden. Only admins can delete memes");
    }
}


exports.calculateNewRating = function (winnerR, loserR) {
    const expectedWinner = 1 / (1 + Math.pow(10, (loserR - winnerR) / 400));
    const expectedLoser = 1 / (1 + Math.pow(10, (winnerR - loserR) / 400));

    //!can be enhanced
    const coef = rating => rating < 1000 ? 40 : 20;

    const newWinnerR = winnerR + coef(winnerR) * (1 - expectedWinner);
    const newLoserR = loserR + coef(loserR) * (-expectedLoser);

    return [newWinnerR, newLoserR];

}
