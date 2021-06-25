const express = require("express");
const CustomerAuth = require("../Auth/CustomerAuth");
const cartModal = require("../Modals/cartModal");
const router = express.Router();
const UserModal = require("../Modals/UserModal");
require("dotenv").config();

router.get("/get", CustomerAuth, async (req, res) => {
  try {
    const cartDet = await cartModal
      .find({ customer: req.user.user.id })
      .select("customer products createdAt updatedAt")
      .populate("products")
      .populate("customer");

    res.status(200).json({ status: true, data: cartDet });
  } catch (err) {
    res.status(400).json({ status: false, message: err });
  }
});

//ADD product
router.post("/add", CustomerAuth, async (req, res) => {
  try {
    console.log(req.user.user.id);
    const { products } = req.body;

    const newcartProduct = new cartModal({
      products: products,
      customer: req.user.user.id,
    });

    await newcartProduct.save();
    res
      .status(201)
      .json({ status: true, message: "product added to cart sucessfully" });
  } catch (err) {
    res.status(400).json({
      status: false,
      message: "product not added to cart",
      error: err,
    });
  }
});

module.exports = router;
