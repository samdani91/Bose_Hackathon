import express from "express";
import cors from "cors";
import connectDb from "./src/config/dbConfig.js";
import dotenv from "dotenv";
import authRouter from "./src/routes/authRoute.js"
import questionRouter from "./src/routes/questionRoute.js";
dotenv.config();
const app = express();
const port = process.env.PORT;


connectDb();

app.use(express.json());

const corsOptions = {
    origin: '*',
    credentials: true,
};

app.use(cors(corsOptions));

app.get("/", (req, res) => {
    res.send("Backend is running!");
});

app.use("/api/auth", authRouter);
app.use("/api/question", questionRouter);

app.listen(port, () => {
    console.log(`Backend is running on port ${port}`);
});