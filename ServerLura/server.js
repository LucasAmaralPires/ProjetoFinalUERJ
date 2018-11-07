const http = require('http');
const app = require('./backend/app.js');
const port = 8080;

app.set('port', port);
const server = http.createServer(app);

server.listen(port);


console.log("Server Started. Go to 'localhost:"+ port + "' in your browser.");
