import { Router } from 'express';
import Question from '../../models/question';
import Technology from '../../models/technology';
import DifficultyLevel from '../../models/difficulty-level';
import Quiz from '../../models/quiz';

const router = Router();

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

router.post('/', (req, res) => {
  Question.find({
    difficultyLevel: req.body.difficultyLevelId,
    technology: req.body.technologyId
  }).exec(function(err, questions) {
    if (questions.length === 0) {
      res.status(401).json({message: "Could not find questions with given difficulty & technology."});
      return;
    }

    shuffle(questions);

    var totalQuizTime = 0;
    var questionsIndex = 0;
    var quizQuestions = [];
    while (questionsIndex < questions.length) {
      totalQuizTime += questions[questionsIndex].timeToAnswer;
      if (totalQuizTime > req.body.timeToAnswer) {
        break;
      }
      quizQuestions.push(questions[questionsIndex]);
      questionsIndex++;
    }

    if (quizQuestions.length === 0) {
      res.status(401).json({message: "We could not create quiz with that amount of timeToAnswer now. You can try again or give a higher number for timeToAnswer."});
      return;
    }

    const newQuiz = new Quiz({
      questions: quizQuestions,
      timeToAnswer: req.body.timeToAnswer
    });
    res.json(newQuiz);
  });
});
export default router;