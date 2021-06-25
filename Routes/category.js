const express = require("express");
const router = express.Router();
const categoryModal = require("../Modals/categoryModal");
require("dotenv").config();

router.get("/get", async (req, res) => {
  try {
    const catDet = await categoryModal
      .find()
      .select("name createdAt updatedAt");
    res.status(200).json({ status: true, data: catDet });
  } catch (err) {
    res.status(400).json({ status: false, message: err });
  }
});
//Add category
router.post("/add", async (req, res) => {
  try {
    const { name } = req.body;
    const category = await categoryModal.findOne({ name });

    if (category)
      return res.json({ status: true, message: "category already exists" });

    const newcategory = new categoryModal({
      name: name,
    });

    await newcategory.save();
    res
      .status(201)
      .json({ status: true, message: "category added sucessfully" });
  } catch (err) {
    res
      .status(400)
      .json({ status: false, message: "category not added", error: err });
  }
});

module.exports = router;
