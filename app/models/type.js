import mongoose from 'mongoose';
import Question from './question';
const Schema = mongoose.Schema;

export default mongoose.model('Type', new Schema({
  name: {
        type: String,
        trim: true,
        unique: true,
        required: true
    },
  questions: [{type: Schema.Types.ObjectId, ref: 'Question'}]
}));
