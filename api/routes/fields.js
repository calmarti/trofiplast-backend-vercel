const express = require("express");
const router = express.Router();
const Item = require("../models/Item");

//rutas que devuelven array de valores posibles de los distintos campos
router.get("/:field", async (req, res, next) => {
  const field = req.params.field;
  console.log(field);
  try {
    const values = await Item.getFieldValues(field);
    // console.log("antes de filter", values);
    const result = values.filter((elem) => (elem !== "N/A" && elem!=="N.A." && elem!=="NA"));

    // console.log("despues de filter", result);
    res.json({ result });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
