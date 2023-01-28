"use strict";

const express = require("express");
const router = express.Router();
const Item = require("../models/Item");

router.get("/", async (req, res, next) => {
  try {
    console.log("req.query", req.query);

    const filters = {};
    const sort = req.query.sort || "_id";
    const skip = parseInt(req.query.start) || 0;
    const limit = parseInt(req.query.limit) || 10000; //reemplazar por el count de registros actualizado

    if (req.query.group) filters.group = req.query.group;
    if (req.query.order) filters.order = req.query.order;
    if (req.query.family) filters.family = req.query.family;
    if (req.query.genus) filters.genus = req.query.genus;
    if (req.query.species) filters.species = req.query.species;
    if (req.query.area) filters.area = req.query.area;
    if (req.query.origin) filters.origin = req.query.origin;
    if (req.query.country) filters.country = req.query.country;

    const maxDate = parseInt(req.query.maxDate);
    const minDate = parseInt(req.query.minDate);
    console.log("minDate", minDate);
    console.log("maxDate", maxDate);

    //Si hay min y max ==> no funciona porque el filtro es conjunto unión de from y to y no intersección
    if (req.query.minDate && req.query.maxDate) {
      let dateRange = [];
      for (let i = minDate - 1; i <= maxDate + 1; i++) {
        dateRange.push(i);
      }
      console.log(dateRange);

      filters.from = { $in: dateRange };
      filters.to = { $in: dateRange };
    }

    //Si solo hay min

    //Si solo hay max
    console.log("filters", filters);
    //TODO: OJO: agregar campos de fecha al if statement de abajo
    const result = await Item.customFind(filters, sort, skip, limit);
    //capo el endpoint: cuando el submit viene con todos los campos vacíos (es decir, cuando no he seleccionado ningún filtro) ni siquiera devuelvo un array vacío sino null
    //Nota: por defecto si todos los campos vienen vacíos devolvería un array con todos los items de la bd
    if (
      !req.query.group &&
      !req.query.order &&
      !req.query.family &&
      !req.query.genus &&
      !req.query.species &&
      !req.query.area &&
      !req.query.country &&
      !req.query.origin
    ) {
      res.json({ result: null });
    } else {
      res.json({ result: result });
    }
  } catch (error) {
    next(error);
  }
});

//TODO: probar con postman
router.get("/:id", async (req, res, next) => {
  try {
    const _id = req.params.id;
    const item = await Item.find({ _id: _id });
    res.json({ result: item });
  } catch (error) {
    next(error);
  }
});

//TODO: Probar con postman
router.post("/", async (req, res, next) => {
  try {
    const item = new Item({
      group: req.body.group,
      order: req.body.order,
      family: req.body.family,
      genus: req.body.genus,
      species: req.body.species,
      location: req.body.location,
      country: req.body.country,
      origin: req.body.origin,
      date: req.body.date,
      reference: req.body.date,
    });
    const savedItem = await item.save();
    res.status(201).json({ result: savedItem });
  } catch (error) {
    next(error);
  }
});

//rutas que devuelven array de valores posibles de los distintos campos
router.get("/fields", async function (req, res, next) {
  const field = null;
  console.log(field);
  try {
    const values = await Item.getFieldValues(field);
    res.json({ result: values });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
