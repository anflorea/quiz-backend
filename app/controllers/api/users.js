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

router.put('/:id', (req, res) => {
  User.findById(req.params.id, function (err, user) {
    if (err) throw err;
    
    if (req.body.email)
      user.email = req.body.email;
    if (req.body.firstName)
      user.firstName = req.body.firstName;
    if (req.body.lastName)
      user.lastName = req.body.lastName;

    user.save(function (err, updatedUser) {
      if (err) throw err;
      res.send({message: 'User updated successfully.'});
    });
  });
});

router.delete('/:id', (req, res) => {
  User.findById(req.params.id, function (err, user) {
    if (err)
      res.status(404).json({message: 'User not found.'});
  });
  User.findByIdAndRemove(req.params.id).exec();
  res.send({message: "Technology deleted successfully"});
});

export default router;