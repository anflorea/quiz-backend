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
  const decoded = getPayload(req)
  if (decoded.payload.role === "EXAMINEE") {
    res.status(403).json({message: "You don't have access to that resource."});
    return;
  }
  Quiz.find().populate('assignee', 'username firstName lastName email role').populate('questions', 'requirements').exec((err, quizes) => {
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

router.post('/take/:id', (req, res) => {
  Quiz.findById(req.params.id).populate('assignee').exec((err, quiz) => {
    if (err) {
      res.status(401).json({message: "An error has occured."});
      return;
    }
    if (!quiz) {
      res.status(404).json({message: "Requested quiz was not found."});
      return;
    }
    const decoded = getPayload(req);
    if (quiz.assignee.id != decoded.payload.currentId) {
      res.status(401).json({message: "You can only start quizzes that are assigned to you!"});
      return;
    }
    if (quiz.completed === true) {
      res.status(401).json({message: "You can not take an alreay completed quiz!"});
      return;
    }
    if (quiz.startTimestamp) {
      res.status(401).json({message: "This quiz was already started."});
      return;
    }
    quiz.startTimestamp = new Date;
    quiz.save((err) => {
      if (err) {
        res.status(401).json({message: "Unable to start quiz. An error has occured."});
      } else {
        res.json({message: "Quiz started successfuly"});
      }
    });
  });
});

router.get('/take/:id', (req, res) => {
  Quiz.findById(req.params.id).populate('assignee', 'username').populate('questions').exec((err, quiz) => {
    if (err) {
      res.status(401).json({message: "An error has occured."});
      return;
    }
    if (!quiz) {
      res.status(404).json({message: "Requested quiz was not found."});
      return;
    }
    const decoded = getPayload(req);
    if (quiz.assignee.id != decoded.payload.currentId) {
      res.status(401).json({message: "You can only take quizzes that are assigned to you!"});
      return;
    }
    if (quiz.completed === true) {
      res.status(401).json({message: "You can not take an alreay completed quiz!"});
      return;
    }
    if (!quiz.startTimestamp) {
      res.status(401).json({message: "This quiz was not started yet.", started: false});
      return;
    }
    const currentDate = new Date();
    const timeDifference = Math.round(Math.abs((currentDate.getTime() - quiz.startTimestamp.getTime()) / 1000));
    if (timeDifference > quiz.timeToAnswer + 60) {
      quiz.completed = true;
      quiz.score = 0;
      quiz.save((err) => {
        if (err) {
          res.status(401).json({message: "An error has occured."});
        } else {
          res.status(401).json({message: "This quiz's time is over."});
        }
      });
    } else {
      let questions = []
      for (var i in quiz.questions) {
        let question = quiz.questions[i];
        if (question.requirements) {
          let answers = []
          for (var j = 0; j < question.rightAnswers.length; j++) {
            answers.push(question.rightAnswers[j])
          }
          for (var j = 0; j < question.wrongAnswers.length; j++) {
            answers.push(question.wrongAnswers[j])
          }
          shuffle(answers);
          let oneQuestion = {
            _id: question._id,
            requirements: question.requirements,
            answers: answers
          }
          questions.push(oneQuestion)
        }
      }
      let obfusatedQuiz = {
        _id: quiz._id,
        questions: questions,
        timeToAnswer: quiz.timeToAnswer,
        assignee: quiz.assignee
      };
      res.json(obfusatedQuiz);
    }
  });
});

// This route should mark the quiz with the given id as completed and compute the score for the quiz
router.post('/submit/:id', (req, res) => {
  res.json({message: "Work in progress."});
});

router.post('/create', (req, res) => {
  const decoded = getPayload(req)
  if (decoded.payload.role === "EXAMINEE") {
    res.status(403).json({message: "You don't have access to that resource."});
    return;
  }
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
        timeToAnswer: totalQuizTime,
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