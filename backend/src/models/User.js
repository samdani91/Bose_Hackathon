import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    bio: { type: String },
    occupation: { type: String },
    institution: { type: String },
    classs: { type: String },
    password: { type: String, required: true },
    image: { type: String, default: "" },
    streak: { type: Number, default: 0 },
}, {
    timestamps: true,
});

export default mongoose.model("User", UserSchema);