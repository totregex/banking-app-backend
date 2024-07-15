const User = require("../models/userSchema");
const Transaction = require("../models/transaction");

module.exports = async (req, res) => {
  const { pin, accountNumber, amount, bankName } = req.body;

  if (!pin || !accountNumber || !amount || !bankName) {
    return res.status(400).json({ error: "Please fill all the credentials properly." });
  }

  const currentUser = await User.findOne({ email: req.user.email });

  const userToTransfer = await User.findOne({ accountNumber: accountNumber });

  if(accountNumber === req.user.accountNumber) return res.status(400).send("Can't send money to yourself")

  
  if (!currentUser || !userToTransfer) {
    return res.status(404).send("user doesn't exist.");
  }

  if (userToTransfer.bankName != bankName) {
    return res.status(404).send("user doesn't exist in bank.");
  }

  console.log(req.user.email);

  if(currentUser.bankBalance < amount) return res.status(400).send("Insufficient balance")

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
    const recieverName = userToTransfer.name;
    const recieverEmail = userToTransfer.email;
    const recieverAccountNo = userToTransfer.accountNumber;
    const transactionType = "transfer";

    const transaction = new Transaction({
      senderName,
      senderEmail,
      senderAccountNo,
      recieverName,
      recieverEmail,
      recieverAccountNo,
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
