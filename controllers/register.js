const Evalidator = require("email-validator");
const Avalidator = require("aadhaar-validator");
const User = require("../models/userSchema");
const nolookalikes = require("nanoid-generate/nolookalikes");
const _ = require("lodash");
const Joi = require("joi-browser"); 

module.exports = async (req, res) => {
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

  const schema = {
    name: Joi.string().min(3).max(30).required().label("Name"),
    email: Joi.string().email().required().label("Email Address"),
    password: Joi.string().min(4).required().label("Password"),
    cPassword: Joi.string().min(4).required().label("Confirm Password"),
    age: Joi.number().integer().min(18).max(120).required().label("Age"),
    gender: Joi.string().required().label("Gender"),
    DOB: Joi.date().required().label("DOB"),
    aadhaarCard: Joi.string().length(12).label("Aadhaar Card"),
    panCard: Joi.string().length(10).required().label("PAN Card"),
    PhoneNo: Joi.string().length(10).regex(/^[0-9]+$/).required().label("Phone Number"),
    FatherName: Joi.string().min(3).max(30).required().label("Father's Name"),
    pin: Joi.string().min(3).max(4).regex(/^[0-9]+$/).required().label("PIN"),
    city: Joi.string().min(2).max(50).required().label("City"),
    state: Joi.string().min(2).max(50).required().label("State"),
    country: Joi.string().min(2).max(50).required().label("Country"),
    bankBalance: Joi.number().min(0).required().label("Bank Balance"),
    accountType: Joi.string().required().label("Account Type"),
    bankName: Joi.string().min(3).max(50).required().label("Bank Name")
  };
  console.log(req.body)
  // Validation
  const { error } = Joi.validate(req.body, schema);
  if (error) return res.status(400).send(error.details[0].message);

  // Check for duplicates
  const emailDuplicate = await User.findOne({ email: email });
  const phoneDuplicate = await User.findOne({ PhoneNo: PhoneNo });
  const panDuplicate = await User.findOne({ panCard: panCard });
  const aadhaarDuplicate = await User.findOne({ aadhaarCard: aadhaarCard });

  if (emailDuplicate || phoneDuplicate || panDuplicate || aadhaarDuplicate) {
    return res.status(400).send("User already exists");
  }

  if (password !== cPassword) {
    return res.status(400).send("Password and Confirm Password don't match");
  }

  // Aadhaar card validation (commented out as per original code)
  // if (!Avalidator.isValidNumber(aadhaarCard)) {
  //   return res.status(400).send("Please provide a valid Aadhaar");
  // }

  if (bankBalance < 1000) {
    return res.status(400).send("Bank balance is less than required");
  }

  const accountNumber = nolookalikes(10);
  const CIF = Math.floor(Math.random() * 1000000000000);
  let openingDate = new Date();
  let address = {
    city: city,
    state: state,
    country: country,
  };

  // Registering the user
  const user = new User({
    name,
    email,
    password,
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
  
  return res
    .header("x-auth-token", token)
    .header("access-control-expose-headers", "x-auth-token")
    .send(_.pick(user, ["_id", "name", "email", "accountNumber"]));
};
