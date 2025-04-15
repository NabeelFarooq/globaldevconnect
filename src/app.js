const express = require("express");
const connectDB = require("./config/database");
const app = express();

const User = require("./models/user");

app.post("/signup", async (req, res) => {
  // creating a new instance of the User model
  const user = new User({
    firstName: "suliman",
    lastName: "Farooq",
    emailId: "sulimanfarooq5400@gmail.com",
    password: "cave@99",
  });
  try {
    await user.save();
    res.send("user added successfully!!");
  } catch (err) {
    res.status(400).send("Error saving the user:" + err.message);
  }
});

connectDB()
  .then(() => {
    console.log("Database connection is successful");

    app.listen(7777, () => {
      console.log("Server is successfully listening on port 7777............");
    });
  })
  .catch((err) => {
    console.error("Database cannot be connected");
  });
