import mongoose from 'mongoose';
import Question from './question';
const Schema = mongoose.Schema;

export default mongoose.model('Technology', new Schema({
  name: String,
  questions: [{type: Schema.Types.ObjectId, ref: 'Question'}]
}));
