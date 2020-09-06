"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
//import  cors from 'cors'
const passport_1 = __importDefault(require("passport"));
const mongoose_1 = __importDefault(require("mongoose"));
/** initialize by just importing */
require("./config/passportConfig");
require("./config/setupEnv");
/** end */
const user_router_1 = require("./router/user.router");
const global_1 = require("./config/global");
var compression = require("compression");
var helmet = require("helmet");
const candidate_router_1 = require("./router/candidate.router");
const job_router_1 = require("./router/job.router");
const environment = process.env;
let config = require("./config/config.json");
mongoose_1.default.set("bufferCommands", false);
//mongoose.set('bufferMaxEntries', 0);
/** Depreciation warnings */
mongoose_1.default.set("useNewUrlParser", true);
mongoose_1.default.set("useCreateIndex", true);
mongoose_1.default.connect(environment.mongoURI, err => {
    if (!err) {
        console.log("MongoDB connection succeeded.");
    }
    else {
        console.log("Error in MongoDB connection : " + JSON.stringify(err, undefined, 2));
    }
});
// mongoose.connection.on('connected', function(){
//     console.log("Mongoose default connection is open to ");
// });
// mongoose.connection.on('error', function(err){
//     console.log("Mongoose default connection has occured "+err+" error");
// });
// mongoose.connection.on('disconnected', function(){
//     console.log("Mongoose default connection is disconnected");
// });
let app = express_1.default();
// If an incoming request uses a protocol other than HTTPS,
// redirect that request to the same url but with HTTPS
const forceSSL = function () {
    return function (req, res, next) {
        if (req.headers["x-forwarded-proto"] !== "https") {
            return res.redirect(["https://", req.get("Host"), req.url].join(""));
        }
        next();
    };
};
app.use(compression());
app.use(helmet());
environment.isProduction ? (app.use(morgan_1.default("dev"))) : null;
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
// app.use(express.static(path.join(__dirname, "public")));
// app.disable("view cache");
/** use passport local strategy */
app.use(passport_1.default.initialize());
/** allow cross-origin acess */
// if(!environment.isProduction) app.use(cors());
// app.all('*',function(req, res, next) {
//   res.set('Access-Control-Allow-Origin', '*');
//   res.set('Access-Control-Allow-Headers','Content-Type');
//   next();
// })
app.use(`${config.restAPI}/auth`, user_router_1.userRouter);
app.use(`${config.restAPI}/candidate`, global_1.verifyJwtToken, candidate_router_1.candidateRouter);
app.use(`${config.restAPI}/job`, global_1.verifyJwtToken, job_router_1.jobRouter);
// app.use(express.static(path.join(__dirname, "build")));
// app.get("/*", function(req, res, next) {
//   if (!req.path.includes(config.restAPI))
//     res.sendFile(path.join(__dirname, "build", "index.html"));
//   else next();
// });
app.use("**", invalidPath);
function invalidPath(req, res, next) {
    next(new global_1.HttpException("Invalid path", 404));
}
/**
 * error handler
 */
function errorMiddleware(error, req, res, next) {
    const status = error.status || 500;
    const message = error.message || "Something went wrong";
    res.status(status).json({ status: false, message });
}
app.use(errorMiddleware);
exports.default = app;
