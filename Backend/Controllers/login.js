const Users = require('../Models/Users');
const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');
const secret = require('../SecretKey');
const login = async (req,res) => {
    try {
        console.log("here in login route")
        const { email , password } = req.body;
        const sanitizedEmail = email.toLowerCase();
        console.log(sanitizedEmail);
        const userExist = await Users.findOne({ email : sanitizedEmail }).exec();
        console.log(userExist);
        if(!userExist){
            res.json({message : "user not exist"});
        }else{
            const correctPassword =  await bcrypt.compare(password,userExist.hashed_password);
            const { user_id }  = userExist;
            if(correctPassword){
                const token = jwt.sign({ user_id },secret,{
                    expiresIn: '1d',
                });
                res.status(201).json({token , user_id , email : sanitizedEmail });
            }else{
                res.send("Not Valid Credentials");
            }
        }
        
    } catch (error) {
        console.log(error);
    }
}

module.exports = login;