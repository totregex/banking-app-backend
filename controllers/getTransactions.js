const Transaction = require("../models/transaction");

module.exports = async (req, res) => {
  try {
    const allTransactions = await Transaction.find({
      $or: [
        { senderEmail: req.user.email },
        { receiverEmail: req.user.email }
      ]
    });
    return res.send(allTransactions);
  } catch (err) {
    return res.status(500).send("An error occurred while fetching transactions.");
  }
};
