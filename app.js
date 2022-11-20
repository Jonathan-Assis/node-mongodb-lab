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
const sampleAccounts = [
  {
    account_id: "MDB011235813",
    account_holder: "Osvaldo Lopes",
    account_type: "checking",
    balance: 60218,
  },
  {
    account_id: "MDB829000001",
    account_holder: "John Jhonny",
    account_type: "savings",
    balance: 267914296,
  }
]

const main = async () => {
  try {
    await connectToDatabase()
    // 'Insert many' documents by using the sampleAccounts mock
    let result = await accountsCollection.insertMany(sampleAccounts)
    console.log(`Inserted ${result.insertedCount} documents`)
    console.log(result)
  } catch (error) {
    console.error(`Error inserting documents: ${error}`)
  } finally {
    // close the client connection
    await client.close()
  }
}

main()