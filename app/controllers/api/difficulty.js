import { Router } from 'express';
import DifficultyLevel from '../../models/difficulty-level'
const router = Router();

router.get('/difficulty', (req, res) => {
    User.find({}, (err, difficultyLevels) => {
        res.json(difficultyLevels);
    });
});

router.post('/difficulty', (req, res) => {
    const newDifficultyLevel = new DifficultyLevel({
        name: req.body.name,
        questions: req.body.questions
    });
    newDifficultyLevel.save((err) => {
        if (err) throw err;

        res.json({ message: "newDifficultyLevel saved successful!" });
    });
});


router.delete('/difficulty', (req, res) => {
    const difficultyLevelId =req.body.Id;
    this.findByIdAndRemove((difficultyLevelId,err)=>{
        if (err) throw err;
        res.json({ message: "DifficultyLevel deleted successful!" });
    });
});

router.put('/difficulty', (req, res) => {
    this.findById(req.body.Id,(err,todo) =>{
        if(err) throw err;
        todo.name=req.body.name || todo.name;
        todo.questions=req.body.questions || todo.questions;

        todo.save((err,todo)=>{
            if(err) throw err;
            res.json({message:"DifficultyLevel updated successfully!"});
        });

    });

});