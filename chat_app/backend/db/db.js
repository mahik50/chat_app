import mongoose from "mongoose";
import dotenv from "dotenv";

export const connectDB = async () => {
    await mongoose.connect(`${process.env.MONGODB_URL}`)
    .then(() => {
        console.log("Connected to DB");
    })
    .catch((err) => {
        console.log("Error in connecting to DB");
        process.exit(1);
    })
}