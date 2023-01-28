const mongoose = require("mongoose");

//TODO: estudiar tema validaciones automáticas del Modelo, validaciones con mongoose y validaciones con express-validator
//Setters allow you to transform the data before it gets to the raw mongodb document or query.
//setter: antes de ser persistidos los campos 'Date' deben ser pasar de string de tipo "DD/MM/YYYY" a un objeto Date así: new Date(YYYY, MM)

// function changeDateFormat(value) {
//   if (value instanceof Date) {
//     return;
//   } else {
//     const splittedValue = value.split("/", 3);
//     if (splittedValue.length !== 1) {
//       return new Date(splittedValue[2], splittedValue[1]);
//     } else {
//       return new Date(splittedValue[0]);
//     }
//   }
// }

const itemSchema = mongoose.Schema({
  group: { type: String, index: true,
  },
  order: { type: String, index: true },
  family: { type: String, index: true },
  genus: { type: String, index: true },
  species: { type: String, index: true },
  area: { type: String, index: true },
  origin: { type: String, index: true },
  country: { type: String, index: true },
  from: { type: Number },
  to: { type: Number },
  // date1: { type: Date, set: changeDateFormat },
  // date2: { type: Date, set: changeDateFormat },
  // date3: { type: Date, set: changeDateFormat },

  //origin: {type: String, required: true},  //seawater, freshwater, land, experiment
  sampling_info: { type: String },
  summary: { type: String },
  reference: { type: String },
  href: { type: String }, //type preeliminar, tal vez será un custom type
  image: { type: String },
  notas: { type: String },
});

itemSchema.statics.customFind = async function (filters, sort, skip, limit) {
  const query = Item.find(filters);
  query.sort(sort);
  query.skip(skip);
  query.limit(limit);
  let result = {};
  //atributos necesarios para query por rangos de fechas

  result = await query.exec();

  return result;
};

itemSchema.statics.getFieldValues = async function (field) {
  try {
    const values = await Item.find().distinct(`${field}`);
    return values;
  } catch (err) {
    next(err);
  }
};

const Item = mongoose.model("Item", itemSchema);

//opcional: no hace falta (¿porqué no?)
module.exports = Item;
