import { Router } from 'express';
import { seedUsers, addUser, listUsers, claimPoints, leaderboard, claimHistory } from '../controllers/userController.js';

const router = Router();

router.post('/seed', seedUsers);
router.post('/', addUser);
router.get('/', listUsers);
router.post('/:userId/claim', claimPoints);
router.get('/leaderboard/list', leaderboard);
router.get('/history', claimHistory);

export default router;
