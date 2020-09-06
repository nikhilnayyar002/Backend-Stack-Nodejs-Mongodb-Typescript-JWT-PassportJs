import express from 'express';
import { acceptJob, unacceptJob, rejectJob, unrejectJob, acceptedJobs, rejectedJobs, jobs } from '../controllers/candidate.controller';
import { verifyJwtToken } from '../config/global';

let router:express.Router = express.Router();

router.all('*',verifyJwtToken);

router.get('/accept-job/:jobID', acceptJob);
router.get('/unaccept-job/:jobID', unacceptJob);

router.get('/reject-job/:jobID', rejectJob);
router.get('/unreject-job/:jobID', unrejectJob);

router.get('/jobs', jobs);
router.get('/accepted-jobs', acceptedJobs);
router.get('/rejected-jobs', rejectedJobs);

export const candidateRouter = router;