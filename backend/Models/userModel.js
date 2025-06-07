const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  followedUsers: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: [],
    },
  ],
  starRepository: [
    {
      type: Schema.Types.ObjectId,
      ref: "Repository",
      default: [],
    },
  ],
});

const User = mongoose.model("User", UserSchema);
module.exports = User; // ✅ Correct export
