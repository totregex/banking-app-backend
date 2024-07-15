const Fd = require("../models/fdSchema");
const User = require("../models/userSchema");

module.exports = async (req, res) => {
  const { interest, amount, minTime, maxTime, pin, nominee, age } = req.body;

  if (!amount || !nominee) {
    return res.status(400).json({ message: "Please fill the credentials correctly." });
  }

  if (req.user.bankBalance <= amount) {
    return res.status(400).send("Insufficient bank balance");
  }

  const name = req.user.name;
  const token = Math.floor(Math.random() * 10000);
  const fdDate = new Date();
  const accountNumber = req.user.accountNumber;

  const newFd = new Fd({
    name,
    accountNumber,
    amount,
    interest,
    minTime,
    maxTime,
    fdDate,
    token,
    nominee,
  });

  await newFd.save(); // Ensure to await saving the new Fd document

  // Update user's bankBalance and push newFd to fds array
  const updatedUser = await User.findOneAndUpdate(
    { accountNumber: accountNumber },
    {
      $set: { bankBalance: Number(req.user.bankBalance) - Number(amount) },
      $push: { fds: newFd },
    }
  );

  // updatedUser will now have the updated fds array
  console.log(updatedUser.fds);

  res.json({ message: "Fd is successfully made.", newFd });
};
