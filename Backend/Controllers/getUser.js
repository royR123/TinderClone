const User = require('../Models/Users');
const getUser = async (req,res) => {

    const userId = req.query.userId;
    console.log(userId);
    try {
        console.log("here in getuser");
        const user = await User.findOne({user_id : userId});
        console.log(user);
        res.status(201).json(user);
    } catch (error) {
        
    }
}

module.exports = getUser;