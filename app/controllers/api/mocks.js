import { Router } from 'express';
import Question from '../../models/question';
import DifficultyLevel from '../../models/difficulty-level';
import Technology from '../../models/technology';
import ErrorHandle from '../../utils/error-management';

const router = Router();

router.post('/questions', (req, res) => {
  const number = req.body.number || 10;

  var answers = [
    "Answer 1",
    "Answer 2",
    "Answer 3",
    "Answer 4"
  ];
  var currentTechnologies;
  var currentDifficulties;
  var responseSent = false;

  Technology.find({}, 'id, name', (err, technologies) => {
    currentTechnologies = technologies;

    DifficultyLevel.find({}, 'id, name', (err, difficulties) => {
      currentDifficulties = difficulties;


      if (currentDifficulties.length === 0)
        res.status(401).json({message: "Please add some difficulties before generating questions."});
      else if (currentTechnologies.length === 0)
        res.status(401).json({message: "Please add some technologies before generating questions."});
      else {

        for (var i = 0; i < number; i++) {

           const newQuestion = new Question({
              requirements: "This is just a question. Or is it?",
              rightAnswers: [],
              wrongAnswers: [],
              timeToAnswer: Math.round(Math.random() * 20),
              technology: currentTechnologies[Math.round(Math.random() * (currentTechnologies.length - 1))].id,
              difficultyLevel: currentDifficulties[Math.round(Math.random() * (currentDifficulties.length - 1))].id
              // type: type
            });

           for (var j = 0; j < answers.length; j++) {
              var ok = Math.round(Math.random());
              if (ok)
                newQuestion.rightAnswers.push(answers[j]);
              else
                newQuestion.wrongAnswers.push(answers[j])
           }

          newQuestion.save((err) => {
            if (err) {
              var error = ErrorHandle(err);
              if (!responseSent)
                res.status(401).json(error);
              responseSent = true;
              return;
            }

            if (i == number && !responseSent) {
              res.json({message: "Created " + number + " random questions."});
              responseSent = true;
            }
          });
        }

      }
    });
  });

});

export default router;