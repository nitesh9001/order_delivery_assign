const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const categorySchema = Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("categories", categorySchema);
