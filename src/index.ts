import express from 'express'
import mongoose from 'mongoose'
import dotEnv from 'dotenv'
import router from './routes/index'
import fs from 'fs'
import bodyParser from 'body-parser'
import cors from 'cors'
import { createServer } from "http";
import { Server, Socket } from "socket.io";
const app = express()
const uri : string = "mongodb://127.0.0.1:27017/Vaccine"

mongoose.connect(uri, {autoCreate: true},(err :any) =>{
    if(err) console.log(err);
    console.log("Mongoose connected");
})


const db = mongoose.connection
db.on("error", error => console.log(error))
db.once('open', () => "Connected to mongoose")
const port = 3000

const httpServer = createServer(app);
const io = new Server(httpServer, { cors: {
    origin: "http://localhost:3002",
    methods: ["GET", "POST"],
    // allowedHeaders: ["my-custom-header"],
    credentials: true
  } });

  io.on("connection", (socket: Socket) => {
     console.log(socket.id);
    socket.on('send-picture', (message) =>{
        console.log("recieved", message);
        socket.broadcast.emit("send-picture", message)
    })

    socket.on('clear-picture', (message) => {
        socket.broadcast.emit("clear-picture", message)
    })
    
  });

httpServer.listen(3002, () => {
  console.log("Server is running at 3002");
});

app.use(cors());
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: false}));
// app.use(bodyParser.json())
// app.use(bodyParser.json({limit:'50mb'}))
// app.use(bodyParser.urlencoded({
//     extended: false
// }))
app.use("/api/v1", router)
app.listen(3001)