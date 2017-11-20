import { Router } from 'express';
import User from '../../models/user';
import technologies from './technologies';
import users from './users';

const router = Router();

router.get('/', (req, res) => {
  res.send(`Hello! Running...`);
});

router.user('/users', users);

router.use('/technologies', technologies);

export default router;