import { Router } from 'express';
import User from '../../models/user';

const router = Router();

router.get('/', (req, res) => {
  User.find({}, (err, users) => {
    res.json(users);
  });
});

router.get('/:id', (req, res) => {
  User.findById(req.params.id, function(err, user) {
    if (err) throw err;

    res.json(user);
  });
});

router.post('/', (req, res) => {
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

export default router;