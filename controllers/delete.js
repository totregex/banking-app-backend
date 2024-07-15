const User = require("../models/userSchema");
const FD = require('../models/fdSchema')
const Transaction = require("../models/transaction");

module.exports = async (req, res) => {
    if (!req.user) return res.status(400).send("No user found");

    // Delete user
    const userDeletionResult = await User.deleteOne({ email: req.user.email });

    // Delete transactions
    await Transaction.deleteMany({ senderEmail: req.user.email });
    // await FD.deleteMany({ accountNumber: req.user.accountNumber });

    return res.status(200).send("User deleted successfully");
};
