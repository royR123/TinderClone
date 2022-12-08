const Messages = require('../Models/messages');

const getMessages = async (req,res) => {
    const { from_user_id , to_user_id } = req.query;
    try{
        const foundMessages = await Messages.find({from_user_id : from_user_id , to_user_id : to_user_id});
        res.send(foundMessages);
    }catch(e){
        console.log(e);
    }
}
module.exports = getMessages;