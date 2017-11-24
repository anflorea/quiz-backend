import { Router } from 'express';
import User from '../../models/user';
import technologies from './technologies';
import users from './users';
import difficulties from './difficulties';

const router = Router();

router.get('/', (req, res) => {
  res.send(`Hello! Running...`);
});


router.use('/users', users);
router.use('/technologies', technologies);
router.use('/difficulties', difficulties);

export default router;
