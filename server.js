#!/usr/bin/env node

/**
 * https://github.com/BigstickCarpet/swagger-server
 *
 * debug command
 * DEBUG=swagger:* node server.js
 */

// @TODO: Test if it can be used
//
// var jsf = require('json-schema-faker');
//
// jsf.formats('date', function(gen, schema) {
//     return (new Date().toISOString().split("T")[0]);
// });

var path = require('path'),
    swaggerServer = require('swagger-server'),
    server = swaggerServer(path.join(__dirname, 'swagger.yaml')),
    YAML = require('yamljs'),
    fs = require('fs'),
    yamlString = null;

// Load Swagger YAML file
fs.readFile('swagger.yaml', function (err, data) {
  if (err) {
    throw err;
  }

  yamlString = data.toString();
});

// Enable CORS
//
// https://github.com/swagger-api/swagger-ui/issues/146
// http://enable-cors.org/server_expressjs.html
server.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


//  _____                                    _____        _
// |  __ \                                  |  __ \      | |
// | |  | |_   _ _ __ ___  _ __ ___  _   _  | |  | | __ _| |_ __ _
// | |  | | | | | '_ ` _ \| '_ ` _ \| | | | | |  | |/ _` | __/ _` |
// | |__| | |_| | | | | | | | | | | | |_| | | |__| | (_| | || (_| |
// |_____/ \__,_|_| |_| |_|_| |_| |_|\__, | |_____/ \__,_|\__\__,_|
//                                    __/ |
//                                   |___/
//   ____  _     _           _
//  / __ \| |   (_)         | |
// | |  | | |__  _  ___  ___| |_ ___
// | |  | | '_ \| |/ _ \/ __| __/ __|
// | |__| | |_) | |  __/ (__| |_\__ \
//  \____/|_.__/| |\___|\___|\__|___/
//             _/ |
//            |__/


//  _    _      _
// | |  | |    | |
// | |__| | ___| |_ __   ___ _ __ ___
// |  __  |/ _ \ | '_ \ / _ \ '__/ __|
// | |  | |  __/ | |_) |  __/ |  \__ \
// |_|  |_|\___|_| .__/ \___|_|  |___/
//               | |
//               |_|

// [Cloning an Object in Node.js](http://stackoverflow.com/a/15040626)
function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Recursively merge properties of two objects
 * @see [How can I merge properties of two JavaScript objects dynamically?](http://stackoverflow.com/a/383245)
 */
function merge(obj1, obj2) {

  for (var p in obj2) {
    try {

      // Property in destination object set; update its value.
      if (obj2[p].constructor == Object) {
        obj1[p] = merge(obj1[p], obj2[p]);
      } else {
        obj1[p] = obj2[p];
      }

    } catch(e) {

      // Property in destination object not set; create it and set its value.
      obj1[p] = obj2[p];

    }
  }

  return obj1;
}

// http://blog.tompawlak.org/how-to-generate-random-values-nodejs-javascript
function randomIntInc(low, high) {
  return Math.floor(Math.random() * (high - low + 1) + low);
}


//  _____                                    _____             _
// |  __ \                                  |  __ \           | |
// | |  | |_   _ _ __ ___  _ __ ___  _   _  | |__) |___  _   _| |_ ___  ___
// | |  | | | | | '_ ` _ \| '_ ` _ \| | | | |  _  // _ \| | | | __/ _ \/ __|
// | |__| | |_| | | | | | | | | | | | |_| | | | \ \ (_) | |_| | ||  __/\__ \
// |_____/ \__,_|_| |_| |_|_| |_| |_|\__, | |_|  \_\___/ \__,_|\__\___||___/
//                                    __/ |
//                                   |___/

server.get('/api-docs/swagger.json', function(req, res, next) {
  var nativeObject = YAML.parse(yamlString);
  res.send(nativeObject);
  //res.send(req.swagger.swaggerObject);
});

// Server Start
server.listen('8090');
