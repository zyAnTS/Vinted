const securiseOffer = async (req, res, next) => {
  console.log(req.body);
  // Vérifier les champs
  if (!req.body.title) {
    console.log("Missing title");
    console.log("--------------------");
    return res.status(400).json({ error: "Title must be completed " });
  }
  if (!req.body.description) {
    console.log("Missing description");
    console.log("--------------------");
    return res.status(400).json({ error: "Description must be completed " });
  }
  if (!req.body.price) {
    console.log("Missing price");
    console.log("--------------------");
    return res.status(400).json({ error: "Price must be completed " });
  }
  if (!req.body.city) {
    console.log("Missing city");
    console.log("--------------------");
    return res.status(400).json({ error: "City must be completed " });
  }
  if (!req.body.size) {
    console.log("Missing size");
    console.log("--------------------");
    return res.status(400).json({ error: "Size must be completed " });
  }

  // Vérifier longueur des champs et prix
  if (req.body.title.length > 50) {
    console.log("Title too long");
    console.log("--------------------");
    return res.status(400).json({ error: "Title too long. 50 caracters max " });
  }
  if (req.body.description.length > 500) {
    console.log("Description too long");
    console.log("--------------------");
    return res
      .status(400)
      .json({ error: "Description too long. 500 caracters max " });
  }
  if (req.body.price > 10000) {
    console.log("Price too high");
    console.log("--------------------");
    return res.status(400).json({ error: "Price too high. 10000€ max " });
  }

  next();
};

module.exports = securiseOffer;
