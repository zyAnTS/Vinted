const express = require("express");
const router = express.Router();
const Offer = require("../models/Offer");

router.get("/offers", async (req, res) => {
  try {
    console.log("Nouvelle requête :", req.query);

    const { title, priceMin, priceMax, sort, page } = req.query;

    let filter = {};
    let sortFilter = {};
    let skip = 0;
    let limitFilter = 3;

    // Si title
    if (title) {
      filter.product_name += new RegExp(title, "i");
    }

    // Si priceMin
    if (priceMin) {
      filter.product_price = { $gte: Number(priceMin) };
    }

    // Si priceMax
    if (priceMax) {
      if (filter.product_price) {
        filter.product_price.$lte = Number(priceMax);
      } else {
        filter.product_price = { $lte: Number(priceMax) };
      }
    }

    // Si tri par ordre croissant/décroissant
    if (sort) {
      if (sort === "price-asc") {
        sortFilter = "asc";
      } else if (sort === "price-desc") {
        sortFilter = "desc";
      }
    }

    // Si page
    if (page) {
      skip = (Number(page) - 1) * 3;
    }

    const offersLength = await Offer.countDocuments(filter);

    const offers = await Offer.find(filter)
      .sort(sortFilter)
      .skip(skip)
      .limit(limitFilter)
      .select("product_name product_price owner")
      .populate("owner", "account _id");

    res.status(200).json({ count: offersLength, offers: offers });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.get("/offers/:id", async (req, res) => {
  try {
    console.log("New search :", req.params.id);

    const offer = await Offer.findById(req.params.id).populate(
      "owner",
      "account _id"
    );

    if (!offer) {
      console.log("Offer unknow");
      console.log("--------------------");
      return res.status(400).json({ error: "Non-existent offer" });
    }

    console.log("Offer transmitted :", offer.product_name);
    console.log("--------------------");
    return res.status(200).json(offer);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;
