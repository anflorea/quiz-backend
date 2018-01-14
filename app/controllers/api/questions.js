import { Router } from 'express';
import Question from '../../models/question';
import Technology from '../../models/technology';
import DifficultyLevel from '../../models/difficulty-level';
import Type from '../../models/type';
import ErrorHandle from '../../utils/error-management';

const router = Router();

router.post('/', (req, res) => {
  Technology.findById(req.body.technologyId, function(err, technology) {
    if (err) throw err;
    DifficultyLevel.findById(req.body.difficultyLevelId, function(err, difficultyLevel) {
      if (err) throw err;
      Type.findById(req.body.typeId, function(err, type) {
        if (err) throw err;

        console.log(technology);

        const newQuestion = new Question({
          requirements: req.body.requirements,
          rightAnswers: req.body.rightAnswers,
          wrongAnswers: req.body.wrongAnswers,
          timeToAnswer: req.body.timeToAnswer,
          technology: technology,
          difficultyLevel: difficultyLevel,
          type: type
        });

        newQuestion.save((err) => {
          if (err) {
            var error = ErrorHandle(err);
            res.status(401).json(err);
            return;
          }
          res.json({ message: 'Question created successfully.' });
        });
      });
    });
  });
});

router.get('/', (req, res) => {
  Question.find((err, technologies) => {
    if (err) {
      res.status(401).json({message: "An error has occured!"});
      return;
    }
    res.json(technologies);
  });
});


router.get('/:id', (req, res) => {
  Question.findById(req.params.id, function(err, question) {
    if (err) {
      res.status(404).json({message: "Question not found."});
      return;
    }
    res.json(question);
  });
});

router.put('/:id', (req, res) => {
  console.log("Got request")
  Question.findById(req.params.id, function (err, question) {
    if (err) throw err;
    console.log("Got question");
    Technology.findById(req.body.technologyId, function(err, technology) {
      if (err) throw err;
      console.log("Got technology");
      DifficultyLevel.findById(req.body.difficultyLevelId, function(err, difficultyLevel) {
        if (err) throw err;
        console.log("Got difficultyLevel");
        Type.findById(req.body.typeId, function(err, type) {
          if (err) throw err;
          console.log("Got type");
  
          question.requirements = req.body.requirements;
          question.rightAnswers = req.body.rightAnswers;
          question.wrongAnswers = req.body.wrongAnswers;
          question.timeToAnswer = req.body.timeToAnswer;
          question.technology = technology;
          question.difficultyLevel = difficultyLevel;
          question.type = type;

          question.save(function (err, updatedQuestion) {
            if (err) throw err;
            res.send({message: 'Question updated successfully.'});
          });
        });
      });
    });
  });
});

router.delete('/:id', (req, res) => {
  Question.findById(req.params.id, function (err, question) {
    if (err) {
      res.status(404).json({message: "Question not found."});
      return;
    }
  }).then(function() {
    Question.findByIdAndRemove(req.params.id).exec();
    res.send({message: "Question deleted successfully"});
  });
});

export default router;
