const express = require("express");
const router = express.Router();
const fileUpload = require("express-fileupload");
const cloudinary = require("cloudinary").v2;
const Offer = require("../models/Offer");
const convertToBase64 = require("../utils/convertToBase64");
const isAuthenticated = require("../middlewares/isAuthenticated");
const securiseOffer = require("../middlewares/securiseOffer");

router.post(
  "/offer/publish",
  isAuthenticated,
  fileUpload(),
  securiseOffer,
  async (req, res) => {
    try {
      // identifier
      console.log("Attempt to create an offer :");
      console.log("User ID :", req.user.email);
      console.log(req.body);
      console.log(req.user);
      console.log(
        "Picture : ",
        req.files.picture.name,
        req.files.picture.mimetype
      );

      // picture pour cloudinary
      const cloudinaryResponse = await cloudinary.uploader.upload(
        convertToBase64(req.files.picture)
      );

      // créer
      const { title, description, price, condition, city, brand, size, color } =
        req.body;

      const arrayDetails = [
        { MARQUE: brand },
        { TAILLE: size },
        { ETAT: condition },
        { COULEUR: color },
        { EMPLACEMENT: city },
      ];

      const newOffer = new Offer({
        product_name: title,
        product_description: description,
        product_price: price,
        product_details: arrayDetails,
        product_image: cloudinaryResponse,
        owner: req.user,
      });

      // sauvegarder et rétourner
      await newOffer.populate("owner", "account _id");
      await newOffer.save();

      console.log("Offer created");
      console.log("--------------------");
      return res.status(201).json(newOffer);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
);

router.put(
  "/offer/:id",
  isAuthenticated,
  fileUpload(),
  securiseOffer,
  async (req, res) => {
    try {
      // identifier
      console.log("offer currently being modified :", req.params.id);

      const offerToModify = await Offer.findById(req.params.id);
      console.log("Offer : ", offerToModify.product_name);

      // modifier
      cloudinaryResponse = await cloudinary.uploader.upload(
        convertToBase64(req.files.picture)
      );

      const { title, description, price, condition, city, brand, size, color } =
        req.body;

      const newArrayDetails = [
        { MARQUE: brand },
        { TAILLE: size },
        { ETAT: condition },
        { COULEUR: color },
        { EMPLACEMENT: city },
      ];
      offerToModify.product_name = title;
      offerToModify.product_description = description;
      offerToModify.product_price = price;
      offerToModify.product_details = newArrayDetails;
      offerToModify.product_image = cloudinaryResponse;

      // sauvegarder et retourner
      await offerToModify.populate("owner", "account _id");
      await offerToModify.save();

      console.log(offerToModify);
      console.log("Offer updated");
      console.log("--------------------");
      return res.status(200).json(offerToModify);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
);

router.delete("/offer/:id", async (req, res) => {
  try {
    // identifier
    console.log("deletion of the offer :", req.params.id);
    const offerToDelete = await Offer.findById(req.params.id);
    console.log("Offer : ", offerToDelete.product_name);

    // supprimer et retourner
    await offerToDelete.deleteOne();
    console.log("Offer deleted");
    console.log("----------");
    return res.status(200).json({ message: "offer deleted" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;
