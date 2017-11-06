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

router.post('/users', (req, res) => {
  const newUser = new User({
    email: req.body.email,
    password: req.body.password
  });

  newUser.save((err) => {
    if (err) throw err;

    res.json({ message: "Sign up successful!" });
  });
});

export default router;