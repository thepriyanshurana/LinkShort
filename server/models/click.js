import mongoose from "mongoose";

const clickSchema = new mongoose.Schema({
  url: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Url",
    required: true
  },

  browser: {
    type: String,
    default: "Unknown"
  },

  device: {
    type: String,
    default: "Unknown"
  },

  country: {
    type: String,
    default: "Unknown"
  },

  clickedAt: {
    type: Date,
    default: Date.now
  }

});

const Click = mongoose.model("Click", clickSchema);

export default Click;
