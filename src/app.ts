import express from "express";
import morgan from "morgan";
//import  cors from 'cors'
import passport from "passport";
import mongoose from "mongoose";

/** initialize by just importing */
import "./config/passportConfig";
import "./config/setupEnv";
/** end */

import { userRouter } from "./router/user.router";
import { HttpException, verifyJwtToken } from "./config/global";

var compression = require("compression");
var helmet = require("helmet");

import {
  processEnvironment,
  globalEnvironment
} from "./config/global.config";
import { candidateRouter } from "./router/candidate.router";
import { jobRouter } from "./router/job.router";

const environment: processEnvironment = <any>process.env;
let config: globalEnvironment = require("./config/config.json");

mongoose.set("bufferCommands", false);
//mongoose.set('bufferMaxEntries', 0);

/** Depreciation warnings */
mongoose.set("useNewUrlParser", true);
mongoose.set("useCreateIndex", true);
mongoose.set('useUnifiedTopology', true);

mongoose.connect(environment.mongoURI, err => {
  if (!err) {
    console.log("MongoDB connection succeeded.");
  } else {
    console.log(
      "Error in MongoDB connection : " + JSON.stringify(err, undefined, 2)
    );
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

let app = express();

// If an incoming request uses a protocol other than HTTPS,
// redirect that request to the same url but with HTTPS
const forceSSL = function() {
  return function(req, res, next) {
    if (req.headers["x-forwarded-proto"] !== "https") {
      return res.redirect(["https://", req.get("Host"), req.url].join(""));
    }
    next();
  };
};

app.use(compression());
app.use(helmet());

environment.isProduction?(
  app.use(morgan("dev"))
):null


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(express.static(path.join(__dirname, "public")));
// app.disable("view cache");

/** use passport local strategy */
app.use(passport.initialize());

/** allow cross-origin acess */
// if(!environment.isProduction) app.use(cors());

// app.all('*',function(req, res, next) {
//   res.set('Access-Control-Allow-Origin', '*');
//   res.set('Access-Control-Allow-Headers','Content-Type');
//   next();
// })

app.use(`${config.restAPI}/auth`, userRouter);
app.use(`${config.restAPI}/candidate`, verifyJwtToken, candidateRouter);
app.use(`${config.restAPI}/jobs`, verifyJwtToken, jobRouter);

// app.use(express.static(path.join(__dirname, "build")));

// app.get("/*", function(req, res, next) {
//   if (!req.path.includes(config.restAPI))
//     res.sendFile(path.join(__dirname, "build", "index.html"));
//   else next();
// });

app.use("**", invalidPath);
function invalidPath(req, res, next) {
  next(new HttpException("Invalid path", 404));
}

/**
 * error handler
 */
function errorMiddleware(
  error: HttpException,
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  const status = error.status || 500;
  const message = error.message || "Something went wrong";
  res.status(status).json({ status: false, message });
}

app.use(errorMiddleware);

export default app;
