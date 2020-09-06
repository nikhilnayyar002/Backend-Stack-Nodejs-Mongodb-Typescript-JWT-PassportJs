import mongoose from "mongoose";
import { UserModal, UserProfile } from "./user";

/** Typescript Modal  */

export interface Candidate extends UserProfile{
    accJobs:string[];
    rejJobs:string[];
}

/** Mongoose Schema and Modal */

export const CandidateSchema = new mongoose.Schema({
    accJobs: { type: [String] },
    rejJobs: { type: [String] }
});

export const CandidateModal= UserModal.discriminator<Candidate & mongoose.Document>("Candidate",CandidateSchema);