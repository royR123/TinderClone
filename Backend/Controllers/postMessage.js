const Messages = require('../Models/messages');

const postMessage = async (req,res) => {
    try{
        const messageInserted = await Messages.create(req.body.message);
        res.send(messageInserted);
    }catch(e){
        console.log(e);
    }
}
module.exports = postMessage;