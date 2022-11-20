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

// Filter used to find the document to delete 
const documentToDelete = { _id: ObjectId("Your _id document")}

const main = async () => {
  try {
    await connectToDatabase()
    let result = await accountsCollection.deleteOne(documentToDelete)
    result.deletedCount === 1
      ? console.log(`Deleted one document`)
      : console.log("No documents updated")
  } catch (error) {
    console.error(`Error deleting documents: ${error}`)
  } finally {
    // close the client connection
    await client.close()
  }
}

main()