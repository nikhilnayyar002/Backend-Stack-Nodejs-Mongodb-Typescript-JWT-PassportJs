"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userAcessCheckRoute = exports.simplifyMongoose = exports.returnTyped = exports.verifyJwtToken = exports.Record404Exception = exports.HttpException = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = require("../modal/user");
const environment = process.env;
class HttpException extends Error {
    constructor(message = null, status = 500) {
        super(message);
        this.status = status;
        this.message = message;
    }
}
exports.HttpException = HttpException;
class Record404Exception extends HttpException {
    constructor() {
        super("Record not found", 404);
    }
}
exports.Record404Exception = Record404Exception;
/**
 *  A middleware that verifies the token and decode the user "_id"
 *  out of JSON Web Token for further use.
 */
exports.verifyJwtToken = (req, res, next) => {
    let token;
    if ("authorization" in req.headers)
        token = req.headers["authorization"].split(" ")[1];
    /**
     * no_authorization_header
     * */
    if (!token)
        return res.status(403).send({ status: false, message: "Please Re-login" });
    else {
        jsonwebtoken_1.default.verify(token, environment.jwtSecret, 
        /**
         * decoded ->  { _id: 1563274945715, iat: 1563773668, exp: 1563775468 }
         * _id -> userID, because the generated jwtToken was signed with payload as userID
         * We pass it to middleware as "(<any>req)._id" for use.
         */
        (err, decoded) => {
            if (err)
                return res.status(401).send({ status: false, message: "Authentication failed." });
            else {
                /** save userID in req as req._id */
                req._id = decoded._id;
                return next();
            }
        });
    }
};
function returnTyped(data) {
    return data;
}
exports.returnTyped = returnTyped;
/** mongoose result to _doc */
function simplifyMongoose(data) {
    if (data.length)
        return data.map(e => e._doc);
    return data._doc;
}
exports.simplifyMongoose = simplifyMongoose;
exports.userAcessCheckRoute = (req, res, next) => {
    let userID = req.params.userID;
    user_1.UserModal.findById(req._id, (err, user) => {
        if (err)
            return next(new HttpException());
        if (!user)
            return res.status(404).json({ status: false, message: 'User record not found.' });
        else if (user._id = userID)
            return res.status(403).send({ status: false, message: "Acess Forbidden. Invalid User Acess." });
        else
            return next();
    });
};
