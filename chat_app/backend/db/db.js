import mongoose from "mongoose";
import dotenv from "dotenv";

export const connectDB = async () => {
    await mongoose.connect("mongodb+srv://mahikesiyal:mahi1234@cluster0.uftuxtw.mongodb.net/chat_app")
    .then(() => {
        console.log("Connected to DB");
    })
    .catch((err) => {
        console.log("Error in connecting to DB");
        process.exit(1);
    })
}