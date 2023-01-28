"use strict";
const mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB_URI, {})
  .catch((error) =>
    console.log("Error al intentar establecer la conexión", error)
  );

  mongoose.connection.once("open", () => {
      console.log("Conectado a MongoDB a la bd:", mongoose.connection.name);
    });
    

//gestión de errores post-conexión
mongoose.connection.on("error", (error) => {
  console.log("Error de conexión", error);
  process.exit(1);
});


mongoose.connection.on("disconnected", () => {
  console.log("Desconectado", mongoose.connection.readyState);
});

//opcional: lo exportamos pero no hace falta pues al importar mongoose con un require importa también connection
//pero a veces es conveniente por claridad del código
module.exports = mongoose.connection;
