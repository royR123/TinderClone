const express = require('express');
const Users = require('../Models/Users');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const {v4 : uuidv4} = require('uuid');
const bcrypt = require('bcrypt');

const signUp = async (req,res) => {

    const { email , password } = req.body;
    const userId = uuidv4();
    const saltRound = 10;
    const hashedPassword = await bcrypt.hash(password,saltRound);
    try {
        console.log("in sign up route");
        const sanitizedEmail = email.toLowerCase();
        const userExist = await Users.findOne({email: sanitizedEmail}).exec() ;
        
        console.log(userExist);
        if(userExist){
            return res.status(400).send('user already exists');
        }
        const data = await Users.create({email : sanitizedEmail, hashed_password : hashedPassword , user_id : userId});
        const token = jwt.sign({user_id : userId},require('../SecretKey'),{
            expiresIn: '1d'
        });
        // res.cookie('Email',sanitizedEmail,{maxAge : 60*60});
        // res.cookie('UserId',userId);
        // res.cookie('Token',token);
        res.status(201).json({token : token , user_id : userId , email : sanitizedEmail });
        console.log("done");
    } catch (error) {
        console.log(error);
    }
};

module.exports = signUp;