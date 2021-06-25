var express = require("express");
var app = express();
var http = require("http");
var path = require("path");
var cors = require("cors");
const connection = require("./DBconfig");
var morgan = require("morgan");
var fs = require("fs");
require("dotenv").config();

var userApis = require("./Routes/userApis");
var adminApis = require("./Routes/adminApis");
var deliveryApis = require("./Routes/deliveryBoyApis");
var categoryApis = require("./Routes/category");
var productApis = require("./Routes/productApis");
var cartApis = require("./Routes/cartAPis");
var orderApis = require("./Routes/orderApis");
var statusApis = require("./Routes/statuisApis");

const port = process.env.PORT || 5000;

const server = http.createServer(app);

connection();

app.use(cors());
app.use(express.json());

var accessLogStream = fs.createWriteStream(path.join(__dirname, "access.log"), {
  flags: "a",
});

app.get("/test", (req, res) => {
  res.send("Order assignment APIs runs successfully !!");
});

// setup the logger
app.use(morgan("combined", { stream: accessLogStream }));

app.use("/customer", userApis);
app.use("/admin", adminApis);
app.use("/deliveryBoy", deliveryApis);
app.use("/category", categoryApis);
app.use("/product", productApis);
app.use("/cart", cartApis);
app.use("/order", orderApis);
app.use("/status", statusApis);

server.listen(port, function () {
  console.log("listen to server .....", port);
});
