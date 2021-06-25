const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const deliveryboySchema = Schema(
  {
    phoneNo: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("deliveryboys", deliveryboySchema);
