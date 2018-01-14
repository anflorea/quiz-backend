import mongoose from 'mongoose';

const Schema = mongoose.Schema;

export default mongoose.model('Question', new Schema({
    requirements: {
      type: String,
      trim: true,
      required: true,
      unique: false
    },
    rightAnswers: {
      type: [String]
    },
    wrongAnswers: {
      type: [String]
    },
    timeToAnswer: {
      type: Number,
      required: true
    },
    technology: {
      type: Schema.Types.ObjectId, 
      ref: 'Technology',
      required: true
    },
    difficultyLevel: {
      type: Schema.Types.ObjectId, 
      ref: 'DifficultyLevel',
      required: true
    },
    type: {
      type: Schema.Types.ObjectId, 
      ref: 'Type'
    }
}));
