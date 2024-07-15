const jwt = require("jsonwebtoken");
const userSchema = require("../models/userSchema");
// const fs = require("fs");
// var token = fs.readFileSync("token.txt", "utf8");
// console.log(token);
// console.log("authenticate.");

const Auth = async (req, res, next) => {
    const token = req.headers['x-auth-token'];
    const verifyUser =jwt.verify(
      token,
      process.env.SECRET_KEY
    );
    console.log(verifyUser);
    const authuser = await userSchema.findOne({
      _id: verifyUser._id,
    });
    if (!authuser) {
      res.status(401).send("User not logged in!")
    }
    console.log(authuser)
    req.user = authuser;
    // console.log(authuser);
    next();
}

module.exports = Auth;