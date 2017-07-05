const express = require('express');
const morgan = require('morgan');
const blogRouter = require('./blogRouter');
const app = express();

//const router = express.Router();


//const bodyParser = require('body-parser');

//const {BlogPosts} = require('./models');

//const jsonParser = bodyParser.json();




// log the http layer
app.use(morgan('common'));

app.use('/blog-posts' , blogRouter);

let server;

// this function starts our server and returns a Promise.
// In our test code, we need a way of asynchronously starting
// our server, since we'll be dealing with promises there.
function runServer(port=8080) {
  port = process.env.PORT || port;
  console.log(port);
  return new Promise((resolve, reject) => {
    server = app.listen(port, () => {
      console.log(`Your app is listening on port ${port}`);
      resolve(server);
    }).on('error', err => {
      reject(err)
    });
  });
}

// like `runServer`, this function also needs to return a promise.
// `server.close` does not return a promise on its own, so we manually
// create one.
function closeServer() {
  return new Promise((resolve, reject) => {
    console.log('Closing server');
    server.close(err => {
      if (err) {
        reject(err);
        // so we don't also call `resolve()`
        return;
      }
      resolve();
    });
  });
}

if (require.main === module) {
  runServer().catch(err => console.error(err));
};

module.exports = {app, runServer, closeServer};
