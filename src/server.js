const http = require('http');
const { mongoConnect } = require('./services/mongo');

const app = require('./app');

const server = http.createServer(app);

const PORT = process.env.PORT || 5000;

async function startServer() {
  await mongoConnect();
  
  server.listen(PORT, () => {
    console.log(`listening on port ${PORT}...`)
  });
}

startServer();