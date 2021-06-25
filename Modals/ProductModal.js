const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productsSchema = Schema(
  {
    name: {
      type: String,
      required: true,
    },
    serailNo: {
      type: String,
      required: true,
      unique: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "categories",
    },
    quantity: {
      type: Number,
      required: true,
    },
    // there is only two address then we can take array but if more data is there then
    // better to make new table for address
    address: [
      {
        location: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("products", productsSchema);
