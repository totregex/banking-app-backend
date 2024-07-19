const User = require("../models/userSchema");
const Transaction = require("../models/transaction");
const bcrypt = require("bcrypt");
const Joi = require("joi-browser");

module.exports = async (req, res) => {
  const { accountNumber, pin, amount } = req.body;

  const schema = {
    accountNumber: Joi.string().required().label("Account Number"),
    pin: Joi.string().required().label("PIN"),
    amount: Joi.number().integer().min(1).max(100000).required().label("Amount"),
  };

  const { error } = Joi.validate(req.body, schema);
  if (error) return res.status(400).send(error.details[0].message);

  const userExist = await User.findOne({ email: req.user.email });

  if (!userExist || userExist?.accountNumber !== accountNumber)
    return res.status(400).send("User not found");

  console.log(pin);
  console.log(userExist.pin);
  const ifMatch = await bcrypt.compare(pin, userExist.pin);

  if (!ifMatch) return res.status(400).send("Pin does not match");

  res.send(`Transaction successful and Rs.${amount} deposited.`);

  const updated = await User.updateOne(
    { email: userExist.email },
    {
      $set: {
        bankBalance: Number(userExist.bankBalance) + Number(amount),
      },
    }
  );
  //storing in transaction schema
  const senderName = userExist.name;
  const senderEmail = userExist.email;
  const senderAccountNo = userExist.accountNumber;
  const recieverEmail = null;
  const recieverName = null;
  const recieverAccountNo = null;
  const transactionType = "deposit";

  const transaction = new Transaction({
    senderName,
    senderEmail,
    senderAccountNo,
    recieverEmail,
    recieverName,
    recieverAccountNo,
    amount,
    transactionType,
  });
  const transactionSave = await transaction.save();
  console.log("Transaction save ", transactionSave);
  // return console.log(userExist.bankBalance);
};
