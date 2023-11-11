import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
dotenv.config();

const app = express();

//allow client to send input data in json format
app.use(express.json());

//connection to mongodb
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.log(error);
  });

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

//Routes
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
