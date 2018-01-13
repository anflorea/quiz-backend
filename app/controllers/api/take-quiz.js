import { Router } from 'express';
import Question from '../../models/question';
import Technology from '../../models/technology';
import DifficultyLevel from '../../models/difficulty-level';

const router = Router();

router.get('/', (req, res) => {
    //map[int,int] key=questionId, value=amswerId
    var questionsAnswers = req.body.QuestionsAnswers;
    var computedScore = 0;

    for (var questionId in questionsAnswers) {

        Question.findById(questionId, function(err, question) {
            if (err) throw err;

            var correctAnswers = question.correctAnswers;
            //nu avem scorept question asa ca o sa pun default 1

            if (correctAnswers.indexOf(questionsAnswers.getValue(questionId)) > -1)
                computedScore += 1;
        });

    }
    return computedScore;
});

export default router;