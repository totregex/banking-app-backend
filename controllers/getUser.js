const User = require("../models/userSchema");

 module.exports= async (req,res)=>{
    if(!req.user) {
        console.log("User Not Found");
        return res.status(404).send("User not found")
    }
    console.log("REQ.USER", req.user)
    return res.send(req.user);
}