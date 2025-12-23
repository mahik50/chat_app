import express from "express";
import cors from "cors";
import { connectDB } from "./db/db.js";
import { router } from "./routes/userRoute.js";
import dotenv from "dotenv";
import { WebSocketServer } from 'ws'

dotenv.config({
    path: './.env'
});

const app = express();

await connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/v1", router);

app.get("/", (req, res) => {
    res.send("Hello from Server!!");
})
const httpServer = app.listen(4000, (req, res) => {
    console.log("Sever is running at port 4000");
})

// connect web socket

const wss = new WebSocketServer({ server: httpServer });

wss.on('connection', function connection(ws) {
    ws.on('error', console.error);

    ws.on('message', function message(data, isBinary) {
        const msg = JSON.parse(data.toString());
        ws.roomID = msg.roomID;


        if(msg.type=='connect'){
            wss.clients.forEach(function each(client){
                if(client.readyState === WebSocket.OPEN && client.roomID==ws.roomID){
                    const data = JSON.stringify({
                        type: "notify",
                        roomID: msg.roomID,
                        username: msg.username,
                        text: `${msg.username} joined the room`
                    })
                    client.send(data)
                }
            })
        }

        if(msg.type=='message'){
            wss.clients.forEach(function each(client){
                if(client.readyState === WebSocket.OPEN && client.roomID === ws.roomID){
                    const data = JSON.stringify({
                        type: "broadcast",
                        roomID: msg.roomID,
                        username: msg.username,
                        text: msg.text,
                        time: new Date(Date.now()).toLocaleString('en-US', {timeStyle: 'short' })
                    })
                    client.send(data);
                }
            })
        }
    });
    
});
