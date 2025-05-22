import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    bio: { type: String },
    occupation: { type: String },
    password: { type: String, required: true },
    image: { type: String, default: "" },
}, {
    timestamps: true,
});

export default mongoose.model("User", UserSchema);