
import express from 'express';
import * as userCtl from '../controllers/user.controller';
import { verifyJwtToken } from '../config/global';

let router:express.Router = express.Router();

router.post('/authenticate', userCtl.authenticate);
router.get('/userProfile',verifyJwtToken, userCtl.userProfile);
router.post('/register', userCtl.register);

export let userRouter = router;