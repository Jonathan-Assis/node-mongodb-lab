const { MongoClient } = require("mongodb")
require("dotenv").config();

// Use .env to specify the Atlas MongoDB uri connection
const mongoConnection = process.env.ATLAS_MONGODB_URI
// Create the MongoClient instance
const client = new MongoClient(mongoConnection)

// Establishes a connection to the database using the MongoClient instance
const connectToDatabase = async () => {
  try {
    await client.connect()
    console.log("Connected to MongoDB Atlas!")
    // list out all the databases in the cluster
    const dbs = await client.db().admin().listDatabases()
    console.table(dbs.databases)
  } catch (error) {
    console.error(error)
  } finally {
    await client.close()
  }
}

// Run the `connectToDatabase` function, catch any errors and finally close the connection when the connectToDatabase function is done
connectToDatabase()
  .catch((err) => console.log(err))
  .finally(() => client.close())