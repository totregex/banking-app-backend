const Transaction = require("../models/transaction");

module.exports = async (req, res) => {
  const allTransactions= await Transaction.find({senderEmail:req.user.email});
  return res.send(allTransactions);
};
