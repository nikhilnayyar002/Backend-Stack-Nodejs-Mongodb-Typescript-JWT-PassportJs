import express from 'express';
import { getJobs, getEmployeeJobs, postJob } from '../controllers/job.controller';
import { verifyJwtToken } from '../config/global';

let router:express.Router = express.Router();

router.get('/', getJobs);
router.post('/', verifyJwtToken, postJob);
router.get('/:empID', getEmployeeJobs);

export const jobRouter = router;