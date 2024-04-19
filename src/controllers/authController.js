import dotenv from "dotenv";
import User from "../models/User.js";
import Url from "../models/url.js";
import generateJwt from "../utils/generateJwt.js";
dotenv.config();

export const callback = (req, res) => {
  const { _id, displayName, nickname, emails, picture, provider } = req.user;
  const userData = {
    _id,
    displayName,
    nickname,
    emails,
    picture,
    provider,
  };
  const jwt = generateJwt(userData);

  const loginIfo = {
    jwt,
    user: JSON.stringify(userData),
  };

  res.redirect(
    `${process.env.CLIENT_URL}/?loginInfo=${JSON.stringify(loginIfo)}`
  );
};

export const logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: "Failed to log out." });
    }
    res.redirect(`${process.env.CLIENT_URL}`);
  });
};

export const loginSuccess = (req, res) => {
  if (req.user) {
    res
      .status(200)
      .json({ message: "User has successfully logged in.", user: req.user });
  } else {
    res.status(401).json({ message: "Not Authorized" });
  }
};

export const loginFailure = (req, res) => {
  res.redirect(process.env.CLIENT_URL);
};

export const deleteAccount = async (req, res) => {
  try {
    await Url.deleteMany({ user: req.user._id }); // Delete all urls created by user
    await User.findByIdAndDelete(req.user._id); // Delete user account
    req.logout();
    res.status(200).json({ message: "User account has been deleted." });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete user account." });
  }
};
