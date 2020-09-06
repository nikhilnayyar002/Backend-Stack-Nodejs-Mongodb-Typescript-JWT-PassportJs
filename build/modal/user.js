"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModal = exports.UserSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const environment = process.env;
/** Mongoose Schema and Modal */
exports.UserSchema = new mongoose_1.default.Schema({
    fullName: {
        type: String,
        required: "Full name can't be empty"
    },
    email: {
        type: String,
        required: "Email can't be empty",
        unique: true
    },
    password: {
        type: String,
        required: "Password can't be empty",
        minlength: [8, "Password must be atleast 8 character long"]
    },
    saltSecret: String,
    _id: {
        type: String
    },
    isEmployee: { type: Boolean }
}, { discriminatorKey: 'userType' });
/**
 * Schema @Methods
 */
exports.UserSchema.methods.verifyPassword = function (password) {
    return bcryptjs_1.default.compareSync(password, this.password);
};
exports.UserSchema.methods.generateJwt = function () {
    return jsonwebtoken_1.default.sign({ _id: this._id }, environment.jwtSecret, {
        expiresIn: environment.jwtExp
    });
};
/**
 * Validate @email path
 */
exports.UserSchema.path("email").validate(val => {
    let emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(val);
}, "Invalid e-mail.");
/**
 * Run on @save event
 */
exports.UserSchema.pre("save", function (next) {
    bcryptjs_1.default.genSalt(10, (err, salt) => {
        bcryptjs_1.default.hash(this.password, salt, (err, hash) => {
            this.password = hash;
            this.saltSecret = salt;
            next();
        });
    });
});
exports.UserModal = mongoose_1.default.model("User", exports.UserSchema);
