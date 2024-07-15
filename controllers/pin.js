const bcrypt = require("bcrypt");
const User = require("../models/userSchema");

module.exports = async (req, res) => {
  const { accountNumber, oldPin, newPin, cNewPin } = req.body;

  if (!accountNumber || !newPin) {
    return res.json({
      success: false,
      error: "Please fill all the fields properly.",
    });
  }

  if (newPin != cNewPin) {
    return res.status(400).send("Pin doesn't match");
  }

  //   const oldHashedPin = req.user.pin;
  const userExist = await User.findOne({
    accountNumber: accountNumber,
    email: req.user.email,
  });

  if (!userExist) {
    return res.status(404).send("Invalid credentials. User not found");
  }

//   console.log("Before updation " + (req.user.pin === userExist.pin));

  const pinMatch = await bcrypt.compare(oldPin, userExist.pin);

  if (!pinMatch) return res.status(400).send("Incorrect old pin");

  if (accountNumber != req.user.accountNumber) {
    return res.status(400).send("Account does not match");
  }

  const hashPin = await bcrypt.hash(newPin, 10);

  // to hash
  //   console.log(hashPin);
  const updated = await User.updateOne(
    { accountNumber: accountNumber },
    {
      $set: {
        pin: hashPin,
      },
    }
  );

  console.log(updated);
  console.log("After updation " + req.user.pin);

  return res.send("Pin has been updated successfully.");
};
