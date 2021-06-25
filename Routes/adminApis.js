const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
var dotenv = require("dotenv");
const AdminModal = require("../Modals/AdminModal");
require("dotenv").config();

router.get("/get", async (req, res) => {
  try {
    const adminDet = await AdminModal.find().select(
      "name phoneNo createdAt updatedAt"
    );
    res.status(200).json({ status: true, data: adminDet });
  } catch (err) {
    res.status(400).json({ status: false, message: err });
  }
});

//GET ONE admin BY ID
router.get("/:adminId", async (req, res) => {
  console.log(req.params.adminId);
  try {
    const adminDet = await AdminModal.findById(req.params.adminId).select(
      "name phoneNo  createdAt updatedAt"
    );
    res.status(200).json({ status: true, data: adminDet });
  } catch (err) {
    res.status(400).json({ status: false, message: err });
  }
});

// admin LOGIN
router.post("/login", async (req, res) => {
  const { phoneNo, password } = req.body;
  try {
    let admin = await AdminModal.findOne({ phoneNo });
    console.log(admin);

    if (!admin)
      return res.json({ errors: [{ message: "Invalid Credentials" }] });

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch)
      return res.json({ errors: [{ message: "Invalid Credentials" }] });

    const payload = {
      user: {
        phoneNo: phoneNo,
        id: admin._id,
        userType: "admin",
      },
    };
    jwt.sign(payload, process.env.JWT, function (err, token) {
      console.log(err, token);
      if (token) {
        res.status(200).json({
          status: true,
          data: {
            _id: admin._id,
            name: admin.name,
            phoneNo: admin.phoneNo,
            createdAt: admin.createdAt,
            updatedAt: admin.updatedAt,
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

//ADD admin
router.post("/add", async (req, res) => {
  try {
    const { name, password, phoneNo } = req.body;
    const admin = await AdminModal.findOne({ phoneNo });

    if (admin)
      return res.json({ status: true, message: "admin already exists" });

    const salt = await bcrypt.genSalt(10);
    const passwordHased = await bcrypt.hash(password, salt);

    const newadmin = new AdminModal({
      name: name,
      phoneNo: phoneNo,
      password: passwordHased,
    });

    await newadmin.save();
    res.status(201).json({ status: true, message: "admin added sucessfully" });
  } catch (err) {
    res
      .status(400)
      .json({ status: false, message: "admin not added", error: err });
  }
});

module.exports = router;
