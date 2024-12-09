const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");

require("dotenv").config();

const cors = require("cors");

const app = express();

const PORT = process.env.EXPRESS_SERVER_PORT;
const mongoUri = process.env.MONGOURI;

app.use(bodyParser.json());
app.use(cors());

mongoose
  .connect(mongoUri)
  .then(() => {
    console.log("Connected MongoDB");
  })
  .catch((error) => {
    console.log("Mongo connect is fail:", error);
  });

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  nickname: { type: String, required: true },
  password: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);

// CRUD
app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/users/login", async (req, res) => {
  try {
    const user = await User.findOne({ nickname: req.body.nickname });
    console.log("Server found user for login", user);

    if (!user.password)
      return res.status(404).json({ error: "User is not defined!" });
    const passwordMatch = await bcrypt.compare(
      req.body.password,
      user.password
    );
    console.log("Password Match ", passwordMatch);

    if (!passwordMatch)
      return res.status(401).json({ error: "The password is not corrected!" });

    res.status(201).json(user);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
});

app.post("/users/registrations", async (req, res) => {
  try {
    const existingUser = await User.findOne({ nickname: req.body.nickname });
    console.log("Exist user", existingUser);
    if (existingUser)
      return res.status(404).json({ message: "User is already exist!" });
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = new User({ ...req.body, password: hashedPassword });
    console.log("Express server new user ", newUser);

    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.put("/users/:id", async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.delete("/users/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(PORT, () => {
  console.log("express server is running on:", PORT);
});
