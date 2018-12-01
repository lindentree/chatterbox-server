/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/
// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.
const url = require('url');
const _ = require('underscore')

var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10 // Seconds.
};

let newMessage;
let database = {results:[]};
let i = 0;
database.results.push({ 
  username: 'Jono', 
  text: 'Do my bidding!',
  objectId : i 
});
//**************************************************************/
var requestHandler = function(request, response) {
let pathname = url.parse(request.url).pathname;

// See the note below about CORS headers.
  var headers = defaultCorsHeaders;
  headers['Content-Type'] = 'application/json';
  // let body = [];
  // request.on('error', (err) => {
  //   console.error(err);
  // }).on('data', (chunk) => {
  //   body.push(chunk);
  // }).on('end', () => {
  //   body = Buffer.concat(body).toString();
    
  //   // at this point, `body` has the entire request body stored in it as a string
  // });
   
  var statusCode;
  
  
  if ( request.url === '/classes/messages' || request.url === 'http://127.0.0.1:3000/classes/messages'){
    if (request.method === 'GET') {
        statusCode = 200;
        response.writeHead(statusCode, headers);
        response.end(JSON.stringify(database));

    } else if(request.method === 'POST'){
        
        request.on('data', data => {
          newMessage = JSON.parse(data.toString());
          i++;
          _.extend(newMessage, {objectId: i});
        }).on('end', () => {
          
          database.results.push(newMessage)
          
          response.writeHead(201, headers);
          response.end(newMessage);
       
        }); 
    } else if (request.method === 'OPTIONS') {
    
        response.writeHead(200, headers);
        response.end('OPTIONS SENT');
      } else {
        response.end('NO METHOD ROUTE FOUND')
  

      }

  } else{
      statusCode = 404;
      response.writeHead(statusCode, headers);
      response.end('404 ERROR')
    }
  
  
  // response.writeHead(statusCode, headers);
  // response.end(JSON.stringify(database));
  // Request and Response come from node's http module.
  //
  // They include information about both the incoming request, such as
  // headers and URL, and about the outgoing response, such as its status
  // and content.
  //
  // Documentation for both request and response can be found in the HTTP section at
  // http://nodejs.org/documentation/api/

  // Do some basic logging.
  //
  // Adding more logging to your server can be an easy way to get passive
  // debugging help, but you should always be careful about leaving stray
  // console.logs in your code.
  console.log('Serving request type ' + request.method + ' for url ' + request.url);

  
  // The outgoing status.
  // statusCode = 200;

  

  // Tell the client we are sending them plain text.
  //
  // You will need to change this if you are sending something
  // other than plain text, like JSON or HTML.

  
  // .writeHead() writes to the request line and headers of the response,
  // which includes the status and all headers.
  // response.writeHead(statusCode, headers);
  // response.end(responseBody);
  
  // Make sure to always call response.end() - Node may not send
  // anything back to the client until you do. The string you pass to
  // response.end() will be the body of the response - i.e. what shows
  // up in the browser.
  //
  // Calling .end "flushes" the response's internal buffer, forcing
  // node to actually send all the data over to the client.
  // response.end(responseBody);
  
  
};

// // These headers will allow Cross-Origin Resource Sharing (CORS).
// // This code allows this server to talk to websites that
// // are on different domains, for instance, your chat client.
// //
// // Your chat client is running from a url like file://your/chat/client/index.html,
// // which is considered a different domain.
// //
// // Another way to get around this restriction is to serve you chat
// // client from this domain by setting up static file serving.
// var defaultCorsHeaders = {
//   'access-control-allow-origin': '*',
//   'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
//   'access-control-allow-headers': 'content-type, accept',
//   'access-control-max-age': 10 // Seconds.
// };

var exports = module.exports = {};


module.exports.requestHandler = requestHandler;
