import Jwt from "jsonwebtoken";
import { errorHandler } from "./error.js";

export const verifyToken = (req, res, next) => {
  //get token from cookie sent as a request
  const token = req.cookies.access_token;

  if (!token) {
    return next(errorHandler(401, "User not logged in"));
  }

  Jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return next(errorHandler(403, "Token is not valid"));
    req.user = user;
    next(); //Continue the request to access  the resource
  });
};
