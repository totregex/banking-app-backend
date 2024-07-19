const Fd = require("../models/fdSchema");

module.exports = async (req, res) => {
  const allFds= await Fd.find({accountNumber:req.user.accountNumber});
  // console.log(allFds)
  console.log(allFds)
  return res.send(allFds);
};
