import { Router } from 'express';
import Type from '../../models/type';
import ErrorHandle from '../../utils/error-management';

const router = Router();

router.post('/', (req, res) => {
  const newType = new Type({
    name: req.body.name
  });

  newType.save((err) => {
    if (err) {
      var error = ErrorHandle(err);
      res.status(401).json(error);
      return;
    }
    res.json({ message: 'Type created successfully.' });
  });
});

router.get('/', (req, res) => {
  Type.find({ name: {$regex : (req.query.name ? ("/^" + req.query.name, "i") : "")}}, 'id, name', (err, technologies) => {
    if (err) {
      res.status(404).json({message: "No types found."});
    } else
      res.json(technologies);
  });
});

router.get('/:id', (req, res) => {
  Type.findById(req.params.id, function(err, type) {
    if (err) {
      res.status(404).json({message: "Type not found."});
    } else
      res.json(type);
  });
});

router.put('/:id', (req, res) => {
  Type.findById(req.params.id, function (err, type) {
    if (err) {
      res.status(404).json({message: "Type not found."});
      return;
    }
    
    type.name = req.body.name;
    type.save(function (err, updatedType) {
      if (err) {
        var error = ErrorHandle(err);
        res.status(401).json(error);
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
      res.status(404).json({message: "Type not found."});
      return;
    }
    if (type.questions.length !== 0) {
      res.status(424).json({
        message: 'Cannot delete type that has assigned questions'
      });
      return;
    }
    Type.findByIdAndRemove(req.params.id).exec();
    res.send({message: "Type deleted successfully"});
  });
});

export default router;
