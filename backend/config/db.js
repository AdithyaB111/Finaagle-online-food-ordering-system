import mongoose from "mongoose";

export const connectDB = async () => {
    await mongoose.connect('mongodb+srv://adithyabandara:200109102291@cluster0.hrtnbyu.mongodb.net/food-del').then(()=>console.log("DB Connected"));
}