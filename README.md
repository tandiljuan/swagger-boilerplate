Swagger 2.0 Boilerplate
=======================


This is a simple example to start with Swagger 2.0. It consist in a validation
tool and the Swagger-UI to visualize the API.


Current available tools are:

* `npm run validate` To validate the `swagger.yaml` file.
* `npm run server` To create a dummy mock server based in the `swagger.yaml` file.

The server will use two ports: `8090` for the fake REST API and `9090` for
Swagger-UI.

Before to start, don't forget to install all the dependencies

    npm install


Everything has been possible thanks for the following modules:

* [swagger-tools](https://www.npmjs.com/package/swagger-tools)
* [swagger-server](https://www.npmjs.com/package/swagger-server)
* [yamljs](https://www.npmjs.com/package/yamljs)
* [express](http://expressjs.com/)
* [swagger-ui](https://github.com/swagger-api/swagger-ui)
* [json-refs](https://www.npmjs.com/package/json-refs)
