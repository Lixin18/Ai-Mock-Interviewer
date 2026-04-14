import express from 'express';
import {
    startInterview,
    evaluateAnswer,
    completeInterview,
    getHistory,
    getSession
} from '../controllers/interviewController.js';

const router = express.Router();

router.post('/start', startInterview);
router.post('/evaluate', evaluateAnswer);
router.post('/complete', completeInterview);
router.get('/history', getHistory);
router.get('/session/:id', getSession);

export default router;
