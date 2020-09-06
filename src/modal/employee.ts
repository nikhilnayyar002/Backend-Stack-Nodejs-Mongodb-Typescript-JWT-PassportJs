import mongoose from "mongoose";
import { UserModal, UserProfile } from "./user";

/** Typescript Modal  */

export interface Employee extends UserProfile{
    // jobs:string[];
}

/** Mongoose Schema and Modal */

export const EmployeeSchema = new mongoose.Schema({
    // jobs: { type: [String] }
});

export const EmployeeModal= UserModal.discriminator<Employee & mongoose.Document>("Employee",EmployeeSchema);
