const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
    lowerCase: true,
    upperCase: true,
    Symbol: true,
  },
  cPassword: {
    type: String,
    required: true,
    lowerCase: true,
    upperCase: true,
    Symbol: true,
  },
  age: {
    type: Number,
    required: true,
  },
  gender: {
    type: String,
  },
  DOB: {
    type: String,
    required: true,
  },
  aadhaarCard: {
    type: String,
    required: true,
  },
  panCard: {
    type: String,
    required: true,
    maxLength: 10,
    minLength: 10,
  },
  PhoneNo: {
    type: String,
    required: true,
    unique: true,
    maxLength: 10,
    minLength: 10,
  },
  FatherName: {
    type: String,
    required: true,
  },

  address: {},
  accountNumber: {
    type: String,
    required: true,
    unique: true,
    immutable: true,
  },
  openingDate: {
    type: String,
    required: true,
  },
  pin: {
    type: String,
    required: true,
  },
  bankBalance: {
    type: Number,
    required: true,
  },
  bankName: {
    type: String,
    required: true,
  },
  accountType: {
    type: String,
    required: true,
  },
  CIF: {
    type: Number,
    required: true,
  },
  fds: [
    {
      fd: {
        type: Object,
      },
    },
  ],
});

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    let newPassword = this.password.toString();
    this.password = await bcrypt.hash(newPassword, 12);
    let newCpassword = this.cPassword.toString();
    this.cPassword = await bcrypt.hash(newCpassword, 12);
    // let newpin = this.pin.toString();
    // this.pin = await bcrypt.hash(newpin, 10);
  }

  if (this.isModified("pin")) {
    let newpin = this.pin.toString();
    this.pin = await bcrypt.hash(newpin, 10);
  }

  // if (this.isModified("PhoneNo")) {
  //   let newPhone = this.PhoneNo.toString();
  //   this.PhoneNo = await bcrypt.hash(newPhone, 10);
  // }
  next();
});

userSchema.methods.generateAuthToken = function () {
  try {
    // console.log(process.env.SECRET_KEY);
    let token = jwt.sign({ _id: this._id , accountNumber:this.accountNumber,name:this.name}, process.env.SECRET_KEY);
    // this.tokens = this.tokens.concat({ token: token });
    // await this.save();
    return token;
  } catch (err) {
    console.log(err);
  }
};

const User = mongoose.model("users", userSchema);
module.exports=User