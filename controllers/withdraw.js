const User = require("../models/userSchema");
const Transaction = require("../models/transaction");
const bcrypt = require("bcrypt");
const Joi = require("joi-browser");

module.exports = async (req, res) => {
  const { accountNumber, pin, amount } = req.body;

  // if (!pin || !amount) {
  //   return res.json({
  //     success: false,
  //     error: "Please fill the fields properly.",
  //   });
  // }

  const schema = {
    accountNumber: Joi.string().required().label("Account Number"),
    pin: Joi.string().required().label("PIN"),
    amount: Joi.number()
      .integer()
      .min(1)
      .max(100000)
      .required()
      .label("Amount"),
  };

  const { error } = Joi.validate(req.body, schema);
  if (error) return res.status(400).send(error.details[0].message);

  const userExist = await User.findOne({ email: req.user.email });
  //   console.log(userExist);
  
  if (!userExist || userExist?.accountNumber !== accountNumber)
    return res.status(400).send("User doesn't exist");

  //   console.log(userExist.pin);
  const ifMatch = await bcrypt.compare(pin, userExist.pin);
  // console.log(req.authuser.email);
  // console.log(ifMatch);

  if (!ifMatch) {
    return res.status(400).send("Pin does not match!");
  }
  if (amount > userExist.bankBalance) {
    return res.status(400).send("Insufficient bank balance");
  }

  res.send(`Transaction is successful and Rs.${amount} has been withdrawaled`);

  const updated = await User.updateOne(
    { email: userExist.email },
    {
      $set: {
        bankBalance: Number(userExist.bankBalance) - Number(amount),
      },
    }
  );
  // storing data in transaction schema
  const senderName = userExist.name;
  const senderEmail = userExist.email;
  const senderAccountNo = userExist.accountNumber;
  const recieverName = null;
  const recieverEmail = null;
  const recieverAccountNo = null;
  const transactionType = "withdraw";

  const transaction = new Transaction({
    senderName,
    senderAccountNo,
    senderEmail,
    recieverName,
    recieverEmail,
    recieverAccountNo,
    amount,
    transactionType,
  });

  const transactionSave = await transaction.save();
  return;
};
