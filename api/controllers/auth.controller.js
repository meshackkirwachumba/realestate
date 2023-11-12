import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import Jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;

  const hashedPassword = await bcryptjs.hash(password, 10);

  const newUser = new User({ username, email, password: hashedPassword });

  try {
    await newUser.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = await req.body;

  const validUser = await User.findOne({ email });

  if (!validUser) {
    return next(errorHandler(404, "User not found"));
  }

  const isMatch = await bcryptjs.compare(password, validUser.password);

  if (!isMatch) {
    return next(errorHandler(401, "Invalid credentials"));
  }

  //create a login token
  const token = Jwt.sign({ id: validUser._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  //remove the password from the response
  const { password: removedPassword, ...validUserWithoutPassword } =
    validUser._doc;

  //save the token in a cookie
  res
    .cookie("access_token", token, {
      httpOnly: true,
      expiresIn: new Date(Date.now() + 1000 * 60 * 60 * 24),
    })
    .status(200)
    .json(validUserWithoutPassword);
};
