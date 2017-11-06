import { Router } from 'express';
import User from '../../models/user'

const router = Router();

router.get('/', (req, res) => {
  res.send(`Hello! Running...`);
});

router.get('/users', (req, res) => {
  User.find({}, (err, users) => {
    res.json(users);
  });
});

export default router;