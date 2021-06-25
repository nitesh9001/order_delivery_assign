const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = Schema(
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
    },
    orderStage: {
      type: Schema.Types.ObjectId,
      ref: "status",
    },
    delivery: {
      type: Schema.Types.ObjectId,
      ref: "deliveryboys",
    },
    pickupLocations: [
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

module.exports = mongoose.model("orders", orderSchema);
