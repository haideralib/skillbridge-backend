import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

export const DatabaseConfig = () => {
    mongoose.connect(process.env.MONGO_URI as string)
    .then(()=>console.log("Database connected"))
    .catch((err)=>console.log(err))
}