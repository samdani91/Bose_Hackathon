import mongoose from "mongoose";

const VoteSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    question_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
      required: false,
    },
    answer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Answer",
      required: false,
    },
    type: {
      type: String,
      enum: ["upvote", "downvote"],
      required: true,
    },
  },
  { timestamps: true }
);

VoteSchema.index({ user_id: 1, question_id: 1, answer_id: 1 }, { unique: true });

export default mongoose.model("Vote", VoteSchema);
