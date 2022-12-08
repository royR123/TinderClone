const User = require('../Models/Users'); 

const updateMatches = async (req,res) => {


    const { matchedUserId , userId } = req.body;
    try{
        console.log("here to update the matches ");
        const user = await User.findOne({user_id : userId});
        
        user.matches.addToSet(matchedUserId);
        await user.save();
        // console.log(user);
        return res.send(user);
    }catch(error){
        console.log(error);
        // res.status(500).send("server error");
    }
}
module.exports = updateMatches;