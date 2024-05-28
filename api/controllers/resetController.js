const mongoose = require("mongoose");
const collections = mongoose.connection.collections;

const deleteData = async (req, res) => {
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany();
  }
  res.status(200).json({ msg: "database reseted succesfully" });
};
const searchData = async (req, res) => {
  const query = req.query.q;
  const collections = mongoose.connection.collections;

  const searchPromises = Object.keys(collections).map(async (key) => {
    const collection = collections[key];
    const cursor = collection.find(); // Get the cursor
    const matchingDocuments = [];

    // Iterate over the cursor
    for await (const doc of cursor) {
      for (const value of Object.values(doc)) {
        if (
          typeof value === "string" &&
          value.toLowerCase().includes(query.toLowerCase())
        ) {
          matchingDocuments.push(doc); // Push matching documents
          break;
        }
      }
    }

    return matchingDocuments;
  });

  const results = await Promise.all(searchPromises);
  const formattedResults = Object.keys(collections).reduce(
    (acc, key, index) => {
      acc[key] = results[index];
      return acc;
    },
    {}
  );

  res.status(200).json(formattedResults);
};

module.exports = {
  deleteData,
  searchData,
};
