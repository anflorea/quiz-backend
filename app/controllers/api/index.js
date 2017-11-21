import { Router } from 'express';
import User from '../../models/user';
import technologies from './technologies';
import difficulties from './difficulties';
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
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    firstName: req.body.firstName,
    lastName: req.body.lastName
  });

  newUser.save((err) => {
    if (err) throw err;

    res.json({ message: "Sign up successful!" });
  });
});

router.use('/technologies', technologies);
router.use('/difficulties', difficulties);

export default router;
