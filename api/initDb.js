"use strict";
require("dotenv").config();
// const conn = require("./lib/connectMongoose");
const fs = require("fs");
const readline = require("readline");
const sample = "./db_829_corregida.json";
const Item = require("./models/Item");


const confirm = function (question) {
  return new Promise((resolve, reject) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question(question, function (answer) {
      resolve(answer);
      rl.close();
    });
  });
};

const loadJson = async function (file) {
  const dataPromise = new Promise((resolve, reject) => {
    fs.readFile(file, function (error, data) {
      resolve(data);
      reject(error);
    });
  });
  try {
    const rawData = await dataPromise;
    console.log(`Initialization file ${file} loaded`);
    if (!rawData) {
      console.log(`${file} is empty!`);
      return;
    }
    const data = JSON.parse(rawData).items;
    console.log(`Initialization file ${file} parsed`);
    // console.log(data);
    return data;
  } catch (error) {
    console.log(error);
  }
};

const initialize = async function () {
  const answer = await confirm(
    "Are you sure you want to initialize the database? (Yes)\n"
  );
  if (answer !== "Yes") {
    process.exit(0);
  } else {
    try {
      const conn = require("./lib/connectMongoose");
      const result = await Item.deleteMany({});
      console.log(`Deleted items: ${result.deletedCount}`);
      const data = await loadJson(sample);
      const newItems = await Item.insertMany(data);
      console.log(`New inserted items: ${newItems.length}`);
      conn.close();
    } catch (error) {
      console.log(error);
    }
  }
};

initialize();
