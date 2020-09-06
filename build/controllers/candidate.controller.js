"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jobs = exports.rejectedJobs = exports.acceptedJobs = exports.unrejectJob = exports.rejectJob = exports.unacceptJob = exports.acceptJob = void 0;
const candidate_1 = require("../modal/candidate");
const global_1 = require("../config/global");
const job_1 = require("../modal/job");
/**
 *  returns @message
 */
exports.acceptJob = (req, res, next) => {
    let canID = req.params.canID;
    candidate_1.CandidateModal.updateOne({ _id: canID }, { $push: { accJobs: req.params.jobID } }, function (err, doc) {
        if (err)
            return next(err);
        if (doc)
            return res.json({ status: true, message: "Success" });
        else
            return next(new global_1.HttpException("Failed", 400));
    });
};
/**
 *  returns @message
 */
exports.unacceptJob = (req, res, next) => {
    let canID = req.params.canID;
    candidate_1.CandidateModal.updateOne({ _id: canID }, { $pull: { accJobs: req.params.jobID } }, function (err, doc) {
        if (err)
            return next(err);
        if (doc)
            return res.json({ status: true, message: "Success" });
        else
            return next(new global_1.HttpException("Failed", 400));
    });
};
/**
 *  returns @message
 */
exports.rejectJob = (req, res, next) => {
    let canID = req.params.canID;
    candidate_1.CandidateModal.updateOne({ _id: canID }, { $push: { rejJobs: req.params.jobID } }, function (err, doc) {
        if (err)
            return next(err);
        if (doc)
            return res.json({ status: true, message: "Success" });
        else
            return next(new global_1.HttpException("Failed", 400));
    });
};
/**
 *  returns @message
 */
exports.unrejectJob = (req, res, next) => {
    let canID = req.params.canID;
    candidate_1.CandidateModal.updateOne({ _id: canID }, { $pull: { rejJobs: req.params.jobID } }, function (err, doc) {
        if (err)
            return next(err);
        if (doc)
            return res.json({ status: true, message: "Success" });
        else
            return next(new global_1.HttpException("Failed", 400));
    });
};
/**
 *  returns @Jobs
 */
exports.acceptedJobs = function (req, res, next) {
    let canID = req.params.canID;
    candidate_1.CandidateModal.findById(canID, function (err, candidate) {
        if (err)
            return next(err);
        if (candidate && candidate.accJobs && candidate.accJobs.length) {
            let proms = [];
            for (let i of candidate.accJobs)
                proms.push(job_1.JobModal.findById(i).exec());
            Promise.all(proms)
                .then((jobs) => {
                jobs = jobs.filter(t => t != null);
                if (jobs.length)
                    return res.json({ status: true, jobs });
                else
                    return next(new global_1.Record404Exception());
            })
                .catch(err => next(new global_1.HttpException("Please try again later.")));
        }
        else
            return next(new global_1.Record404Exception());
    });
};
/**
 *  returns @Jobs
 */
exports.rejectedJobs = function (req, res, next) {
    let canID = req.params.canID;
    candidate_1.CandidateModal.findById(canID, function (err, candidate) {
        if (err)
            return next(err);
        if (candidate && candidate.rejJobs && candidate.rejJobs.length) {
            let proms = [];
            for (let i of candidate.rejJobs)
                proms.push(job_1.JobModal.findById(i).exec());
            Promise.all(proms)
                .then((jobs) => {
                jobs = jobs.filter(t => t != null);
                if (jobs.length)
                    return res.json({ status: true, jobs });
                else
                    return next(new global_1.Record404Exception());
            })
                .catch(err => next(new global_1.HttpException("Please try again later.")));
        }
        else
            return next(new global_1.Record404Exception());
    });
};
/**
 *  returns @Jobs
 */
exports.jobs = function (req, res, next) {
    let canID = req.params.canID;
    candidate_1.CandidateModal.findById(canID, function (err, candidate) {
        if (err)
            return next(err);
        if (candidate) {
            let jobIDs = null;
            if (candidate.rejJobs && candidate.rejJobs.length) {
                jobIDs = {};
                for (let i of candidate.rejJobs) {
                    jobIDs[i] = true;
                }
            }
            if (candidate.accJobs && candidate.accJobs.length) {
                jobIDs = jobIDs ? jobIDs : {};
                for (let i of candidate.accJobs) {
                    jobIDs[i] = true;
                }
            }
            job_1.JobModal.find({}, (err, jobs) => {
                if (err)
                    return next(err);
                if (jobs && jobs.length) {
                    let filteredJobs = [];
                    if (jobIDs) {
                        for (let i of jobs)
                            if (!jobIDs[i._id])
                                filteredJobs.push(i);
                    }
                    else {
                        filteredJobs = jobs;
                    }
                    if (filteredJobs.length) {
                        return res.json({ status: true, jobs: filteredJobs });
                    }
                    else {
                        return next(new global_1.Record404Exception());
                    }
                }
                else
                    return next(new global_1.Record404Exception());
            });
        }
        else
            return next(new global_1.Record404Exception());
    });
};
