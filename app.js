// Require MongoDB language driver
const { MongoClient } = require("mongodb")
require("dotenv").config();

// Use .env to specify the Atlas MongoDB uri connection
const uri = process.env.ATLAS_MONGODB_URI
const client = new MongoClient(uri)

// Step 1: Create variables used in the transaction.  
// Collections
const accounts = client.db("bank").collection("accounts")
const transfers = client.db("bank").collection("transfers")

// Account information
let account_id_sender = "MDB829001337"
let account_id_receiver = "MDB829000001"
let transaction_amount = 100

// Step 2:  Start a new session. 
const session = client.startSession()

// use withTransaction to start a transaction, execute the callback, and commit the transaction
// The callback for withTransaction must be async/await
// Note: Each individual operation must be awaited and have the session passed in as an argument
// Establishes a connection to the database using the MongoClient instance

const main = async () => {
  try {
    // Step 3: Begin a transaction with the WithTransaction() method on the session. 
    const transactionResults = await session.withTransaction(async () => {
      // Step 4: Update the balance field of the sender’s account by decrementing the transaction_amount from the balance field. 
      const senderUpdate = await accounts.updateOne(
        { account_id: account_id_sender },
        { $inc: { balance: -transaction_amount } },
        { session }
      )
      console.log(
        `${senderUpdate.matchedCount} document(s) matched the filter, updated ${senderUpdate.modifiedCount} document(s) for the sender account`
      )

      // Step 5: Update the balance field of the receiver’s account by incrementing the transaction_amount to the balance field. 
      const receiverUpdate = await accounts.updateOne(
        { account_id: account_id_receiver },
        { $inc: { balance: transaction_amount } },
        { session }
      )
      console.log(
        `${receiverUpdate.matchedCount} document(s) matched the filter, updated ${receiverUpdate.modifiedCount} document(s) for the receiver account`
      )

      // Step 6: Create a transfer document and insert it into the transfers collection. 
      const transfer = {
        transfer_id: "TR21872187",
        amount: 100,
        from_account: account_id_sender,
        to_account: account_id_receiver,
      }      

      const insertTransferResults = await transfers.insertOne(transfer, { session })
      console.log(`Sucessfully inserted ${insertTransferResults.insertedId} into the transfers collection`)
      
      // Step 7: Update the transfers_complete array of the sender’s account by adding the transfer_id to the array. 
      const updateSenderTransferResults = await accounts.updateOne(
        { account_id: account_id_sender },
        { $push: { transfers_complete: transfer.transfer_id } },
        { session }
      )
      console.log(`${updateSenderTransferResults.matchedCount} document(s) matched in the transfers collection, updated ${updateSenderTransferResults.modifiedCount}`)

      // Step 8: Update the transfers_complete array of the receiver’s account by adding the transfer_id to the array. 
      const updateReceiverTransferResults = await accounts.updateOne(
        { account_id: account_id_receiver },
        { $push: { transfers_complete: transfer.transfer_id } },
        { session }
      )
      console.log(`${updateReceiverTransferResults.matchedCount} document(s) matched in the transfers collection, updated ${updateReceiverTransferResults.modifiedCount}`)
    })

    console.log("Committing transaction...")
    // Step 9: Log a message regarding the success or failure of the transaction. 
    // If the callback for withTransaction returns successfully without throwing an error, the transaction will be committed 
    if (transactionResults){
      console.log("The reservation was sucessfully created.")
    } else {
      console.log("The reservation was intentionally aborted.")
    }
  } catch (error) {
    // Step 10: Catch any errors and close the session.
    console.error(`Transaction aborted: ${error}`)
    process.exit(1)
  } finally {
    await session.endSession()
    await client.close()
  }
}

main()