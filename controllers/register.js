const Evalidator = require("email-validator");
const Avalidator = require("aadhaar-validator");
const User = require("../models/userSchema");
const nolookalikes = require("nanoid-generate/nolookalikes");
const _ = require("lodash");

module.exports = async (req, res) => {
  // storing the values into variables.
  const {
    name,
    email,
    password,
    cPassword,
    age,
    gender,
    DOB,
    aadhaarCard,
    panCard,
    PhoneNo,
    FatherName,
    pin,
    city,
    state,
    country,
    bankBalance,
    bankName,
    accountType,
  } = req.body;

  const emailDuplicate = await User.findOne({ email: email });
  const phoneDuplicate = await User.findOne({ PhoneNo: PhoneNo });
  const panDuplicate = await User.findOne({ panCard: panCard });

  if (emailDuplicate || phoneDuplicate || panDuplicate) {
    return res.status(400).send("User already exist");
  }

  if (password != cPassword) {
    return res.status(400).send("Password and Confirm Password doesn't match");
  }

  // aadhar card validation
//   if (!Avalidator.isValidNumber(aadhaarCard)) {
//     return res.status(400).send("Please provide valid Aadhaar");
//   }

  // const aadhaarExist = User.findOne({aadhaarCard: aadhaarCard});
  // console.log(aadhaarExist);
  // if(aadhaarExist){
  //   return res.json({ error: "Credentials' validation error an." });
  // }
  // checking bank balance

  if (bankBalance < 1000) {
    return res.status(400).send("Bank balance is less than required");
  }

  const accountNumber = nolookalikes(10);
  const CIF = Math.floor(Math.random() * 1000000000000);
  let openingDate = new Date();
  // const openingDate = now.getFullYear();
  let address = {
    city: city,
    state: state,
    country: country,
  };
  // registering the user.
  const user = new User({
    name,
    email,
    password,
    cPassword,
    age,
    gender,
    DOB,
    aadhaarCard,
    panCard,
    PhoneNo,
    FatherName,
    openingDate,
    pin,
    address,
    accountNumber,
    bankBalance,
    bankName,
    accountType,
    CIF,
  });
  const userRegister = await user.save();
  
  const token = userRegister.generateAuthToken();
  console.log(token)
  return res
    .header("x-auth-token", token)
    .header("access-control-expose-headers", "x-auth-token")
    .send(_.pick(user, ["_id", "name", "email", "accountNumber"]));
};
