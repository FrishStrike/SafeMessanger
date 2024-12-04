const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  nickname: { type: String, required: true },
  password: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);

export default User;
