import { Router } from 'express';
import Question from '../../models/question';
import Technology from '../../models/technology';
import DifficultyLevel from '../../models/difficulty-level';
import Type from '../../models/type';
import ErrorHandle from '../../utils/error-management';

const router = Router();

router.post('/', (req, res) => {
  Technology.findById(req.body.technologyId, function(err, technology) {
    if (err) {
      res.status(404).json({message: "Technology not found."});
      return;
    }
    DifficultyLevel.findById(req.body.difficultyLevelId, function(err, difficultyLevel) {
      if (err) {
        res.status(404).json({message: "Difficulty not found."});
        return;
      }
      Type.findById(req.body.typeId, function(err, type) {
        if (err) {
          res.status(404).json({message: "Type not found."});
          return;
        }

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
  Question.findById(req.params.id, function (err, question) {
    if (err) {
      res.status(404).json({message: "Question not found."});
      return;
    }
    Technology.findById(req.body.technologyId, function(err, technology) {
      if (err) {
        res.status(404).json({message: "Technology not found."});
        return;
      }
      DifficultyLevel.findById(req.body.difficultyLevelId, function(err, difficultyLevel) {
        if (err) {
          res.status(404).json({message: "Difficulty not found."});
          return;
        }
        Type.findById(req.body.typeId, function(err, type) {
          if (err) {
            res.status(404).json({message: "Type not found."});
            return;
          }
  
          if (req.body.requirements)
            question.requirements = req.body.requirements;
          if (req.body.rightAnswers)
            question.rightAnswers = req.body.rightAnswers;
          if (req.body.wrongAnswers)
            question.wrongAnswers = req.body.wrongAnswers;
          if (req.body.timeToAnswer)
            question.timeToAnswer = req.body.timeToAnswer;
          question.technology = technology;
          question.difficultyLevel = difficultyLevel;
          question.type = type;

          question.save(function (err, updatedQuestion) {
            if (err) {
              var error = ErrorHandle(err);
              res.status(401).json(error);
              return;
            }
            res.json({message: 'Question updated successfully.'});
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
    Question.findByIdAndRemove(req.params.id).exec();
    res.json({message: "Question deleted successfully"});
  });
});

export default router;
