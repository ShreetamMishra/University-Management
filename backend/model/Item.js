// backend/model/item.js
import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  file: {
    type: String,
    required: [true, "Please provide a file"],
  },
  answerFile: {
    type: String,
  },
  semester: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
});

export default mongoose.model("Item", itemSchema);
