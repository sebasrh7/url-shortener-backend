import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const generateJwt = (userData) => {
  let token = null;
  token = jwt.sign(userData, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  return token;
};

export default generateJwt;
