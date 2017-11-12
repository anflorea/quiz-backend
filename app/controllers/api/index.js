import { Router } from 'express';
import User from '../../models/user';
import Technology from '../../models/technology';

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

router.post('/technologies', (req, res) => {
  const newTechnology = new Technology({
    name: req.body.name
  });

  console.log(req.body);

  newTechnology.save((err) => {
    if (err) throw err;
    console.log('Technology saved');
    res.json({ success: true });
  });
});

router.get('/technologies', (req, res) => {
  Technology.find({}, (err, technologies) => {
    console.log(technologies);
    res.json(technologies);
  });
});

router.put('/technologies/:id', (req, res) => {
  Technology.findById(req.params.id, function (err, technology) {
    if (err) throw err;
    
    technology.name = req.body.name;
    technology.save(function (err, updatedTechnology) {
      if (err) throw err;
      res.send({success: true});
    });
  });
});

router.delete('/technologies/:id', (req, res) => {
  // NOTE(manu): The case when there are existing questions for given technology was
  // not tested because currently questions do not exist.
  Technology.findById(req.params.id, function (err, technology) {
    if (technology.questions.length !== 0) {
      res.send({
        success: false,
        message: 'Cannot delete technology that has assigned questions'
      });
    }
  });
  Technology.findByIdAndRemove(req.params.id).exec();
  res.send({success: true});
});

export default router;