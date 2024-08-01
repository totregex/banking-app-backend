const Transaction = require("../models/transaction");

module.exports = async (req, res) => {
  try {
    const allTransactions = await Transaction.find({
      $or: [
        { receiverEmail: req.user.email },
        { senderEmail: req.user.email }
      ]
    });
    console.log(allTransactions)
    return res.send(allTransactions);
  } catch (err) {
    return res.status(500).send("An error occurred while fetching transactions.");
  }
};
