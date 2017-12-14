import mongoose from 'mongoose';

const Schema = mongoose.Schema;

export default mongoose.model('Question', new Schema({
    requirements: String,
    rightAnswers: [String],
    wrongAnswers: [String],
    timeToAnswer: Number,
    technology: {type: Schema.Types.ObjectId, ref: 'Technology'},
    difficultyLevel: {type: Schema.Types.ObjectId, ref: 'DifficultyLevel'},
    type: {type: Schema.Types.ObjectId, ref: 'Type'}
}));
