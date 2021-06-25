const express = require("express");
const AdminAuth = require("../Auth/AdminAuth");
const router = express.Router();
const ProductModal = require("../Modals/ProductModal");
require("dotenv").config();

router.get("/get", async (req, res) => {
  try {
    const productDet = await ProductModal.find()
      .select("name quantity serailNo category address createdAt updatedAt")
      .populate("category");

    res.status(200).json({ status: true, data: productDet });
  } catch (err) {
    res.status(400).json({ status: false, message: err });
  }
});

//GET ONE product BY ID
router.get("/:productId", async (req, res) => {
  console.log(req.params.productId);
  try {
    const productDet = await ProductModal.findById(req.params.productId)
      .select("name quantity serailNo category address createdAt updatedAt")
      .populate("category");
    res.status(200).json({ status: true, data: productDet });
  } catch (err) {
    res.status(400).json({ status: false, message: err });
  }
});

//ADD product
router.post("/add", AdminAuth, async (req, res) => {
  try {
    const { name, serailNo, quantity, category, address } = req.body;
    const product = await ProductModal.findOne({ serailNo });

    if (product)
      return res.json({ status: true, message: "product already exists" });

    const newproduct = new ProductModal({
      name: name,
      serailNo: serailNo,
      quantity: quantity,
      address: address,
      category: category,
    });

    await newproduct.save();
    res
      .status(201)
      .json({ status: true, message: "product added sucessfully" });
  } catch (err) {
    res
      .status(400)
      .json({ status: false, message: "product not added", error: err });
  }
});

module.exports = router;
