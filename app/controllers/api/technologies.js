import { Router } from 'express';
import Technology from '../../models/technology';

const router = Router();

router.post('/technologies', (req, res) => {
  const newTechnology = new Technology({
    name: req.body.name
  });

  console.log(req.body);

  newTechnology.save((err) => {
    if (err) throw err;
    console.log('Technology saved');
    res.json({ message: 'Technology created successfully.' });
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
      res.send({message: 'Technology updated successfully.'});
    });
  });
});

router.delete('/technologies/:id', (req, res) => {
  // NOTE(manu): The case when there are existing questions for given technology was
  // not tested because currently questions do not exist.
  Technology.findById(req.params.id, function (err, technology) {
    if (technology.questions.length !== 0) {
      res.status(424).json({
        message: 'Cannot delete technology that has assigned questions'
      });
    }
  });
  Technology.findByIdAndRemove(req.params.id).exec();
  res.send({message: "Technology deleted successfully"});
});

export default router;