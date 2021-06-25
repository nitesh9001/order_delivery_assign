const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cartSchema = Schema(
  {
    products: [
      {
        products: {
          type: Schema.Types.ObjectId,
          ref: "products",
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
    customer: {
      type: Schema.Types.ObjectId,
      ref: "users",
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("carts", cartSchema);
