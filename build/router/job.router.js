"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jobRouter = void 0;
const express_1 = __importDefault(require("express"));
const job_controller_1 = require("../controllers/job.controller");
let router = express_1.default.Router();
router.get('/', job_controller_1.getJobs);
router.post('/', job_controller_1.postJob);
router.get('/:empID', job_controller_1.getEmployeeJobs);
exports.jobRouter = router;
