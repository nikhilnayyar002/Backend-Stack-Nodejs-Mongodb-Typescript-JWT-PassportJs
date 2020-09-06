"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.candidateRouter = void 0;
const express_1 = __importDefault(require("express"));
const candidate_controller_1 = require("../controllers/candidate.controller");
let router = express_1.default.Router();
router.get('/:canID/accept-job/:jobID', candidate_controller_1.acceptJob);
router.get('/:canID/unaccept-job/:jobID', candidate_controller_1.unacceptJob);
router.get('/:canID/reject-job/:jobID', candidate_controller_1.rejectJob);
router.get('/:canID/unreject-job/:jobID', candidate_controller_1.unrejectJob);
router.get('/:canID/job', candidate_controller_1.jobs);
router.get('/:canID/accepted-jobs', candidate_controller_1.acceptedJobs);
router.get('/:canID/rejected-jobs', candidate_controller_1.rejectedJobs);
exports.candidateRouter = router;
