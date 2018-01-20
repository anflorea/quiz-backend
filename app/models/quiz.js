import mongoose from 'mongoose';

const Schema = mongoose.Schema;

export default mongoose.model('Quiz', new Schema({
    questions: [{
      type: Schema.Types.ObjectId,
      ref: 'Question'
    }],
    timeToAnswer: {
      type: Number,
      required: true
    },
    assignee: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    completed: {
      type: Boolean,
      required: true,
      default: false
    },
    score: {
      type: Number
    },
    startTimestamp: {
      type: Date
    }
}));
