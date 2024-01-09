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
  from: { type: String },
  to: { type: String },
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

/* itemSchema.statics.getFieldValues = async function (field) {
  try {
    const values = await Item.find().distinct(`${field}`);
    return values;
  } catch (err) {
    next(err);
  }
};
 */
//nuevo getFieldValues: utiliza el framework aggregate de mongo


itemSchema.statics.getFieldValues = async function () {
  try {
    const fields = ['group', 'order', 'family', 'genus', 'species', 'area', 'origin', 'country'];
    const aggregationPipeline = fields.map(field => ({
      $group: {
        _id: null,
        [field]: { $addToSet: `$${field}` }
      }
    }));

    const groupValues = await this.aggregate([aggregationPipeline[0]]);
    const orderValues = await this.aggregate([aggregationPipeline[1]]);
    const familyValues = await this.aggregate([aggregationPipeline[2]]);
    const genusValues = await this.aggregate([aggregationPipeline[3]]);
    const speciesValues = await this.aggregate([aggregationPipeline[4]]);
    const areaValues = await this.aggregate([aggregationPipeline[5]]);
    const originValues = await this.aggregate([aggregationPipeline[6]]);
    const countryValues = await this.aggregate([aggregationPipeline[7]]);

    const results = [groupValues[0]['group'], orderValues[0]['order'], familyValues[0]['family'], 
    genusValues[0]['genus'], speciesValues[0]['species'],areaValues[0]['area'], originValues[0]['origin'], 
    countryValues[0]['country']];
  
    return results;
    
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const Item = mongoose.model("Item", itemSchema);

//opcional: no hace falta (¿porqué no?)
module.exports = Item;
