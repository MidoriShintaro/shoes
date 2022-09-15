const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "../.env" });
const Product = require("../model/productModel");
const Categories = require("../model/categoriesModel");
const Review = require("../model/reviewModel");
const fs = require("fs");

//connect db
mongoose
  .connect(process.env.DBURI)
  .then(() => console.log("DB connect successfull"));

const products = JSON.parse(fs.readFileSync(`./product.json`, "utf-8"));
const categories = JSON.parse(fs.readFileSync("./categories.json", "utf-8"));
const reviews = JSON.parse(fs.readFileSync("./review.json", "utf-8"));

const importData = async () => {
  try {
    await Product.create(products);
    await Categories.create(categories);
    await Review.create(reviews);
    console.log("Data import successfull");
  } catch (error) {
    console.log(error);
  }
  process.exit();
};

const deleteData = async () => {
  try {
    await Product.deleteMany();
    await Categories.deleteMany();
    await Review.deleteMany();
    console.log("Data delete successfull");
  } catch (error) {
    console.log(error);
  }
  process.exit();
};

if (process.argv[2] === "--import") {
  importData();
}
if (process.argv[2] === "--delete") {
  deleteData();
}
