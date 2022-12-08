const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const db_connect = require('./config/db');
const path = require('path');

const app = express();

const { createServer } = require('http');

const { Server } = require('socket.io');
const server = createServer(app);
const io = new Server(server,{
    cors:{
        origin:["http://localhost:3000",'http://merntinderapp.herokuapp.com']
    }
});


const { protect } = require('./middlewares/authMiddleware');
require('dotenv').config();


app.use(cors({
    origin : ['http://localhost:3000','http://merntinderapp.herokuapp.com'],
    credentials : true
}));

db_connect();

app.use(express.urlencoded({extended : false}));
app.use(express.json());

const PORT = process.env.PORT || 5000;


// Sign up Route
app.use('/signup',require('./Routes/signup'));

// Login Route
app.use('/login',require('./Routes/login'));

//Update User
app.use('/updateUser',protect,require('./Routes/updateUser'));

//get user
app.use('/user',require('./Routes/getUser')); 

//get genderedusers
app.use('/genderedusers',require('./Routes/getGenderedUsers'));

//get all users matched with request ids
app.use('/getUsers',protect,require('./Routes/getUsers'));

// route for the messages related requests
app.use('/messages',require('./Routes/messages'));

const userIdToSocketMapping = new Map();
const rooms = new Map();
io.on('connection',(socket) => {
    socket.on('register-me' , ({ userId }) => {
        // console.log('doing register thing');
        // console.log(socket.id);
        userIdToSocketMapping.set(userId,socket.id);
        // console.log(userIdToSocketMapping.get(userId));
    })
    socket.on('calling',({ roomId , callerId , callToUserId }) => {
        const callToUserIdSocketId = userIdToSocketMapping.get(callToUserId);
        console.log('inside calling');
        console.log(callToUserId);
        console.log(callToUserIdSocketId);
        io.to(callToUserIdSocketId).emit('call-from-user' , {roomId , callerId});
    })
    socket.on('join-room' , (roomId) => {
        if(rooms.has(roomId)){
            rooms.get(roomId).add(socket.id);
        }else{
            rooms.set(roomId , new Set());
            rooms.get(roomId).add(socket.id);
        }
        let otherSocketId = null;
        rooms.get(roomId).forEach(id => {
            if(id !== socket.id){
                otherSocketId = id;
            }
        });
        console.log(`other user socket.id is ${otherSocketId} `)
        if(otherSocketId){
            socket.emit('other-user' , otherSocketId);
            io.to(otherSocketId).emit('user-joined',socket.id);
        }
    })

    socket.on('offer' , payload => {
        io.to(payload.target).emit('offer',payload);
    })

    socket.on('answer', payload => {
        io.to(payload.target).emit('answer',payload);
    })

    socket.on("ice-candidate", incoming => {
        io.to(incoming.target).emit("ice-candidate", incoming.candidate);
    });

    socket.on('end-call', ({ userId , roomId}) => {
        rooms.get(roomId).delete(socket.id);
        if(rooms.get(roomId).size === 0){
            rooms.delete(roomId);
        }else{
            let otherSocketId = null;
            rooms.get(roomId).forEach(id => {
                otherSocketId = id;
            });            
            io.to(otherSocketId).emit('other-user-end-call',{ userId });
        }
    })
    // socket.on('disconnect')
})

if(process.env.NODE_ENV === 'production'){
    app.use(express.static(path.join(__dirname,'../frontend/build')))
    app.get('*',(req,res) => {
        res.sendFile(path.resolve(__dirname,'../','frontend','build','index.html'))
    })
}


app.get('*',(req,res)=>{
    res.status(404).send("Page not found");
    // console.log("hey");
})


server.listen(PORT,()=>{
    console.log(`Server is running at ${PORT}`);
})