const jwt = require('jsonwebtoken');
const User = require('../Models/Users');
const secretKey = require('../SecretKey');
const protect = async (req,res,next) => { 
    let token;
    console.log(" in  protect ");
    console.log(req.headers)
    if(req.headers.authorisation && req.headers.authorisation.startsWith('Bearer')){
        // console.log("not in here");
        
        try{
            token = req.headers.authorisation.split(' ')[1];

            const decoded = jwt.verify(token,secretKey);
            console.log(decoded);
            const found_user = await User.findOne({ user_id : decoded.user_id } );
            if(found_user.user_id !== req.query.userId){
                return res.status(401).send("not authorised");
            }
            next()
        }catch(e){
            console.log(e);

            return res.status(401).json({message : "Not authorized"});
        }
    }
    if(!token){
        res.status(401).json({message : " Don't have the token"});
    }
}

module.exports =  { protect };