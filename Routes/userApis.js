const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
var dotenv = require("dotenv");
const UserModal = require("../Modals/UserModal");
require("dotenv").config();

router.get("/get", async (req, res) => {
  try {
    const userDet = await UserModal.find().select(
      "name phoneNo address createdAt updatedAt"
    );

    res.status(200).json({ status: true, data: userDet });
  } catch (err) {
    res.status(400).json({ status: false, message: err });
  }
});

//GET ONE USER BY ID
router.get("/:userId", async (req, res) => {
  console.log(req.params.userId);
  try {
    const userDet = await UserModal.findById(req.params.userId).select(
      "name phoneNo address createdAt updatedAt"
    );
    res.status(200).json({ status: true, data: userDet });
  } catch (err) {
    res.status(400).json({ status: false, message: err });
  }
});

// USER LOGIN
router.post("/login", async (req, res) => {
  const { phoneNo, password } = req.body;
  try {
    let user = await UserModal.findOne({ phoneNo });
    console.log(user);

    if (!user)
      return res.json({ errors: [{ message: "Invalid Credentials" }] });

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch)
      return res.json({ errors: [{ message: "Invalid Credentials" }] });

    const payload = {
      user: {
        phoneNo: phoneNo,
        id: user._id,
        userType: "user",
      },
    };
    jwt.sign(payload, process.env.JWT, function (err, token) {
      console.log(err, token);
      if (token) {
        res.status(200).json({
          status: true,
          data: {
            _id: user._id,
            name: user.name,
            phoneNo: user.phoneNo,
            address: user.address,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
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

//ADD USER
router.post("/add", async (req, res) => {
  try {
    const { name, password, phoneNo, address } = req.body;
    const user = await UserModal.findOne({ phoneNo });

    if (user) return res.json({ status: true, message: "user already exists" });

    const salt = await bcrypt.genSalt(10);
    const passwordHased = await bcrypt.hash(password, salt);

    const newuser = new UserModal({
      name: name,
      phoneNo: phoneNo,
      password: passwordHased,
      address: address,
    });

    await newuser.save();
    res.status(201).json({ status: true, message: "user added sucessfully" });
  } catch (err) {
    res
      .status(400)
      .json({ status: false, message: "user not added", error: err });
  }
});

module.exports = router;
