import express from "express";
import mongoose from "mongoose";
import { JobModal, Job } from "../modal/job";
import { Record404Exception, HttpException } from "../config/global";
import { EmployeeModal, Employee } from "../modal/employee";

/**
 * Return @message
 */
export const postJob: express.RequestHandler = function (req, res, next) {
    EmployeeModal.findOne({ _id: (<any>req)._id },
        (err, emp: Employee) => {
            if (err) return next(new HttpException())
            if (!emp)
                return res.status(404).json({ status: false, message: 'Invalid employee id.' });
            else {
                let job:Job = {...req.body, empID:(<any>req)._id}
                let newJob = new JobModal(job)
                newJob.save((err, job: Job) => {
                    if (!err) return res.json({ status: true, message: "Success" });
                    else {
                        if (err.code) return res.status(422).json({ status: false, message: err.code });
                        else return next(err);
                    }
                });
            }
        }
    );
};

/**
 * Return @Jobs
 */
export const getJobs: express.RequestHandler = function (req, res, next) {
    JobModal.find({}, (err, jobs: Job[]) => {
        if (err) return next(err);
        if (jobs && jobs.length) return res.json({ status: true, jobs });
        else return next(new Record404Exception());
    });
};

/**
 *  returns @Jobs
 */
export const getEmployeeJobs: express.RequestHandler = (req, res, next) => {
    let empID = req.params.empID;

    JobModal.find({ empID }, (err, jobs: Job[]) => {
        if (err) return next(err);
        if (jobs && jobs.length) return res.json({ status: true, jobs });
        else return next(new Record404Exception());
    });
};