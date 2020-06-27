let express= require("express");
let router = express.Router();
let User = require("../userSchema/user");
let bcrypt = require("bcrypt");

//user authentication

router.post("/auth",async(req,res)=>{
    let user = await User.findOne({"UserLogin.EmailId": req.body.UserLogin.EmailId});
    if(!user){return res.status(403).send({message: "Invalid email id"})};

    let password = await bcrypt.compare(req.body.UserLogin.Password, user.UserLogin.Password);
    if(!password) {return res.status(403).send({message:"Invalid password"})};

    res.send({ message : "Login Successfully !!!"});
});

module.exports = router;
