const fdSchema = require("../models/fdSchema");
const userSchema = require("../models/userSchema");

module.exports = async (req, res) => {
  const { accountNumber, token } = req.body;

  // console.log(req.body.data);

  if (!accountNumber || !token) {
    res.json({ error: "fills credentials properly." });
  }

  const fduser = await fdSchema.findOne({ accountNumber: accountNumber, token: Number(token) });

  if(!fduser){
    return res.status(404).send("Invalid token")
  }
//   console.log(fduser[0].name);
  const i = fduser.interest;
  const minT = fduser.min;
  const maxT = fduser.max;
  let amount = fduser.amount;
  const date = fduser.fdDate;

  const currentDate = new Date();
  const minute = 1000 * 60;
  const hour = minute * 60;
  const day = hour * 24;
//   const year = day * 365;

  const time = currentDate.getTime() - date.getTime();
  const depositTime = time/day;
  console.log(depositTime);

  if(depositTime < minT){
    return res.status(400).send("Your fd deposit time is not completed.");
  }

  if(depositTime < maxT){
    amount = amount*i*(depositTime);
  }

//   console.log("P1");
  if(depositTime >= maxT){
    amount = amount*i*maxT;
  }


  res.send("successful withdrawal");
  
  const updateUser = await userSchema.updateOne({accountNumber: accountNumber}, {
    $set: {
        bankBalance: Number(req.authuser.bankBalance + amount)
    }
  });

  console.log(updateUser);

  const deleteUser = await fdSchema.deleteOne({accountNumber: accountNumber, token: token});

  console.log(deleteUser);
};