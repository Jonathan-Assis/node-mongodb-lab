// Require MongoDB language driver
const { MongoClient } = require("mongodb")
require("dotenv").config();

// Use .env to specify the Atlas MongoDB uri connection
const uri = process.env.ATLAS_MONGODB_URI
const client = new MongoClient(uri)

// Bank account example
const dbname= "bank"
const collection_name = "accounts"

// Select the database and collection instance
const accountsCollection = client.db(dbname).collection(collection_name)

// Establishes a connection to the database using the MongoClient instance
const connectToDatabase = async () => {
  try {
    await client.connect()
    console.log(`Connected to the ${dbname} database, \nFull connection string: ${uri}`)
  } catch (error) {
    console.error(`Error connecting to the database: ${error}`)
  }
}

// Simple mock
const sampleAccount = {
  account_holder: "Robervaldo Lopes",
  account_id: "MDB829001337",
  account_type: "checking",
  balance: 50352434,
  last_updated: new Date(),
}

const main = async () => {
  try {
    await connectToDatabase()
    // 'Insert one' document by using the sampleAccount mock
    let result = await accountsCollection.insertOne(sampleAccount)
    console.log(`Inserted document: ${result.insertedId}`)
  } catch (error) {
    console.error(`Error inserting document: ${error}`)
  } finally {
    // close the client connection
    await client.close()
  }
}

main()