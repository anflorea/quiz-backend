import { Router } from 'express';
import DifficultyLevel from '../../models/difficulty-level'
const router = Router();

router.get('/', (req, res) => {
    DifficultyLevel.find({},'id, name', (err, difficulties) => {
        console.log(difficulties);
        res.json(difficulties);
    });
});

router.get('/:id', (req, res) => {
    DifficultyLevel.findById(req.params.id, function(err, difficulty) {
        if (err) throw err;
        res.json(difficulty);
    });
});

router.post('/', (req, res) => {
    const newDifficultyLevel = new DifficultyLevel({
        name: req.body.name,
    });
    console.log(req.body);
    newDifficultyLevel.save((err) => {
        if (err) throw err;
        console.log('Difficulty level saved');
        res.json({ message: "new Difficulty level saved successful!" });
    });
});


router.delete('/:id', (req, res) => {
    DifficultyLevel.findById(req.params.id, function (err, difficulty) {
        if (difficulty.questions.length !== 0) {
            res.status(424).json({
                message: 'Cannot delete difficulty level that has assigned questions'
            });
        }
    });
    DifficultyLevel.findByIdAndRemove(req.params.id).exec();
    res.send({message: "Difficulty level deleted successfully"});
});

router.put('/:id', (req, res) => {
    DifficultyLevel.findById(req.params.id,(err,difficulty) =>{
        if(err) throw err;
        difficulty.name=req.body.name;
        difficulty.save((err,updatedDifficulty)=>{
            if(err) throw err;
            res.send({message:"Difficulty level updated successfully!"});
        });

    });

});

export default router;