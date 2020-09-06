"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandidateModal = exports.CandidateSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const user_1 = require("./user");
/** Mongoose Schema and Modal */
exports.CandidateSchema = new mongoose_1.default.Schema({
    accJobs: { type: [String] },
    rejJobs: { type: [String] }
});
exports.CandidateModal = user_1.UserModal.discriminator("Candidate", exports.CandidateSchema);
