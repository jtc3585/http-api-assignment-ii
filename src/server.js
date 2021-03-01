const http = require('http');
const url = require('url');
const query = require('querystring');

const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const handlePost = (request, response, parsedUrl) => {
  // addUser is the only POST url
  if (parsedUrl.pathname === '/addUser') {
    const res = response;
    const body = [];

    // error throws a bad request
    request.on('error', (err) => {
      console.dir(err);
      res.statusCode = 400;
      res.end();
    });

    request.on('data', (chunk) => {
      body.push(chunk);
    });

    // end of upload stream
    request.on('end', () => {
    // turns the streamed bytes into a string
      const bodyString = query.parse(Buffer.concat(body).toString());
      jsonHandler.addUser(request, res, bodyString);
    });
  }
};

const onRequest = (request, response) => {
  const parsedUrl = url.parse(request.url);

  if (request.method === 'GET') {
    switch (parsedUrl.pathname) {
      case '/':
        htmlHandler.getIndex(request, response);
        break;

      case '/index':
        htmlHandler.getIndex(request, response);
        break;

      case '/style.css':
        htmlHandler.getCSS(request, response);
        break;

      case '/getUsers':
        jsonHandler.getUsers(request, response);
        break;

      default:
        jsonHandler.notFound(request, response);
        break;
    }
  } else if (request.method === 'HEAD') {
    switch (parsedUrl.pathname) {
      case '/getUsers':
        jsonHandler.getUsersMeta(request, response);
        break;

      default:
        jsonHandler.notFoundMeta(request, response);
        break;
    }
  } else if (request.method === 'POST') {
    handlePost(request, response, parsedUrl);
  }
};

http.createServer(onRequest).listen(port);

console.log(`Listening on 127.0.0.1: ${port}`);
