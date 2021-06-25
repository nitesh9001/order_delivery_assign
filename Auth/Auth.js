const jwt = require("jsonwebtoken");
const UserModal = require("../Modals/UserModal");
const AdminModal = require("../Modals/AdminModal");
const DeliveryBoy = require("../Modals/DeliveryBoy");

module.exports = async (req, res, next) => {
  const bearerHeader = req.header("authorization");
  if (!bearerHeader)
    return res
      .status(401)
      .json({ status: false, message: "No token, authorization denied" });
  else {
    try {
      const decoded = jwt.verify(bearerHeader, process.env.JWT);
      userPhone = decoded.user.phoneNo;
      req.user = decoded;

      const userData = await UserModal.findOne({ phoneNo: userPhone });

      if (userData) next();
      else {
        const adminData = await AdminModal.findOne({ phoneNo: userPhone });
        if (adminData) next();
        else {
          const deliveryData = await DeliveryBoy.findOne({
            phoneNo: userPhone,
          });
          if (deliveryData) next();
        }
      }
    } catch (e) {
      res
        .status(401)
        .json({ status: false, message: "Token is not valid", err: e });
    }
  }
};
