import { Router } from 'express';
import Question from '../../models/question';
import User from '../../models/user';
import Technology from '../../models/technology';
import DifficultyLevel from '../../models/difficulty-level';
import Quiz from '../../models/quiz';
import ErrorHandle from '../../utils/error-management';
import getPayload from '../../utils/payload';

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

router.get('/', (req, res) => {
  Quiz.find().populate('assignee', 'username firstName lastName email role').exec((err, quizes) => {
    if (err) {
      res.status(401).json({message: "An error has occured."});
      return;
    }
    res.json(quizes);
  });
});

router.get('/mine', (req, res) => {
  const decoded = getPayload(req);
  User.findById(decoded.payload.currentId).exec((err, user) => {
    Quiz.find({assignee: user}).select('-questions').exec((err, quizes) => {
      if (err) {
        res.status(401).json({message: "An error has occured"});
        return;
      }
      if (quizes.length === 0) {
        res.json({message: "You do not have any quizzes assigned."});
        return;
      }
      res.json(quizes);
    });
  });
});

// TODO: This route should return the quiz with the given id
router.post('/take/:id', (req, res) => {
  res.json({message: "Work in progress."});
});

// 
router.get('/take/:id', (req, res) => {
  res.json({message: "Work in progress."});
});

// This route should mark the quiz with the given id as completed and compute the score for the quiz
router.post('/submit/:id', (req, res) => {
  res.json({message: "Work in progress."});
});

router.post('/create', (req, res) => {
  Question.find({
    difficultyLevel: req.body.difficultyLevelId,
    technology: req.body.technologyId
  }).exec(function(err, questions) {
    if (questions.length === 0) {
      res.status(401).json({message: "Could not find questions with given difficulty & technology."});
      return;
    }

    if (!req.body.examineeId) {
      res.status(401).json({message: "Field `examineeId` is requied! Please assign an EXAMINEE for this quiz."});
      return;
    }

    User.findById(req.body.examineeId, function(err, user) {
      if (err) {
        res.status(401).json({message: "An error has occured."});
        return;
      }
      if (!user) {
        res.status(404).json({message: "User not found."});
        return;
      }

      if (user.role !== "EXAMINEE") {
        res.status(401).json({message: "You can only assign an EXAMINEE to a quiz."});
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
        timeToAnswer: req.body.timeToAnswer,
        assignee: user
      });

      newQuiz.save((err) => {
        if (err) {
          var error = ErrorHandle(err);
          res.status(401).json(error);
          return;
        }
        res.json({message: "Quiz created successfuly"});
      });
    });
  });
});
export default router;