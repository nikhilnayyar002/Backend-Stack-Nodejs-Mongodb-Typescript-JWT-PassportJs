"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeModal = exports.EmployeeSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const user_1 = require("./user");
/** Mongoose Schema and Modal */
exports.EmployeeSchema = new mongoose_1.default.Schema({
// jobs: { type: [String] }
});
exports.EmployeeModal = user_1.UserModal.discriminator("Employee", exports.EmployeeSchema);
