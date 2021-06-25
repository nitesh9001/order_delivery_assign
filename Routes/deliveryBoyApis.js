const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
var dotenv = require("dotenv");
const deliveryModal = require("../Modals/DeliveryBoy");
const AdminAuth = require("../Auth/AdminAuth");
require("dotenv").config();

router.get("/get", AdminAuth, async (req, res) => {
  try {
    const deliveryDet = await deliveryModal
      .find()
      .select("name phoneNo createdAt updatedAt");
    res.status(200).json({ status: true, data: deliveryDet });
  } catch (err) {
    res.status(400).json({ status: false, message: err });
  }
});

//GET ONE delivery BY ID
router.get("/:deliveryId", async (req, res) => {
  console.log(req.params.deliveryId);
  try {
    const deliveryDet = await deliveryModal
      .findById(req.params.deliveryId)
      .select("name phoneNo createdAt updatedAt");
    res.status(200).json({ status: true, data: deliveryDet });
  } catch (err) {
    res.status(400).json({ status: false, message: err });
  }
});

// delivery LOGIN
router.post("/login", async (req, res) => {
  const { phoneNo, password } = req.body;
  try {
    let delivery = await deliveryModal.findOne({ phoneNo });
    console.log(delivery);

    if (!delivery)
      return res.json({ errors: [{ message: "Invalid Credentials" }] });

    const isMatch = await bcrypt.compare(password, delivery.password);

    if (!isMatch)
      return res.json({ errors: [{ message: "Invalid Credentials" }] });

    const payload = {
      user: {
        phoneNo: phoneNo,
        id: delivery._id,
        userType: "delivery",
      },
    };
    jwt.sign(payload, process.env.JWT, function (err, token) {
      console.log(err, token);
      if (token) {
        res.status(200).json({
          status: true,
          data: {
            _id: delivery._id,
            name: delivery.name,
            phoneNo: delivery.phoneNo,
            createdAt: delivery.createdAt,
            updatedAt: delivery.updatedAt,
            token: token,
          },
        });
        console.log(token);
      } else {
        res
          .status(400)
          .json({ status: false, message: "Token not generated " });
      }
    });
  } catch (err) {
    res.status(400).json({ status: false, message: "Login failed" });
  }
});

//ADD delivery
router.post("/add", async (req, res) => {
  try {
    const { name, password, phoneNo } = req.body;
    const delivery = await deliveryModal.findOne({ phoneNo });

    if (delivery)
      return res.json({ status: true, message: "delivery already exists" });

    const salt = await bcrypt.genSalt(10);
    const passwordHased = await bcrypt.hash(password, salt);

    const newdelivery = new deliveryModal({
      name: name,
      phoneNo: phoneNo,
      password: passwordHased,
    });

    await newdelivery.save();
    res
      .status(201)
      .json({ status: true, message: "delivery added sucessfully" });
  } catch (err) {
    res
      .status(400)
      .json({ status: false, message: "delivery not added", error: err });
  }
});

module.exports = router;
