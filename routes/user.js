const express = require("express");
const router = express.Router();
const uid2 = require("uid2");
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");

const User = require("../models/User");

router.post("/user/signup", async (req, res) => {
  try {
    // identifier
    console.log("Creating new account :");
    console.log(req.body);
    const userExist = await User.findOne({ email: req.body.email });

    // sécuriser
    if (!req.body.username || !req.body.email || !req.body.password) {
      console.log("Missing parameters");
      console.log("--------------------");
      return res.status(400).json({ error: "Please enter a username" });
    }

    if (userExist) {
      console.log("Already existing account :", req.body.email);
      console.log("--------------------");
      return res.status(400).json({ error: "Email already used" });
    }

    // créer
    const newUser = new User({
      email: req.body.email,
      account: {
        username: req.body.username,
        avatar: Object,
      },
      newsletter: req.body.newsletter,
      token: String,
      hash: String,
      salt: String,
    });

    // compléter
    newUser.salt = uid2(16);
    newUser.token = uid2(64);
    newUser.hash = SHA256(req.body.password + newUser.salt).toString(encBase64);

    // sauvegarder et retourner
    newUser.save();
    console.log("\nSuccessful creation :");
    console.log(newUser);
    console.log("--------------------");

    return res.status(201).json({
      _id: newUser._id,
      token: newUser.token,
      account: { username: newUser.account.username },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.post("/user/login", async (req, res) => {
  try {
    // identifier
    console.log("Attempting to connect :", req.body.email);
    const userExist = await User.findOne({ email: req.body.email });

    // sécuriser
    if (!userExist) {
      console.log("Unknown account");
      console.log("--------------------");
      return res.status(401).json({ error: "Unauthorized" });
    }

    const hash = SHA256(req.body.password + userExist.salt).toString(encBase64);

    if (hash !== userExist.hash) {
      console.log("Wrong password");
      console.log("--------------------");
      return res.status(401).json({ merror: "Unauthorized" });
    }

    // retourner
    console.log("Connection successful");
    console.log("--------------------");
    return res.status(201).json({
      _id: userExist._id,
      token: userExist.token,
      account: { username: userExist.account.username },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;
