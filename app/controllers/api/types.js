import { Router } from 'express';
import Type from '../../models/type';

const router = Router();

router.post('/', (req, res) => {
  const newType = new Type({
    name: req.body.name
  });

  console.log(req.body);

  newType.save((err) => {
    if (err) throw err;
    console.log('Type saved');
    res.json({ message: 'Type created successfully.' });
  });
});

router.get('/', (req, res) => {
  Type.find({ name: {$regex : (req.query.name ? ("/^" + req.query.name, "i") : "")}}, 'id, name', (err, technologies) => {
    console.log(technologies);
    res.json(technologies);
  });
});

router.get('/:id', (req, res) => {
  Type.findById(req.params.id, function(err, type) {
    if (err) throw err;

    res.json(type);
  });
});

router.put('/:id', (req, res) => {
  Type.findById(req.params.id, function (err, type) {
    if (err) throw err;
    
    type.name = req.body.name;
    type.save(function (err, updatedType) {
      if (err) throw err;
      res.send({message: 'Type updated successfully.'});
    });
  });
});

router.delete('/:id', (req, res) => {
  // NOTE(manu): The case when there are existing questions for given type was
  // not tested because currently questions do not exist.
  Type.findById(req.params.id, function (err, type) {
    if (type.questions.length !== 0) {
      res.status(424).json({
        message: 'Cannot delete type that has assigned questions'
      });
    }
  });
  Type.findByIdAndRemove(req.params.id).exec();
  res.send({message: "Type deleted successfully"});
});

export default router;
