const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/Airbnb";

main().then(() => {
  console.log("Connected to DB");
})
.catch((err) => {
  console.log(err);
})
async function main(){
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  try{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({...obj, owner: "66db09a2740f24f01a9cdfa1"}));
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
  }
  catch(error){
    console.error("Error initializing database:", error);
  }
}

initDB();