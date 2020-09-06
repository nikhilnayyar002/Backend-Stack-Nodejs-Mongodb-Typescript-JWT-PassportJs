"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobModal = exports.JobSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
/** Mongoose Schema and Modal */
exports.JobSchema = new mongoose_1.default.Schema({
    empID: String,
    _id: String,
    title: String,
    location: String,
    date: { type: Date },
    status: String,
    candidate: String,
    more: String,
    screen: String,
    interview: String,
    offer: String,
    onHolds: String,
    rejected: String
});
exports.JobModal = mongoose_1.default.model("Answer", exports.JobSchema);
