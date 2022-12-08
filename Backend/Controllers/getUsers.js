const User = require('../Models/Users');

const getUsers = async (req,res) => {
    console.log("in matched get Users ");
    try{
        console.log(req.query.userIds);
        const matchedIds = JSON.parse(req.query.userIds);
        const pipeline = [
            {
                '$match':{ 
                    'user_id':{
                        '$in': matchedIds
                    }
                }
            }
        ]
        const foundUsers = await User.aggregate(pipeline);
        console.log(foundUsers);
        res.send(foundUsers);
    }catch(e){
        console.log(e);
    }
}

module.exports = getUsers;