const jwt = require("jsonwebtoken");
const Customer = require("../Modals/UserModal");

module.exports = async (req, res, next) => {
  const bearerHeader = req.header("authorization");

  if (!bearerHeader)
    return res
      .status(401)
      .json({ status: false, message: "No token, authorization denied" });
  else {
    try {
      console.log(bearerHeader);
      const decoded = jwt.verify(bearerHeader, process.env.JWT);
      userPhone = decoded.user.phoneNo;
      req.user = decoded;

      const userData = await Customer.findOne({ phoneNo: userPhone });
      if (userData) {
        next();
      } else {
        res.status(401).json({ status: false, message: "Token is not valid" });
      }
    } catch (err) {
      res
        .status(400)
        .json({ status: false, message: "Token is not valid", error: err });
    }
  }
};
