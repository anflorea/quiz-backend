import { Router } from 'express';
import User from '../../models/user';

const router = Router();

router.get('/', (req, res) => {
  User.find({
      username: {$regex : (req.query.username ? ("^" + req.query.username, "i") : "")}, 
      email: {$regex : (req.query.email ? ("^" + req.query.email, "i") : "")},
      firstName: {$regex : (req.query.firstName ? ("^" + req.query.firstName, "i") : "")},
      lastName: {$regex : (req.query.lastName ? ("^" + req.query.lastName, "i") : "")},
      role: {$regex : (req.query.role ? ("^" + req.query.role, "i") : "")}
  }, (err, users) => {
    if (err) {
      res.status(401).json({message: "An error has occured."});
      return;
    }
    res.json(users);
  });
});

router.get('/:id', (req, res) => {
  User.findById(req.params.id, function(err, user) {
    if (err) {
      res.status(404).json({message: "User not found."});
      return;
    }

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
    if (err) {
      switch (err.name) {
        case 'ValidationError':
          var error = {};
          error.message = err._message;
          error.errors = {};
          for (var field in err.errors) {
            console.log(err.errors[field]);
            error.errors[field] = err.errors[field].message;
          }
          res.status(401).json(error);
          break;
        default:
          res.status(401).json({message: "An error has occured."});
          break;
      }
      return;
    }

    res.json({ message: "Sign up successful!" });
  });
});

router.put('/:id', (req, res) => {
  User.findById(req.params.id, function (err, user) {
    if (err) {
      res.status(404).json({message: "User not found."});
      return;
    }
    
    if (req.body.email)
      user.email = req.body.email;
    if (req.body.firstName)
      user.firstName = req.body.firstName;
    if (req.body.lastName)
      user.lastName = req.body.lastName;

    user.save(function (err, updatedUser) {
      if (err) {
        switch (err.name) {
          case 'ValidationError':
            var error = {};
            error.message = err._message;
            error.errors = {};
            for (var field in err.errors) {
              console.log(err.errors[field]);
              error.errors[field] = err.errors[field].message;
            }
            res.status(401).json(error);
            break;
          default:
            res.status(401).json({message: "An error has occured."});
            break;
        }
        return;
      }
      res.send({message: 'User updated successfully.'});
    });
  });
});

router.delete('/:id', (req, res) => {
  User.findById(req.params.id, function (err, user) {
    if (err) {
      res.status(404).json({message: 'User not found.'});
      return;
    }
  });
  User.findByIdAndRemove(req.params.id).exec();
  res.send({message: "User deleted successfully"});
});

export default router;