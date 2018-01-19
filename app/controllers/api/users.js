import { Router } from 'express';
import jwt from 'jsonwebtoken';
import User from '../../models/user';
import ErrorHandle from '../../utils/error-management';

const router = Router();

function validateRole(role) {
  role = role.toUpperCase();
  if (role !== "ADMIN" && role != "EXAMINEE" && role !== "HR" && role !== "RECRUITER")
    return false;
  return true;
}

router.get('/', (req, res) => {
  User.find({
      username: {$regex : (req.query.username ? new RegExp("^" + req.query.username, "i") : "")}, 
      email: {$regex : (req.query.email ? new RegExp("^" + req.query.email, "i") : "")},
      firstName: {$regex : (req.query.firstName ? new RegExp("^" + req.query.firstName, "i") : "")},
      lastName: {$regex : (req.query.lastName ? new RegExp("^" + req.query.lastName, "i") : "")},
      role: {$regex : (req.query.role ? new RegExp("^" + req.query.role, "i") : "")}
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
    if (!user) {
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
    lastName: req.body.lastName,
    role: req.body.role
  });

  if (req.body.role) {
    if (!validateRole(req.body.role)) {
      res.status(401).json({message: "Role field must be one of: ADMIN, HR, RECRUITER, EXAMINEE"});
      return;
    }
  }

  newUser.save((err) => {
    if (err) {
      var error = ErrorHandle(err);
      res.status(401).json(error);
      return;
    }

    res.json({ message: "Sign up successful!" });
  });
});

router.put('/:id', (req, res) => {
  User.findById(req.params.id, function (err, user) {
    if (!user) {
      res.status(404).json({message: "User not found."});
      return;
    }

    if (req.body.role) {
      if (!validateRole(req.body.role)) {
        res.status(401).json({message: "Role field must be one of: ADMIN, HR, RECRUITER, EXAMINEE"});
        return;
      }
    }
    
    if (req.body.email)
      user.email = req.body.email;
    if (req.body.firstName)
      user.firstName = req.body.firstName;
    if (req.body.lastName)
      user.lastName = req.body.lastName;
    if (req.body.role)
      user.role = req.body.role.toUpperCase();
    if (req.body.password)
      user.password = req.body.password;

    user.save(function (err, updatedUser) {
      if (err) {
        var error = ErrorHandle(err);
        res.status(401).json(error);
        return;
      }
      res.send({message: 'User updated successfully.'});
    });
  });
});

router.delete('/:id', (req, res) => {
  const token = req.headers['x-access-token'];
  var decoded = jwt.decode(token, {complete: true});
  if (decoded.payload.role !== "ADMIN") {
    res.status(403).json({message: "Unauthorized!"});
    return;
  }
  User.findById(req.params.id, function (err, user) {
    if (!user) {
      res.status(404).json({message: 'User not found.'});
      return;
    }
    if (decoded.payload.currentUser === user.username) {
      res.status(401).json({message: 'You can not delete your own account!'});
      return;
    }

    User.findByIdAndRemove(req.params.id).exec();
    res.send({message: "User deleted successfully"});
  });
});

export default router;