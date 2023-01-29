// var createError = require("http-errors");
var express = require("express");
const { get } = require("http");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
require("dotenv").config();
require("./lib/connectMongoose");

//TODO: el handler.js es solo un ejemplo, prueba a quitarlo
//TODO: serverless function arroja timeout error
//TODO: logs: time out (10.01 secs) error - this time it does the call to the db  
//he eliminado la variable MONGODB_URI de los settings del proyecto de Vercel a ver si por eso no hace la integración con Atlas
//Integración Atlas-Vercel succesful, pero pone que no hay clusters integrados con Vercel
//follow up: revisar email de Atlas confirmando integración
//The integration is set up successfully. However, an error happened when attempting to link the Atlas cluster to Vercel projects. 
//Please visit the Organization's Integrations
//page to try again.

//We are writing to inform you that your Vercel account is no longer integrated with MongoDB Atlas.

//Please note that the Atlas database user(s) and network access rule(s) that were created as part of the integration were not removed. You can update them via logging into Atlas UI. 



var cors = require('cors');

console.log(process.env);

var app = express();

app.get("/api/", (req, res)=>{
    res.send("Hola...");
})

// view engine setup
//app.set("views", path.join(__dirname, "views"));
//app.set("view engine", "ejs");


app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, "public")));


//rutas del api
app.use("/api/items", require("./routes/items"));
// app.use("/apiv1/fields", require("./routes/fields"));


// catch 404 and forward to error handler
// app.use(function (req, res, next) {
//   next(createError(404));
// });

// error handler
//app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  //res.locals.message = err.message;
  //res.locals.error = req.app.get("env") === "development" ? err : {};

  //res.status(err.status || 500);
  
  // if it's an api call render the error json 
//   if (req.originalUrl.startsWith("/api")) {
//     res.json({ error: err.message });
//     return;
//   }
  // if is a browser call render the error view
  //res.render("error");
  
  //  else {
  //   res.render("error");
  // }

//});

module.exports = app;
