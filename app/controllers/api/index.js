import { Router } from 'express';
import User from '../../models/user';
import technologies from './technologies';
import users from './users';
import difficulties from './difficulties';
import questions from './questions';
import types from './types';
import quiz from './quiz';
import mocks from './mocks';

const router = Router();

router.get('/', (req, res) => {
  res.send(`Hello! Running...`);
});


router.use('/users', users);
router.use('/technologies', technologies);
router.use('/difficulties', difficulties);
router.use('/questions', questions);
router.use('/types', types);
router.use('/quiz', quiz);
router.use('/mocks', mocks);

export default router;
