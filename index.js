//import express from 'express';
//import mongoose from 'mongoose';
//import path from 'path';
var express = require('express');
var mongoose = require('mongoose');
var path = require('path');
//var MessageSchema = require('./Models/MessageModel');
const Message = require('./Models/MessageModel');

//import {MessageSchema} from '../Models/MessageModel';

const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 5000;

//const Message = mongoose.model('Message',MessageSchema);
//mongoose.model(, )
/*
const uri = process.env.MONGODB_URI;
mongodb+srv://sa:Windo@1234@chatappdb.lelyn.mongodb.net/test
*/
const connection = "mongodb+srv://sa:Windo@1234@chatappdb.lelyn.mongodb.net/test";
mongoose.connect(connection,{ useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false})
    .then(() => console.log("Database Connected Successfully"))
    .catch(err => console.log("Failed to connect to database " + err));

// mongoose.connect("mongodb+srv://sa:Windo@1234@chatappdb.lelyn.mongodb.net/test", {
//     useUnifiedTopology: true,
//     useNewUrlParser: true,
//   });


  //app.use(express.static(path.join(__dirname, '..', 'client', 'build')));
  //app.use(express.static(path.join(__dirname, '..', 'frontend', 'build')));
//if(process.env.NODE_ENV === 'production')
{
  // app.use(express.static(path.join(__dirname, '..', 'frontend', 'build')));
  // app.get('*', (req,res) => { 
  //   res.sendFile(path.join(__dirname, '..', 'frontend', 'build','index.html'))
  // });
  app.use(express.static(path.join(__dirname, '../build')));
  app.get('*', (req,res) => { 
    res.sendFile(path.join(__dirname,'../build','index.html'))
  });
}  

io.on('connection', (socket) => {

  // Get the last 10 messages from the database.
  Message.find().sort({createdAt: -1}).limit(10).exec((err, messages) => {
    if (err) return console.log(err);

    // Send the last messages to the user.
    socket.emit('init', messages);
  });

  // Listen to connected users for a new message.
  socket.on('message', (msg) => {
    // Create a message with the content and the name of the user.
    const message = new Message({
      content: msg.content,
      name: msg.name,
    });

    // Save the message to the database.
    message.save((err) => {
      if (err) return console.log(err);
    });

    // Notify all other users about a new message.
    socket.broadcast.emit('push', msg);
  });
});

http.listen(port, () => {
  console.log('listening on *:' + port);
});