const mongoose = require('mongoose');


const QuestionSchema = new mongoose.Schema({
userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
title: { type: String, required: true },
platform: { type: String },
difficulty: { type: String },
topic: { type: String },
timeTakenMinutes: { type: Number },
notes: { type: String },
dateSolved: { type: Date, default: Date.now },
revisionCount: { type: Number, default: 0 },
nextRevisionDate: { type: Date },
}, { timestamps: true });


module.exports = mongoose.model('Question', QuestionSchema);