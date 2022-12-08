const User = require('../Models/Users');

const genderedusers = async (req,res) => {
    try {
        // console.log("here in get gendered users");
        // console.log(req.query.gender);
        const users = await User.find({gender_identity : req.query.gender}).exec();
        // console.log(users);
        res.send(users);
    } catch (error) {
        console.log(error);
    }
}
module.exports = genderedusers;