import { Router } from 'express';
import DifficultyLevel from '../../models/difficulty-level'
const router = Router();
import ErrorHandle from '../../utils/error-management';

router.get('/', (req, res) => {
    DifficultyLevel.find({ name: {$regex : (req.query.name ? new RegExp("^" + req.query.name, "i") : "")}},'id, name', (err, difficulties) => {
        if (err) {
            res.status(401).json({message: "An error occured."});
            return;
        }
        res.json(difficulties);
    });
});

router.get('/:id', (req, res) => {
    DifficultyLevel.findById(req.params.id, function(err, difficulty) {
        if (!difficulty) {
            res.status(404).json({message: "Difficulty not found."});
            return;
        }
        res.json(difficulty);
    });
});

router.post('/', (req, res) => {
    const newDifficultyLevel = new DifficultyLevel({
        name: req.body.name,
    });
    newDifficultyLevel.save((err) => {
        if (err) {
            var error = ErrorHandle(err);
            res.status(401).json(error);
            return;
        }
        res.json({ message: "new Difficulty level saved successful!" });
    });
});


router.delete('/:id', (req, res) => {
    DifficultyLevel.findById(req.params.id, function (err, difficulty) {
        if (!difficulty) {
            res.status(404).json({message: "Difficulty not found."});
            return;
        }
        if (difficulty.questions.length !== 0) {
            res.status(424).json({
                message: 'Cannot delete difficulty level that has assigned questions'
            });
            return;
        }
        DifficultyLevel.findByIdAndRemove(req.params.id).exec();
        res.send({message: "Difficulty level deleted successfully"});
    });
});

router.put('/:id', (req, res) => {
    DifficultyLevel.findById(req.params.id,(err,difficulty) =>{
        if (!difficulty) {
            res.status(404).json({message: "Difficulty not found!"});
            return;
        }
        
        difficulty.name = req.body.name;

        difficulty.save((err,updatedDifficulty) => {
            if (err) {
                var error = ErrorHandle(err);
                res.status(401).json(error);
                return;
            }
            res.send({message:"Difficulty level updated successfully!"});
        });

    });

});

export default router;
