import mongoose from 'mongoose';

const answerSchema = new mongoose.Schema({
  text: { type: String, required: true, trim: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
  references: [
    {
      title: { type: String, required: true },
      url: { type: String, required: true }
    },
  ],
  upVoteCount: { type: Number, default: 0, min: 0 },
  downVoteCount: { type: Number, default: 0, min: 0 }
}, {
  timestamps: true
});

export default mongoose.model('Answer', answerSchema);