import mongoose from 'mongoose';

const Schema = mongoose.Schema;

export default mongoose.model('Quiz', new Schema({
    questions: [{type: Schema.Types.ObjectId, ref: 'Question'}],
    timeToAnswer: Number
}));
