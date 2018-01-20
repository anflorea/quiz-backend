import { Router } from 'express';
import User from '../../models/user';
import technologies from './technologies';
import users from './users';
import difficulties from './difficulties';
import questions from './questions';
import types from './types';
import quiz from './quiz';
import mocks from './mocks';
import getPayload from '../../utils/payload';

const router = Router();

router.get('/', (req, res) => {
  res.send(`Hello! Running...`);
});

router.use('/quiz', quiz);
router.use('/users', users);

router.use((req, res, next) => {
  const decoded = getPayload(req);
  if (decoded.payload.role === "EXAMINEE") {
    res.status(403).json({message: "You do not have access to that resource!"});
  } else {
    next();
  }
});

router.use('/technologies', technologies);
router.use('/difficulties', difficulties);
router.use('/questions', questions);
router.use('/types', types);
router.use('/mocks', mocks);

export default router;
