const express = require("express");
const router = express.Router();
const Item = require("../models/Item");

//ruta que devuelve array de valores posibles de los distintos campos
/* router.get("/:field", async (req, res, next) => {
  const field = req.params.field;
  try {
    const values = await Item.getFieldValues(field);
    const result = values.filter((elem) => (elem !== "N/A" && elem!=="N.A." && elem!=="NA"));
    res.json({ result });
  } catch (err) {
    next(err);
  }
}); */

router.get("/", async (req,res, next)=>{
  const results = await Item.getFieldValues();
  try{
    res.json({results});
  }
  catch(err){
    next(err);
  }
})
module.exports = router;
