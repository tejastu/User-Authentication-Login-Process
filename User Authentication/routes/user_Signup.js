let express= require("express");
let User= require("../userSchema/user");
let router = express.Router();
let Joi = require("@hapi/joi");
let bcrypt =require("bcrypt");

//all users record

router.get("/PEusers", async (req,res) =>{
    let data= await User.find();
    res.send({d: data});
});

//get user by id
router.get("/PEusers/:id" ,async(req,res)=>{
    let user = await User.findById(req.params.id);
    if (!user)
        {
            return res.status(404).send({message: "Invalid user id"});
        }
    res.send({u: user});
})

//create new user record
router.post("/PEcreateuser", async (req,res) =>{
    //checking is same email id with account is present or not
    let user = await User.findOne(
        {"UserLogin.EmailId": req.body.UserLogin.EmailId}
        );
    if(user)
    {
        return res.status(403).send({message: "User already exist"});
    }
     //validation (min or maximum characters etc.) on server side
    let {error} =ValidationError(req.body);
        if(error){return res.status(403).send(error.details[0].message)};
    
    let data = new User({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        Address: req.body.Address,
        UserLogin: req.body.UserLogin
    });

    //password encryption using bcrypt and hash method

    let saltRounds = 10;
    let salt = await bcrypt.genSalt(saltRounds);
    data.UserLogin.Password= await bcrypt.hash(data.UserLogin.Password, salt);
   

    await data.save();
    res.send({message: "Thanks for Registration"});
});

//update user record
router.put("/PEupdateuser/:id" ,async(req,res)=>{
    let user = await User.findById(req.params.id);
    if (!user)
        {
            return res.status(404).send({message: "Invalid user id"})
        };

        let {error} =ValidationError(req.body);
        if(error){return res.status(403).send(error.details[0].message)};
    
        user.firstname = req.body.firstname,
        user.lastname = req.body.lastname,
        user.Address =req.body.Address,
        user.UserLogin = req.body.UserLogin

        await user.save();
        res.send({message: "User Updated"});
    });

//remove user

router.delete("/PEremoveuser/:id", async(req,res)=>{
    let user = await User.findById(req.params.id);
    if(!user)
        { return res.status(403).send({message: "Invalid user id"})};
    res.send({message: "User Removed"});
})

function ValidationError(error){
    let schema = Joi.object({
        firstname: Joi.string().min(4).max(100).required(),
        lastname: Joi.string().min(4).max(100).required(),
        Address: Joi.string().min(4).max(1000).required(),
        UserLogin: {
            EmailId: Joi.string().email().required(),
            Password: Joi.string().min(4).max(100).required()
        }

    });
    return schema.validate(error);
}

module.exports = router;


