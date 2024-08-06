const User = require("../models/userSchema");
const Transaction = require("../models/transaction");
const Joi = require("joi-browser");
const bcrypt = require("bcrypt");

module.exports = async (req, res) => {
  const { pin, accountNumber, amount, bankName } = req.body;

  schema = {
    accountNumber: Joi.string().required().label("Account Number"),
    pin: Joi.string().required().label("PIN"),
    amount: Joi.number().min(1).max(100000).required().label("Amount"),
    bankName: Joi.string().required().label("Bank Name"),
  };

  const { error } = Joi.validate(req.body, schema);
  if (error) return res.status(400).send(error.details[0].message);
  const currentUser = await User.findOne({ email: req.user.email });

  const userToTransfer = await User.findOne({ accountNumber: accountNumber });

  if (accountNumber === req.user.accountNumber)
    return res.status(400).send("Can't send money to yourself");

  if (!currentUser || !userToTransfer) {
    return res.status(404).send("user doesn't exist.");
  }

  if (userToTransfer.bankName != bankName) {
    return res.status(404).send("user doesn't exist in bank.");
  }

  const isMatchPIN = await bcrypt.compare(pin, req.user.pin);

  if (!isMatchPIN) return res.status(400).send("Invalid PIN");

  console.log(req.user.email);

  if (currentUser.bankBalance < amount)
    return res.status(400).send("Insufficient balance");

  if (currentUser.bankBalance > amount) {
    const updatedCurrentUser = await User.updateOne(
      { email: currentUser.email },
      {
        $set: {
          bankBalance: Number(currentUser.bankBalance) - Number(amount),
        },
      }
    );

    const updatedNewUser = await User.updateOne(
      { accountNumber: accountNumber },
      {
        $set: {
          bankBalance: Number(userToTransfer.bankBalance) + Number(amount),
        },
      }
    );

    const senderName = currentUser.name;
    const senderEmail = currentUser.email;
    const senderAccountNo = currentUser.accountNumber;
    const receiverName = userToTransfer.name;
    const receiverEmail = userToTransfer.email;
    const receiverAccountNo = userToTransfer.accountNumber;
    const transactionType = "transfer";

    const transaction = new Transaction({
      senderName,
      senderEmail,
      senderAccountNo,
      receiverName,
      receiverEmail,
      receiverAccountNo,
      amount,
      transactionType,
    });
    const transactionSave = await transaction.save();
    // console.log("Transaction save ", transactionSave);
    return res.json({
      message: `Transaction is successful, and Rs.${amount} has been transfered.`,
    });
  }
};
