const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

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

app.post("/users", async (req, res) => {
  try {
    const newUser = new User(req.body);
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
