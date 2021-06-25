const express = require("express");
const AdminAuth = require("../Auth/AdminAuth");
const router = express.Router();
const StatusModal = require("../Modals/StatusModal");
require("dotenv").config();

router.get("/get", async (req, res) => {
  try {
    const catDet = await StatusModal.find().select("name createdAt updatedAt");
    res.status(200).json({ status: true, data: catDet });
  } catch (err) {
    res.status(400).json({ status: false, message: err });
  }
});

//Add status
router.post("/add", AdminAuth, async (req, res) => {
  try {
    const { name } = req.body;
    const Status = await StatusModal.findOne({ name });

    if (Status)
      return res.json({ status: true, message: "Status already exists" });

    const newStatus = new StatusModal({
      name: name,
    });

    await newStatus.save();
    res.status(201).json({ status: true, message: "Status added sucessfully" });
  } catch (err) {
    res
      .status(400)
      .json({ status: false, message: "Status not added", error: err });
  }
});

module.exports = router;
