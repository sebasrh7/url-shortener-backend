import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const generateJwt = (payload) => {
  let token = null;
  token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  return token;
};

export default generateJwt;
