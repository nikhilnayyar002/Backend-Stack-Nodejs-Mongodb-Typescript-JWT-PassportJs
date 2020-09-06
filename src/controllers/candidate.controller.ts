import express from "express";
import { CandidateModal, Candidate } from "../modal/candidate";
import { HttpException, Record404Exception } from "../config/global";
import { JobModal, Job } from "../modal/job";



/**
 *  returns @message
 */
export const acceptJob: express.RequestHandler = (req, res, next) => {
    CandidateModal.findOne({ _id: (<any>req)._id },
        (err, cand: Candidate) => {
            if (err) return next(new HttpException())
            if (!cand)
                return res.status(404).json({ status: false, message: 'Invalid candidate id.' });
            else {
                CandidateModal.updateOne(
                    { _id: (<any>req)._id },
                    { $push: { accJobs: req.params.jobID } },
                    function (err, doc) {
                        if (err) return next(err);
                        if (doc) return res.json({ status: true, message: "Success" });
                        else return next(new HttpException("Failed", 400));
                    }
                );
            }
        }
    );
};

/**
 *  returns @message
 */
export const unacceptJob: express.RequestHandler = (req, res, next) => {
    CandidateModal.findOne({ _id: (<any>req)._id },
        (err, cand: Candidate) => {
            if (err) return next(new HttpException())
            if (!cand)
                return res.status(404).json({ status: false, message: 'Invalid candidate id.' });
            else {
                CandidateModal.updateOne(
                    { _id:  (<any>req)._id },
                    { $pull: { accJobs: req.params.jobID } },
                    function (err, doc) {
                        if (err) return next(err);
                        if (doc) return res.json({ status: true, message: "Success" });
                        else return next(new HttpException("Failed", 400));
                    }
                );
            }
        }
    );
};


/**
 *  returns @message
 */
export const rejectJob: express.RequestHandler = (req, res, next) => {
    CandidateModal.findOne({ _id: (<any>req)._id },
        (err, cand: Candidate) => {
            if (err) return next(new HttpException())
            if (!cand)
                return res.status(404).json({ status: false, message: 'Invalid candidate id.' });
            else {
                CandidateModal.updateOne(
                    { _id: (<any>req)._id },
                    { $push: { rejJobs: req.params.jobID } },
                    function (err, doc) {
                        if (err) return next(err);
                        if (doc) return res.json({ status: true, message: "Success" });
                        else return next(new HttpException("Failed", 400));
                    }
                );
            }
        }
    );
};



/**
 *  returns @message
 */
export const unrejectJob: express.RequestHandler = (req, res, next) => {
    CandidateModal.findOne({ _id: (<any>req)._id },
        (err, cand: Candidate) => {
            if (err) return next(new HttpException())
            if (!cand)
                return res.status(404).json({ status: false, message: 'Invalid candidate id.' });
            else {
                CandidateModal.updateOne(
                    { _id: (<any>req)._id },
                    { $pull: { rejJobs: req.params.jobID } },
                    function (err, doc) {
                        if (err) return next(err);
                        if (doc) return res.json({ status: true, message: "Success" });
                        else return next(new HttpException("Failed", 400));
                    }
                );
            }
        }
    );
};


/**
 *  returns @Jobs
 */
export const acceptedJobs: express.RequestHandler = function (req, res, next) {
    CandidateModal.findById((<any>req)._id , function (err, candidate: Candidate) {
        if (err) return next(err);
        if (candidate && candidate.accJobs && candidate.accJobs.length) {
            let proms = [];
            for (let i of candidate.accJobs)
                proms.push(JobModal.findById(i).exec());
            Promise.all(proms)
                .then((jobs: Job[]) => {
                    jobs = jobs.filter(t => t != null)
                    if (jobs.length)
                        return res.json({ status: true, jobs });
                    else return next(new Record404Exception());
                })
                .catch(err => next(new HttpException("Please try again later.")));
        }
        else return next(new Record404Exception());
    })
};


/**
 *  returns @Jobs
 */
export const rejectedJobs: express.RequestHandler = function (req, res, next) {
    CandidateModal.findById((<any>req)._id , function (err, candidate: Candidate) {
        if (err) return next(err);
        if (candidate && candidate.rejJobs && candidate.rejJobs.length) {
            let proms = [];
            for (let i of candidate.rejJobs)
                proms.push(JobModal.findById(i).exec());
            Promise.all(proms)
                .then((jobs: Job[]) => {
                    jobs = jobs.filter(t => t != null)
                    if (jobs.length)
                        return res.json({ status: true, jobs });
                    else return next(new Record404Exception());
                })
                .catch(err => next(new HttpException("Please try again later.")));
        }
        else return next(new Record404Exception());
    })
};


/**
 *  returns @Jobs
 */
export const jobs: express.RequestHandler = function (req, res, next) {
    CandidateModal.findById((<any>req)._id , function (err, candidate: Candidate) {
        if (err) return next(err);
        if (candidate) {
            let jobIDs = null;
            if (candidate.rejJobs && candidate.rejJobs.length) {
                jobIDs = {}
                for (let i of candidate.rejJobs) {
                    jobIDs[i] = true
                }
            }
            if (candidate.accJobs && candidate.accJobs.length) {
                jobIDs = jobIDs ? jobIDs : {}
                for (let i of candidate.accJobs) {
                    jobIDs[i] = true
                }
            }
            JobModal.find({}, (err, jobs: Job[]) => {
                if (err) return next(err);
                if (jobs && jobs.length) {
                    let filteredJobs = []
                    if (jobIDs) {
                        for (let i of jobs)
                            if (!jobIDs[i._id])
                                filteredJobs.push(i)
                    } else {
                        filteredJobs = jobs
                    }
                    if (filteredJobs.length) {
                        return res.json({ status: true, jobs: filteredJobs });
                    } else {
                        return next(new Record404Exception());
                    }
                }
                else return next(new Record404Exception());
            });
        }
        else return next(new Record404Exception());
    })
};