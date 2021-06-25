const express = require("express");
const AdminAuth = require("../Auth/AdminAuth");
const Auth = require("../Auth/Auth");
const CustomerAuth = require("../Auth/CustomerAuth");
const cartModal = require("../Modals/cartModal");
const DeliveryBoy = require("../Modals/DeliveryBoy");
const OrderModal = require("../Modals/OrderModal");
const StatusModal = require("../Modals/StatusModal");
const router = express.Router();
const UserModal = require("../Modals/UserModal");
require("dotenv").config();

//get order liost according usertype
router.get("/get", Auth, async (req, res) => {
  try {
    console.log(req.user.user.userType);
    var returnData;
    if (req.user.user.userType === "admin") {
      var filter = {};
      if (req.body.status) {
        var filter = { orderStage: req.body.status };
      }
      returnData = await OrderModal.find(filter)
        .select(
          "products customer pickupLocations delivery customer orderStage createdAt updatedAt"
        )
        .populate("customer")
        .populate("orderStage", "name")
        .populate({
          path: "products",
          model: "products",
          populate: {
            path: "products",
            model: "products",
          },
        });
      console.log(returnData);
      res.status(200).json({ status: true, data: returnData });
    } else if (req.user.user.userType === "user") {
      returnData = await OrderModal.find({ customer: req.user.user.id })
        .select(
          "products  pickupLocations delivery customer orderStage createdAt updatedAt"
        )
        .populate("products")
        .populate("orderStage", "name");
      console.log(returnData);
      res.status(200).json({ status: true, data: returnData });
    } else if (req.user.user.userType === "delivery") {
      returnData = await OrderModal.find({ delivery: req.user.user.id })
        .select(
          "products pickupLocations customer orderStage createdAt updatedAt"
        )
        .populate("products")
        .populate("orderStage", "name");
      console.log(returnData);
      res.status(200).json({ status: true, data: returnData });
    } else {
      res.status(200).json({ status: true, message: "No access" });
    }
  } catch (err) {
    res.status(400).json({ status: false, message: err });
  }
});

//assign the order to delivery boy
router.patch("/assign", AdminAuth, async (req, res) => {
  try {
    const { orderId, deliveryBoyId } = req.body;
    const returnData = await OrderModal.findOne({ _id: orderId });
    const deliveryBoy = await DeliveryBoy.findOne({ _id: deliveryBoyId });

    if (!returnData)
      return res.status(404).json({
        status: true,
        message: "No data found",
      });
    if (!deliveryBoy)
      return res.status(404).json({
        status: true,
        message: "No delivery boy found",
      });
    returnData.delivery = deliveryBoyId;
    await returnData.save();
    res.status(201).json({ status: true, message: "Delivery boy assigned" });
  } catch (err) {
    res.status(400).json({ status: false, message: err });
  }
});

//ADD product
router.post("/add", CustomerAuth, async (req, res) => {
  try {
    const { cartId } = req.body;
    const ordestatus = await StatusModal.find();

    const cartdet = await cartModal
      .find({ _id: cartId })
      .select("products")
      .populate({
        path: "products",
        model: "products",
        populate: {
          path: "products",
          model: "products",
          select: "address",
        },
      });
    const data = cartdet[0].products;
    var pickupLocation = [];
    data.forEach((element) => {
      pickupLocation.push(element.products.address[0]);
    });
    if (!cartdet)
      return res.status(200).json({
        status: true,
        message: "your cart is empty",
      });
    const newOrder = new OrderModal({
      products: cartdet[0].products,
      pickupLocations: pickupLocation,
      orderStage: ordestatus[0]._id,
      customer: req.user.user.id,
    });

    await newOrder.save();

    res.status(201).json({
      status: true,
      message: "order created sucessfully",
    });
  } catch (err) {
    res.status(400).json({
      status: false,
      message: "order not placed",
      error: err,
    });
  }
});

//update orderstage by admin
router.patch("/status", Auth, async (req, res) => {
  try {
    const { orderId, statusId } = req.body;
    if (req.user.user.userType === "delivery") {
      const returnData = await OrderModal.findOneAndUpdate(
        {
          _id: orderId,
          delivery: req.user.user.id,
        },
        {
          $set: {
            orderStage: statusId,
          },
        },
        { upsert: true }
      );

      if (!returnData)
        return res.status(404).json({
          status: true,
          message: "No such order is assigned",
        });
      res
        .status(200)
        .json({ status: true, message: "Updated the order stage" });
    } else {
      res
        .status(200)
        .json({ status: true, message: "Only delivery can updated status" });
    }
  } catch (err) {
    res.status(400).json({ status: false, message: err });
  }
});

module.exports = router;
