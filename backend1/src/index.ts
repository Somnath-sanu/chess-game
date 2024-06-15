import { WebSocketServer } from "ws";
import { GameManager } from "./GameManager";

const wss = new WebSocketServer({ port: 8080 });

//* Global variable -> gameManager

const gameManager = new GameManager();

wss.on("connection", function connection(ws) {
  gameManager.addUser(ws);

  ws.on("disconnect", () => gameManager.removeUser(ws));

  ws.on("message", (data) => {
    //this data will come as buffer
    console.log(JSON.parse(data.toString()));
  });
});
