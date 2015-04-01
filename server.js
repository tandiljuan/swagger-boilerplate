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

var SWAGGER_UI_PORT = '9090',
    SWAGGER_SERVER_PORT = '8090';

var path = require('path'),
    swaggerServer = require('swagger-server'),
    server = swaggerServer(path.join(__dirname, 'swagger.yaml'));

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


//  ____
// / ___|  ___ _ ____   _____ _ __
// \___ \ / _ \ '__\ \ / / _ \ '__|
//  ___) |  __/ |   \ V /  __/ |
// |____/ \___|_|    \_/ \___|_|

/**
 * Create another Express server to handle Swagger-UI
 * in a different port.
 *
 * @see [How can I configure expressjs to handle both http and https?](http://stackoverflow.com/a/11035677)
 * @see [Serving files from multiple directories](http://expressjs.com/4x/api.html#router.use)
 * @see [Render basic HTML view in Node JS Express?](http://stackoverflow.com/a/6437629)
 */
var http = require('http'),
    express = require('express'),
    app = express(),
    jsRefs = require('json-refs'),
    YAML = require('yamljs'),
    fs = require('fs');

app.get('/', function(req, res, next) {
  res.redirect('/api-docs');
});

app.use(express.static(__dirname + '/node_modules/swagger-ui/dist/'));
app.use(express.static(__dirname + '/node_modules/swagger-ui/dist/css'));
app.use(express.static(__dirname + '/node_modules/swagger-ui/dist/fonts'));
app.use(express.static(__dirname + '/node_modules/swagger-ui/dist/images'));
app.use(express.static(__dirname + '/node_modules/swagger-ui/dist/lib'));

app.get('/api-docs', function(req, res, next) {
  fs.readFile(__dirname + '/node_modules/swagger-ui/dist/index.html', 'utf8', function(err, text){
      text = text.replace(
          'url = "http://petstore.swagger.io/v2/swagger.json";',
          'url = "http://' + req.hostname + ':' + SWAGGER_UI_PORT + '/api-docs/swagger.json";'
          );
      res.send(text);
  });
});

app.get('/api-docs/swagger.json', function(req, res, next) {

  // Load Swagger YAML file
  fs.readFile('swagger.yaml', function (err, data) {

    if (err) throw err;

    // Parse YAML and get JSON
    var nativeObject = YAML.parse(data.toString()),
        // Temporal `definitions` object
        definitions = {};

    // Iterate `definitions` objects to clean `allOf` references
    for (var key in nativeObject.definitions) {

        // Ignore object without `allOf` references
        if (nativeObject.definitions[key].allOf === undefined) {
          definitions[key] = nativeObject.definitions[key];
          continue;
        }

        // Process `allOf` references and combine them
        var object = {};
        for (var i in nativeObject.definitions[key].allOf) {

          var path = jsRefs.pathFromPointer(nativeObject.definitions[key].allOf[i]['$ref']),
              object2 = nativeObject;

          // Get object from reference
          for (var j in path) {
            object2 = object2[path[j]];
          }

          // Combine referenced objects
          object = merge(object, object2);
        }

        definitions[key] = object;
    }

    // Replace `definitions` with processed objects
    nativeObject.definitions = definitions;

    // Replace Host
    nativeObject.host =  req.hostname + ':' + SWAGGER_SERVER_PORT;

    // Replace Schemes
    nativeObject.schemes = ['http']

    res.send(nativeObject);
  });
});

// Servers Start
http.createServer(app).listen(SWAGGER_UI_PORT);
server.listen(SWAGGER_SERVER_PORT);
