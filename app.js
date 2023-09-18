// server.js

const WebSocket = require('ws');
const http = require('http');
const express = require('express');
const app = express();

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let count = 0;
let countBlue = 0;

wss.on('connection', (ws) => {
  // Gửi giá trị ban đầu của biến count khi có kết nối mới
  ws.send(JSON.stringify({ count }));
  ws.send(JSON.stringify({ countBlue }));


  ws.on('message', (message) => {
    const data = JSON.parse(message);

    if (data.reset) {
      // Thực hiện hành động "reset" cho đội RED và đội BLUE
      if (data.team === "RED") {
        count = 0;
      } else if (data.team === "BLUE") {
        countBlue = 0;
      }
    } else if (data.team === "RED") {
      // Thực hiện cập nhật cho đội RED
      count = data.count;
    } else if (data.team === "BLUE") {
      // Thực hiện cập nhật cho đội BLUE
      countBlue = data.countBlue;
    }

    console.log("count", count);
    console.log("countblue", countBlue);

    // Gửi giá trị mới của biến count đến tất cả các client
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ count, countBlue }));
      }
    });
  });
});

server.listen(3000, () => {
  console.log('Server is running on port 3000');
});







