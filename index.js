require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cloudinary = require("cloudinary").v2;
const app = express();

mongoose.connect(process.env.MONGODB_URI);
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const userRoutes = require("./routes/user");
const offerRoutes = require("./routes/offer");
const offersRoutes = require("./routes/offers");
const isAuthenticated = require("./middlewares/isAuthenticated");

app.use(express.json());
app.use(cors());
app.use(userRoutes);
app.use(offerRoutes);
app.use(offersRoutes);

app.get("/", isAuthenticated, (req, res) => {
  return res.json({ message: "Welcome to Vinted" });
});

app.all("*", (req, res) => {
  return res.status(404).json("404 : Page not found");
});

app.listen(process.env.PORT, () => {
  console.log("Server Vinted : started");
});
