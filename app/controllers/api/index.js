import { Router } from 'express';
import User from '../../models/user';
import technologies from './technologies';
import users from './users';
import difficulties from './difficulties';
import questions from './questions';
import types from './types';
import createQuiz from './create-quiz';

const router = Router();

router.get('/', (req, res) => {
  res.send(`Hello! Running...`);
});


router.use('/users', users);
router.use('/technologies', technologies);
router.use('/difficulties', difficulties);
router.use('/questions', questions);
router.use('/types', types);
router.use('/create-quiz', createQuiz);

export default router;
