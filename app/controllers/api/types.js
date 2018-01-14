import { Router } from 'express';
import Type from '../../models/type';

const router = Router();

router.post('/', (req, res) => {
  const newType = new Type({
    name: req.body.name
  });

  newType.save((err) => {
    if (err) {
      switch (err.name) {
        case 'ValidationError':
          var error = {};
          error.message = err._message;
          error.errors = {};
          for (var field in err.errors) {
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
    res.json({ message: 'Type created successfully.' });
  });
});

router.get('/', (req, res) => {
  Type.find({ name: {$regex : (req.query.name ? ("/^" + req.query.name, "i") : "")}}, 'id, name', (err, technologies) => {
    if (err) {
      res.status(404).json({message: "No technologies found."});
    } else
      res.json(technologies);
  });
});

router.get('/:id', (req, res) => {
  Type.findById(req.params.id, function(err, type) {
    if (err) {
      res.status(404).json({message: "Technology not found."});
    } else
      res.json(type);
  });
});

router.put('/:id', (req, res) => {
  Type.findById(req.params.id, function (err, type) {
    if (err) {
      res.status(404).json({message: "Technology not found."});
      return;
    }
    
    type.name = req.body.name;
    type.save(function (err, updatedType) {
      if (err) {
        switch (err.name) {
          case 'ValidationError':
            var error = {};
            error.message = err._message;
            error.errors = {};
            for (var field in err.errors) {
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
      res.send({message: 'Type updated successfully.'});
    });
  });
});

router.delete('/:id', (req, res) => {
  // NOTE(manu): The case when there are existing questions for given type was
  // not tested because currently questions do not exist.
  Type.findById(req.params.id, function (err, type) {
    if (err) {
      res.status(404).json({message: "Technology not found."});
      return;
    }
    if (type.questions.length !== 0) {
      res.status(424).json({
        message: 'Cannot delete type that has assigned questions'
      });
    }
  }).then(function() {
    Type.findByIdAndRemove(req.params.id).exec();
    res.send({message: "Type deleted successfully"});
  });
});

export default router;
