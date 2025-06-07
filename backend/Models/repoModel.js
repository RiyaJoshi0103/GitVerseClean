const mongoose = require("mongoose");
const { Schema } = mongoose;

const fileSchema = new Schema({
  filename: { type: String, required: true },
  content: { type: String, required: true },
});

const RepoSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
  },
  content: [fileSchema], // ✅ store multiple files with names & content
  visibility: {
    // ✅ fixed typo from "visibilty"
    type: Boolean,
    default: false,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  issues: [
    {
      type: Schema.Types.ObjectId,
      ref: "Issue",
    },
  ],
});

const Repository = mongoose.model("Repository", RepoSchema);
module.exports = Repository;
