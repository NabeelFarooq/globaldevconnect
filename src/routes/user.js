const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const User = require("../models/user");
const ConnectionRequest = require("../models/connectionRequest");
const user = require("../models/user");

const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills";

// get all the pending connection requests for the logged-in user
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const requests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", USER_SAFE_DATA);
    res.json({ requests });
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    // Find all accepted connection requests involving the user
    const connections = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
      status: "accepted",
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);

    const data = connections.map((row) => {
      if (row.fromUserId._id.equals(loggedInUser._id)) {
        return row.toUserId;
      } else {
        return row.fromUserId;
      }
    });
    res.json({
      data,
    });
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});
module.exports = userRouter;
