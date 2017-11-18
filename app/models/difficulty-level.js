import mongoose from 'mongoose';
import crypto from 'crypto';

const Schema = mongoose.Schema;

const DifficultyLevel = new Schema({
    createdAt: Date,
    updatedAt: Date,
    name: {
        type: String,
        trim: true,
        unique: true,
        lowercase: true
    },
    questions:[{
        type:ObjectId,
        ref:'Question'
    }]
}, {
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
});

DifficultyLevel.pre('save', function (next) {
    var difficultyLevel = this;
    console.log(difficultyLevel);
    next();
});

export default mongoose.model('DifficultyLevel', DifficultyLevel);