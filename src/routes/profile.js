const express = require("express");
const profileRouter = express.Router();
const {
  validateEditProfileData,

  validatePassword,
} = require("../utils/validation");
const bcrypt = require("bcrypt");
const { userAuth } = require("../middlewares/auth");
profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});
profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error("Invalid edit fields!");
    }
    const loggedInUser = req.user;

    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
    await loggedInUser.save();

    res.json({
      message: `${loggedInUser.firstName}  your Profile edited successfully`,
      data: loggedInUser,
    });
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});
profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  try {
    // validation of data
    validatePassword(req);
    const { password } = req.body;
    // encrypt the password
    const passwordHash = await bcrypt.hash(password, 10);
    // console.log(passwordHash);
    const user = req.user;
    user.password = passwordHash;
    await user.save();
    res.send("Password changed successfully");
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});
module.exports = profileRouter;
