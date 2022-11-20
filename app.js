// Require MongoDB language driver
const { MongoClient, ObjectId } = require("mongodb")
require("dotenv").config();

// Use .env to specify the Atlas MongoDB uri connection
const uri = process.env.ATLAS_MONGODB_URI
const client = new MongoClient(uri)

// Bank account example
const dbname = "bank"
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

const documentToFind = { _id: ObjectId("Your _id document")}

const main = async () => {
  try {
    await connectToDatabase()
    // 'find one' account that matches _id
    let result = await accountsCollection.findOne(documentToFind)
    console.log(`Found one document`)
    console.log(result)
  } catch (error) {
    console.error(`Error finding documents: ${error}`)
  } finally {
    // close the client connection
    await client.close()
  }
}

main()