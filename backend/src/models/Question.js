import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema(
    {
        user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        title: { type: String },
        description: { type: String },
        images: [{ type: String }],
        tags: [{ type: String }],
        upvotes: { type: Number, default: 0 },
        downvotes: { type: Number, default: 0 },
        viewsCount: { type: Number, default: 0 },
    },
    { timestamps: true }
);

export default mongoose.model("Question", QuestionSchema);