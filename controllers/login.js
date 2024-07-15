const bcrypt = require("bcrypt");
const User = require("../models/userSchema");

module.exports = async (req, res) => {
    // setting values
    const { email, password, accountNumber } = req.body;
    console.log(req.body)
    const userLogin = await User.findOne({ email: email });
    console.log(userLogin)

    if(!userLogin){
        return res.status(400).send("User not registered")
    }

    const isMatch = await bcrypt.compare(password, userLogin.password); //for comparing the user entered password with the stored encrypted password

    if (!isMatch) {
      return res.status(400).send("Invalid email or password");
    }
    if (userLogin.accountNumber != accountNumber) {
      return res.status(400).send("Invalid Account Number");
    }

    const token = await userLogin.generateAuthToken();

    res.send(token);
};
