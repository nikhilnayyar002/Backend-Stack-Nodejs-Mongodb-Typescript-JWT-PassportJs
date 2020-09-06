"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userProfile = exports.authenticate = exports.register = void 0;
const passport_1 = __importDefault(require("passport"));
const user_1 = require("../modal/user");
const global_1 = require("../config/global");
/**
 * Return @message
 */
exports.register = (req, res, next) => {
    let user = req.body;
    user._id = (new Date()).getTime().toString();
    user_1.UserModal.create(user, function (err, users) {
        if (!err)
            return res.json({ status: true, message: "success" });
        else {
            if (err.code == 11000)
                return res.status(422).json({
                    status: false,
                    message: 'Duplicate email adrress found.'
                });
            else
                return next(err);
        }
    });
};
/**
 * Return @token
 */
exports.authenticate = (req, res, next) => {
    // call for passport authentication
    passport_1.default.authenticate('local', (err, user, info) => {
        // error from passport middleware
        if (err)
            return res.status(500).json({ status: false, message: 'Please try again later.' });
        // registered user
        else if (user)
            return res.status(200).json({ status: true, token: user.generateJwt() });
        // unknown user or wrong password
        else
            return res.status(401).json(info);
    })(req, res);
};
/**
 * Return @UserProfile
 * any userType can be sent: @User , @Employee , @Candidate
 */
exports.userProfile = (req, res, next) => {
    user_1.UserModal.findOne({ _id: req._id }, (err, user) => {
        if (err)
            return next(new global_1.HttpException());
        if (!user)
            return res.status(404).json({ status: false, message: 'User record not found.' });
        else {
            let userProfile = Object.assign(Object.assign({}, user), { id: user._id });
            return res.status(200).json({ status: true, user: userProfile });
        }
    });
};
