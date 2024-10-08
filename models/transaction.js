const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema([{
    senderName:{
        type: String
    },
    senderEmail:{
        type: String
    },
    senderAccountNo: {
        type: String
    },
    receiverName: {
        type: String
    },
    receiverEmail:{
        type: String
    },
    receiverAccountNo: {
        type: String
    },
    amount: {
        type: Number
    },
    transactionType: {
        type: String,
        enum: ["withdraw", "deposit", "transfer"]
    },
    transactionDate:{
        type: Date,
        default: Date
    }
}
]);

const Transaction = mongoose.model("transaction", transactionSchema );
module.exports= Transaction;