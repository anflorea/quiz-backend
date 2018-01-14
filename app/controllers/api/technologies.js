import { Router } from 'express';
import Technology from '../../models/technology';
import ErrorHandle from '../../utils/error-management';

const router = Router();

router.post('/', (req, res) => {
  const newTechnology = new Technology({
    name: req.body.name
  });

  console.log(req.body);

  newTechnology.save((err) => {
    if (err) {
        var error = ErrorHandle(err);
        res.status(401).json(error);
        return;
    }
    res.json({ message: 'Technology created successfully.' });
  });
});

router.get('/', (req, res) => {
  Technology.find({ name: {$regex : (req.query.name ? ("/^" + req.query.name, "i") : "")}}, 'id, name', (err, technologies) => {
    if (err) {
      res.status(401).json({message: "No technologies found."});
    } else 
      res.json(technologies);
  });
});

router.get('/:id', (req, res) => {
  Technology.findById(req.params.id, function(err, technology) {
    if (err) {
      res.status(404).json({message: "Technology not found!"});
    } else
      res.json(technology);
  });
});

router.put('/:id', (req, res) => {
  Technology.findById(req.params.id, function (err, technology) {
    if (err) {
      res.status(404).json({message: "Technology not found!"});
      return;
    }
    
    technology.name = req.body.name;
    technology.save(function (err, updatedTechnology) {
      if (err) {
        var error = ErrorHandle(err);
        res.status(401).json(error);
        return;
      }
      res.send({message: 'Technology updated successfully.'});
    });
  });
});

router.delete('/:id', (req, res) => {
  // NOTE(manu): The case when there are existing questions for given technology was
  // not tested because currently questions do not exist.
  Technology.findById(req.params.id, function (err, technology) {
    if (err) {
      res.status(404).json({message: "Technology not found."});
      return;
    }
    if (technology.questions.length !== 0) {
      res.status(424).json({
        message: 'Cannot delete technology that has assigned questions'
      });
      return;
    }
  }).then(function() {
    Technology.findByIdAndRemove(req.params.id).exec();
    res.send({message: "Technology deleted successfully"});
  });
});

export default router;