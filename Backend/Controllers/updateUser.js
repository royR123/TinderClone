const User = require('../Models/Users'); 

const updateUser = async (req,res) => {
    console.log("here in controller of update user");
    // console.log(req.body);
    try{
        const formData = req.body.formData;
        // console.log(formData);

        console.log(formData);
        const user = await User.findOneAndUpdate({user_id : formData.user_id} , formData);
        console.log(user);
        return res.status(201).json(user);
    }catch(e){
        console.log(e);
    }
}


module.exports = updateUser ;