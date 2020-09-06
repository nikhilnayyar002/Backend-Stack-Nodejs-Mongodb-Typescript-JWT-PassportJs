"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEmployeeJobs = exports.getJobs = exports.postJob = void 0;
const job_1 = require("../modal/job");
const global_1 = require("../config/global");
/**
 * Return @message
 */
exports.postJob = function (req, res, next) {
    let job = (new job_1.JobModal(req.body));
    job.save((err, job) => {
        if (!err)
            return res.json({ status: true, message: "Success" });
        else {
            if (err.code)
                return res.status(422).json({ status: false, message: err.code });
            else
                return next(err);
        }
    });
};
/**
 * Return @Jobs
 */
exports.getJobs = function (req, res, next) {
    job_1.JobModal.find({}, (err, jobs) => {
        if (err)
            return next(err);
        if (jobs && jobs.length)
            return res.json({ status: true, jobs });
        else
            return next(new global_1.Record404Exception());
    });
};
/**
 *  returns @Jobs
 */
exports.getEmployeeJobs = (req, res, next) => {
    let empID = req.params.empID;
    job_1.JobModal.find({ empID }, (err, jobs) => {
        if (err)
            return next(err);
        if (jobs && jobs.length)
            return res.json({ status: true, jobs });
        else
            return next(new global_1.Record404Exception());
    });
};
