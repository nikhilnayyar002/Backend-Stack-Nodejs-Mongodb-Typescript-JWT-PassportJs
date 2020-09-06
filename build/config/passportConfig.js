"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_local_1 = __importDefault(require("passport-local"));
const user_1 = require("../modal/user");
/**
 * Set up local strategy for passport to be used later for Authentication of user
 */
passport_1.default.use(new passport_local_1.default.Strategy({ usernameField: 'email' }, (username, password, done) => {
    user_1.UserModal.findOne({ email: username }, (err, user) => {
        if (err)
            return done(err);
        // unknown user
        else if (!user)
            return done(null, false, { status: false, message: 'Email is not registered' });
        // wrong password
        else if (!user.verifyPassword(password))
            return done(null, false, { status: false, message: 'Wrong password.' });
        // authentication succeeded
        else
            return done(null, user);
    });
}));
