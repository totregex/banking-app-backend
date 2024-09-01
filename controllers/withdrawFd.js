const fdSchema = require("../models/fdSchema");
const userSchema = require("../models/userSchema");
const bcrypt = require("bcrypt");
const Joi = require("joi-browser");

module.exports = async (req, res) => {
  const { accountNumber, token, pin } = req.body;

  // console.log(req.body.data);
  const schema = {
    accountNumber: Joi.string().required().label("Account Number"),
    token: Joi.string().required().label("Token"),
    pin: Joi.string().required().label("PIN"),
  };

  const { error } = Joi.validate(req.body, schema);
  if (error) return res.status(400).send(error.details[0].message);

  // if (!accountNumber || !token) {
  //   res.json({ error: "fills credentials properly." });
  // }

  const fduser = await fdSchema.findOne({
    accountNumber: accountNumber,
    token: Number(token),
  });

  // console.log("FD USER ", fduser)


  if (!fduser) {
    return res.status(404).send("Invalid account or token");
  }
  
  // console.log(pin, fduser.pin)

  const isMatchPIN = await bcrypt.compare(pin, req.user.pin);

  // console.log(isMatchPIN)
  if (!isMatchPIN) return res.status(400).send("You’ve entered the wrong PIN");

  //   console.log(fduser[0].name);
  const i = fduser.interest;
  const minT = fduser.minTime;
  const maxT = fduser.maxTime;
  let amount = fduser.amount;
  const date = new Date(fduser.fdDate);

  const currentDate = new Date();
  const minute = 1000 * 60;
  const hour = minute * 60;
  const day = hour * 24;
  //   const year = day * 365;

  const time = currentDate.getTime() - date.getTime();
  const depositTime = time / day;
  console.log(depositTime);

  if (depositTime < minT) {
    return res.status(400).send("FD period has not yet completed.");
  }

  if (depositTime < maxT) {
    amount = amount + amount * i * depositTime;
    amount = (amount * i * depositTime)/100;
  }

  //   console.log("P1");
  if (depositTime >= maxT) {
    amount = amount + amount * i * maxT;
    amount = (amount * i * maxT)/100;
  }
  amount = Math.floor(amount)

  res.send("successful withdrawal");

  const updateUser = await userSchema.updateOne(
    { accountNumber: accountNumber },
    {
      $set: {
        bankBalance: Number(req.user.bankBalance + amount),
      },
    }
  );

  console.log(updateUser);

  const deleteUser = await fdSchema.deleteOne({
    accountNumber: accountNumber,
    token: token,
  });
  console.log(deleteUser);
};
