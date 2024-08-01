const bcrypt = require("bcrypt");
const User = require("../models/userSchema");
const Joi = require('joi-browser')

module.exports = async (req, res) => {
    const { email, password, accountNumber } = req.body;

    schema = {
      accountNumber: Joi.string()
        .required()
        .label("Account Number"),
      email: Joi.string().email()
        .required()
        .label("Email Address"),
      password: Joi.string()
        .required()
        .min(2)
        .label("Password")
    };
    
    const { error } = Joi.validate(req.body, schema);
    if (error) return res.status(400).send(error.details[0].message);

    // console.log(req.body)
    const userLogin = await User.findOne({ email: email });
    // console.log(userLogin)

    if(!userLogin){
        return res.status(400).send("User not registered")
    }
    const isMatch = await bcrypt.compare(password, userLogin.password);

    if (!isMatch) {
      return res.status(400).send("Incorrect password");
    }

    if (userLogin.accountNumber != accountNumber) {
      return res.status(400).send("Account doesn't exist");
    }

    const token = await userLogin.generateAuthToken();

    res.send(token);
};
