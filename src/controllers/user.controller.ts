import mongoose from "mongoose";
import passport, { use } from "passport";
import express from "express";
import { User, UserModal, UserProfile } from "../modal/user";
import { BackendStatus } from "../config/global.config";
import { HttpException, simplifyMongoose } from "../config/global";
import { EmployeeModal } from "../modal/employee";
import { CandidateModal } from "../modal/candidate";


/**
 * Return @message
 */
export const register: express.RequestHandler = (req, res, next) => {

    let user: User = req.body;
    user._id = (new Date()).getTime().toString();
    let Modal: mongoose.Model<mongoose.Document> = user.isEmployee ? EmployeeModal : CandidateModal;
    Modal.create(user, function (err, users) {
        if (!err) return res.json({ status: true, message: "success" });
        else {
            if (err.code == 11000)
                return res.status(422).json({
                    status: false,
                    message: 'Duplicate email adrress found.'
                });
            else return next(err);
        }
    });
}

/**
 * Return @token
 */
export const authenticate: express.RequestHandler = (req, res, next) => {
    // call for passport authentication
    passport.authenticate('local', (err, user: User, info: BackendStatus) => {
        // error from passport middleware
        if (err) return res.status(500).json({ status: false, message: 'Please try again later.' });
        // registered user
        else if (user) return res.status(200).json({ status: true, token: user.generateJwt() });
        // unknown user or wrong password
        else return res.status(401).json(info);
    })(req, res);
}

/**
 * Return @UserProfile
 * any userType can be sent: @User , @Employee , @Candidate
 */
export const userProfile: express.RequestHandler = (req, res, next) => {
    UserModal.findOne({ _id: (<any>req)._id },
        (err, user: User) => {
            if (err) return next(new HttpException())
            if (!user)
                return res.status(404).json({ status: false, message: 'User record not found.' });
            else {
                user = simplifyMongoose<User>(user);
                let userProfile: UserProfile = { fullName: user.fullName, email: user.email, id: user._id, isEmployee: user.isEmployee };
                return res.status(200).json({ status: true, user: userProfile });
            }
        }
    );
}

