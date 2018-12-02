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



// See the note below about CORS headers.
  var headers = defaultCorsHeaders;
  headers['Content-Type'] = 'application/json';

  var objectIdCounter = 1;
  var messages = [];


//**************************************************************/
var responseHandlers = {

  sendResponse: function(response, data, statusCode) {
    statusCode = statusCode || 200;
    response.writeHead(statusCode, headers);
    response.end(JSON.stringify(data));

  },

  collectData: function(request, callback) {
    var data = '';
    request.on('data', function(chunk) {
      data += chunk;
  });
    request.on('end', function() {
    callback(JSON.parse(data));
    });
  },

  makeActionHandler: function(actionMap) {
    return function(request, response) {
      var action = actionMap[request.method];
       if (action) {
         action(request, response);
       } else {
         responseHandlers.sendResponse(response, 'Not Found', 404);
       }
    }
  }
};

var actions = {
   'GET': function(request, response) {
    responseHandlers.sendResponse(response, {results: messages});
  },
  'POST': function(request, response) {
      responseHandlers.collectData(request, function(message) {
      message.objectId = ++objectIdCounter;
      messages.push(message);
      responseHandlers.sendResponse(response, {objectId: message.objectId}, 201);
    });
  },
  'OPTIONS': function(request, response) {
    responseHandlers.sendResponse(response, null);
  }


}

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

// var exports = module.exports = {};


exports.requestHandler = responseHandlers.makeActionHandler(actions);
