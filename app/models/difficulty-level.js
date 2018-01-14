import mongoose from 'mongoose';
import crypto from 'crypto';

const Schema = mongoose.Schema;

const DifficultyLevel = new Schema({
    name: {
        type: String,
        trim: true,
        unique: true,
        required: true,
        lowercase: true
    },
    questions:[{type: Schema.Types.ObjectId, ref: 'Question'}]
});

DifficultyLevel.pre('save', function (next) {
    var difficultyLevel = this;
    console.log(difficultyLevel);
    next();
});

export default mongoose.model('DifficultyLevel', DifficultyLevel);