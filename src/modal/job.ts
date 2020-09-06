import mongoose from "mongoose";

/** Typescript Modal  */

export interface Job {
    empID:string; /** Employee ID */
    _id:string; /** Job ID */
    title:string;
    location:string;
    date:Date;
    status:string;
    candidate:string;
    more:string;

    screen:string;
    interview:string;
    offer:string;
    onHolds:string;
    rejected:string;
}

/** Mongoose Schema and Modal */

export const JobSchema = new mongoose.Schema({
    empID:String, /** Employee ID */
    _id:String, /** Job ID */
    title:String,
    location:String,
    date: { type:Date },
    status:String,
    candidate:String,
    more:String,

    screen:String,
    interview:String,
    offer:String,
    onHolds:String,
    rejected:String
});

export const JobModal= mongoose.model<Job & mongoose.Document>("Job", JobSchema);