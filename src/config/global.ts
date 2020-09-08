import jwt from "jsonwebtoken";
import express from "express";
import { UserModal, User } from "../modal/user";
import { envConfig } from './setupEnv';


export class HttpException extends Error {
  status: number;
  message: string;
  constructor(message: string = null, status: number = 500) {
    super(message);
    this.status = status;
    this.message = message;
  }
}
export class Record404Exception extends HttpException {
  constructor() {
    super("Record not found", 404);
  }
}

/** 
 *  A middleware that verifies the token and decode the user "_id"
 *  out of JSON Web Token for further use.
 */
export const verifyJwtToken: express.RequestHandler = (req, res, next) => {
  let token: string;

  if ("authorization" in req.headers)
    token = (<string>req.headers["authorization"]).split(" ")[1];

  /**
   * no_authorization_header
   * */
  if (!token)
    return res.status(403).send({ status: false, message: "Please Re-login" });
  else {
    jwt.verify(
      token,
      envConfig.jwtSecret,
      /**
       * decoded ->  { _id: 1563274945715, iat: 1563773668, exp: 1563775468 }
       * _id -> userID, because the generated jwtToken was signed with payload as userID
       * We pass it to middleware as "(<any>req)._id" for use.
       */
      (err, decoded: { _id: string }) => {
        if (err)
          return res.status(401).send({ status: false, message: "Authentication failed." });
        else {
          /** save userID in req as req._id */
          (<any>req)._id = decoded._id;
          return next();
        }
      }
    );
  }
};

export function returnTyped<T>(data: any): T {
  return data as T;
}

/** mongoose result to _doc */
export function simplifyMongoose<T>(data: any): T {
  if (data.length) return data.map(e => e._doc);
  return data._doc;
}

export const userAcessCheckRoute: express.Handler = (req, res, next) => {
  let userID = req.params.userID
  UserModal.findById((<any>req)._id, (err, user: User) => {
    if (err) return next(new HttpException())
    if (!user)
      return res.status(404).json({ status: false, message: 'User record not found.' });
    else if (user._id! = userID)
      return res.status(403).send({ status: false, message: "Acess Forbidden. Invalid User Acess." });
    else return next();
  })
}