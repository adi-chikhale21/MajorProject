const mongoose = require("mongoose");
const listing = require("../models/Schema.js");
const initData = require("./data.js");

mongoose_URL = "mongodb://127.0.0.1:27017/Wanderlust";

main()
  .then(() => {
    console.log("DB is connected");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(mongoose_URL);
}

const Data = async () => {
  await listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: "65e0ae24fd141700d3034cd9",
  }));
  await listing.insertMany(initData.data);
  console.log("Data was saved");
};

Data();
