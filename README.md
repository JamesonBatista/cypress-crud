# Cypress-Crud Introduction

## Index

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)

## Structure of the files

- [Guide to building the project](#guide-to-building-the-project)
- [Snippets](#snippets)

## Type of Functions

- [crud](#cycrud)
- [save](#save)
- [bodyResponse](#bodyresponse)
- [response](#response)
- [expects](#expects)
- [schema](#schema)
- [res](#res)
- [validateSchema](#validateschema)
- [write](#write)
- [read](#read)

## Support

- [Type validations](#type-validations)
- [Type save](#type-save)
- [Managing values with Save](#managing-values-with-save)
- [Use Mock](#use-mock)

<br>

### **Prerequisites**

NodeJS must be installed and Cypress must be version 10 or higher for this package to function correctly.

```brash
 NodeJs
 Cypress version 10 >
```

<br>

### **Installation**

To install the package in your Cypress project, use the command

```brash
npm i cypress-crud
```

<br>

### **Configuration**

The CRUD was designed to automatically add dependencies and configurations to the `e2e.js` file and the `cypress.config.js` file, eliminating the need to manually include anything for the library's functionality.

`e2e.js:`

```javaScript
export {
  Scenario,
  Given,
  When,
  And,
  Then,
  Cenario,
  Dado,
  Quando,
  E,
  Entao,
  describes,
  its,
  crudStorage,
  POST,
  GET,
  DELETE,
  PUT,
  PATH,
  Requests,
} from "cypress-crud/src/gherkin/bdd.js";
import "cypress-plugin-steps";
export const faker = require("generate-datafaker");
import "cypress-crud";
import "cypress-plugin-api";
import "cypress-mochawesome-reporter/register";
import spok from "cy-spok";
// export default spok;

// close json file in variable
import _ from "lodash";
export function clone(json) {
  return _.cloneDeep(json);
}
```

`cypress.config.js:`

```javaScript

const { defineConfig } = require("cypress");

module.exports = defineConfig({
  reporter: "cypress-mochawesome-reporter",

  e2e: {
    setupNodeEvents(on, config) {
      // reporter: "cypress-mochawesome-reporter",

      require("cypress-mochawesome-reporter/plugin")(on);
      on("task", {
        crudLog(message) {
          console.log(message);
          return null;
        },
      });
      // adjust to print size
      on("before:browser:launch", (browser, launchOptions) => {
        if (browser.family === "chromium" && browser.name !== "electron") {
          launchOptions.args.push("--window-size=1500,1200");
        }
        if (browser.name === "electron") {
          launchOptions.preferences.width = 1500;
          launchOptions.preferences.height = 1200;
        }
        if (browser.family === "firefox") {
          launchOptions.args.push("--width=1500");
          launchOptions.args.push("--height=1200");
        }
        return launchOptions;
      });
    },
    testIsolation: false, //  in e2e:{}
    experimentalRunAllSpecs: true, // in e2e:{}
    env: {
      // in e2e:{}
      screenshot: false, // required true, for active screenshot
      visualPayloads: false,
      crudStyles: true // active styles crud designer
  //   environment: "QA", // change environment
  //   QA: {
  //     getUser: "https://reqres.in/api/users",
  //   },
  //   DEV: {
  //     getUser: "https://reqres.in/api/users/2",
  //   },
  //   PROD: {
  //     getUser: "https://reqres.in/api/users/2",
  //   },
    },
  },
});
```

- ### **_interface_**

A graphical interface has been designed to enhance user experience. By default, the `cypress-plugin-api` interface is used, but there's also an option for `visualPayloads`. Switching between them only requires a minor configuration adjustment.

- `cypress-plugin-api`: default

![Demonstração do recurso](https://raw.githubusercontent.com/filiphric/cypress-plugin-api/HEAD/images/demo.gif)

- `visualPayloads`: To enable the option, simply add `visualPayloads: true` to the `cypress.config.js` file.

```javaScript
    env: {
      // in e2e:{}
      screenshot: false, // required true, for active screenshot
      visualPayloads: true,
      crudStyles: true // active styles crud designer
  //   environment: "QA", // change environment
  //   QA: {
  //     getUser: "https://reqres.in/api/users",
  //   },
  //   DEV: {
  //     getUser: "https://reqres.in/api/users/2",
  //   },
  //   PROD: {
  //     getUser: "https://reqres.in/api/users/2",
  //   },
    },
```

- ### **_Enviroment_**
  Environment configuration within cypress.config.js allows you to set specific environment variables for different testing contexts such as QA (Quality Assurance), DEV (Development) and PROD (Production). These variables can be used to change the behavior of tests or to provide environment-specific data without having to change the test code.

`Example:` If you have a getUser variable that needs to point to different URLs depending on the environment in which the tests are running, you can configure these URLs within the QA, DEV, and PROD sections of the environment configuration. Then, when creating the JSON, just pass the variable corresponding to the url.

**cypress.config.js:**

```javaScript
    env: {
    environment: "QA", // change environment
    QA: {
      getUser: "https://reqres.in/api/users",
    },
    DEV: {
      getUser: "https://reqres.in/api/users/2",
    },
    PROD: {
      getUser: "https://reqres.in/api/users/2",
    },
    },
```

**JSON Fixtures:**

```json
{
  "request": {
    "method": "GET",
    "url": "getUser"
  }
}
```

Another way is `endpoint` in JSON, which was created to facilitate the identification and access to specific points of the API, optimizing the configuration and execution of tests.

`Example:` Including the `endpoint` variable in the fixtures JSON allows automatic concatenation of this with the base URL in tests, simplifying the reference to different API endpoints.

```json
{
  "endpoint": "getUser",
  "request": {
    "method": "POST",
    "url": "https://reqres.in/api/users/2",
    "headers": {
      "Content-Type": "application/json"
    }
  }
}
```

- ### **_Report_**

To generate the report, the tests must be executed in `run` mode. Furthermore, to include screenshots of the request payload in the report, a specific configuration needs to be adjusted in the `cypress.config.js` file and in your `test` file.

`cypress.config.js:` To activate the option, simply add `screenshot: true`

```javascript
    env: {
      // in e2e:{}
      screenshot: true, // required true, for active screenshot
      visualPayloads: false,
      crudStyles: true // active styles crud designer
  //   environment: "QA", // change environment
  //   QA: {
  //     getUser: "https://reqres.in/api/users",
  //   },
  //   DEV: {
  //     getUser: "https://reqres.in/api/users/2",
  //   },
  //   PROD: {
  //     getUser: "https://reqres.in/api/users/2",
  //   },
    },
```

`File test:` Pass afterEach

```javaScript
    afterEach(() => {
    cy.crudScreenshot();
  });
```

<br>

### **Guide to building the project**

For your project setup, you need to create a JSON file inside the `Fixtures` folder. This file can be placed directly in the folder or within a subfolder for better organization according to your project's needs.

`Example path:` Fixtures/Token/createToken.json

```json
{
  "request": {
    "method": "GET",
    "url": "https://reqres.in/api/users/2",
    "body": null,
    "qs": null,
    "headers": {
      "Content-Type": "application/json"
    }
  }
}
```

Or in your test file

```javascript
let obj = {
  request: {
    method: "GET",
    url: "https://reqres.in/api/users/2",
    body: null,
    qs: null,
    headers: {
      "Content-Type": "application/json",
    },
  },
};
```

<br>

Once your JSON file is set up, you can simply invoke the `cy.crud` function in your test file to make the request.

`Observation:` If your JSON file is located in the 'fixtures' folder, simply specify the path including the name of the subfolder and the JSON file to access it.

```javascript
cy.crud({ payload: "examples/jsonExamples" });
```

`Observation:` If your JSON file is outside the 'fixtures' folder, it is necessary to use the import statement.

```javascript
import json from "../examples/jsonExamples";

cy.crud({ payload: json });
```

<br>

### **Snippets**

A snippet has been created to streamline the test construction process.

- crud

```javascript
cy.crud({ payload: "" });
```

- .save

```javascript
.save({path:''})
```

- .bodyResponse

```javascript
.bodyResponse({path:''})
```

- .resp

```javascript
.response({path:''})
```

- .expects

```javascript
.expects({path:''})
```

- .schema

```javascript
.schema({schema:''})
```

- scenario

```javascript
Scenario("", function () {}, {});
```

- given

```javascript
Given("", function () {}, {});
```

- when

```javascript
when("", function () {}, {});
```

- and

```javascript
And("", function () {}, {});
```

- then

```javascript
Then("", function () {}, {});
```

- cenario

```javascript
Cenario("", function () {}, {});
```

- dado

```javascript
Dado("", function () {}, {});
```

- quando

```javascript
Quando("", function () {}, {});
```

- e

```javascript
E("", function () {}, {});
```

- entao

```javascript
Entao("", function () {}, {});
```

- post

```javascript
POST("", function () {});
```

- get

```js
GET("", function () {});
```

- delete

```javascript
DELETE("", function () {});
```

- put

```javascript
PUT("", function () {});
```

- PATH

```js
PATH("", function () {});
```

- test_bdd

```javascript
import { Given, Scenario, faker, When, And, Then } from "../support/e2e";
Scenario("", function () {
  before(() => {
    cy.visit("");
  });
  Given("", function () {}, {});
});
```

- test_des_its

```javascript
import { faker, clone, crudStorage } from "../support/e2e";
describe("", function () {
  GET("", function () {});
});
function rescue_save(params) {
  if (params) {
    return crudStorage.save[params];
  }
  return crudStorage.save;
}
```

- test_crud_generate

```javascript
import { faker, clone, crudStorage, POST, GET, Requests } from "../support/e2e";
Requests("", function () {
  GET("", function () {});
});
function rescue_save(params) {
  if (params) {
    return crudStorage.save[params];
  }
  return crudStorage.save;
}
```

- test_bdd_BR

```javascript
import { Dado, Cenario, faker, Quando, E, Entao } from "../support/e2e";
Cenario("", function () {
  before(() => {
    cy.visit("");
  });
  Dado("", function () {}, {});
  Quando("", function () {}, {});
  E("", function () {}, {});
  Entao("", function () {}, {});
});
```

<br>

### **Use JSON**

During requests, if your JSON file starts with some CRUD (get_, post_ delete_, put_, path_), get_allUsers.json, etc.
In your JSON file, you don't need to use method.

**Before:**
```json
{
	"req":{
		"method":"GET", // POST, DELETE, PUT, PATH,
		"url":"http....."
	}
}
```

**After:**
```json
// get_AllUsers.json get_idUser.json ...
{
	"req":{
		"url":"http....."
	}
}
```
### **cy.crud**

The `cy.crud` function facilitates making requests with a specific payload and assessing the response.

`Example:`

```javaScript
     cy.crud({ payload: "examples/jsonEndpoint" });
```

<br>

### **save**

The 'save' method reserves a value inserted to be used in the future when requested.

`Example:`

```javaScript
cy.crud({ payload: "token/createToken.json" }).save({ path: "name" });

console.log("storage", crudStorage.save.name);
```

`explanation:` Saves the value 'name' in crudStorage

Another way to use save is by passing aliases, providing an alternative name for a stored value, simplifying its reference and usage in your test code.

```javaScript
cy.crud({ payload: "token/createToken.json" }).save({ path: "name", alias: "user_name" });

console.log('storage', crudStorage.save.user_name)
```

<br>

### **bodyResponse**

The `bodyResponse` function is used to check if the response body contains a specific value at a given path.

```javaScript
cy.crud({ payload: "token/createToken.json" }).bodyResponse({path: "name", eq:"Jam Batista"})
```

<br>

### **response**

The `response` function performs the same task as the `bodyResponse` function, i.e., it checks if the response body contains a specific value at a given path.

```javaScript
cy.crud({ payload: "token/createToken.json" }).response({path: "name", eq:"Jam Batista"})
```

<br>

### **expects**

The `expects` function performs the same task as the previous functions, i.e., it checks if the response body contains a specific value at a given path.

```javaScript
cy.crud({ payload: "token/createToken.json" }).expects({path: "name", eq:"Jam Batista"})
```

<br>

### **schema**

The `schema` function performs the same task as the `validateSchema` command. It ensures that the response of a request adheres to the criteria specified in a particular JSON schema. This validation helps confirm whether the returned structure and data align with the expectations defined in the test.

```javaScript
 cy.crud({ payload: "examples/jsonNotAlias" }).schema({schema: "jsonSchema",});
```

<br>

### **res**

The `res` function serves the same purpose as the `response` command. It validates if the response body contains a specific value at a given path. This validation is crucial for ensuring that the response meets the expected criteria defined in the test.

```javaScript
  cy.crud({ payload: put }).res({ path: 'job' }, { path: 'name' })
```

<br>

### **validateSchema**

The `validateSchema` command is used to ensure that the response of a request meets the criteria defined in a specific JSON schema. This is useful for verifying if the returned structure and data are correct according to the test expectations.

```javaScript
  cy.crud({ payload: "examples/jsonNotAlias" }).validateSchema({schema: "jsonSchema",});
```

<br>

### **write**

This function is used to write data to a JSON file in the Cypress fixtures directory. It creates a JSON file with the provided data from the specified request response. This is useful for generating simulated response files for testing purposes.

```javaScript
cy.crud({ payload: "token/createToken.json" }).write({ path: "user/getUser" });
```

`explanation:` create json response in cypress/fixtures/user

<br>

### **read**

This function is used to read data from a JSON file in the Cypress fixtures directory. It reads the content of the specified JSON file and makes it available for use in the test

```javaScript
cy.crud({ payload: "token/createToken.json" }).read({ path: "user/getUser" });

cy.read({ path: "user/getUser" }).then((json) => {
  console.log(json);
});
```

`explanation:` read json response in cypress/fixtures/user

<br>

### **Type Validations**

There are two ways to perform validations: `within the test file` and `within the JSON file`. Both are designed to facilitate the construction process.

- `JSON Validation fixtures:` After creating the JSON, you can use either the 'validation' or 'expects' key:

```json
{
  "request": {
    "method": "GET",
    "url": "https://reqres.in/api/users/2",
    "body": null,
    "qs": null,
    "headers": {
      "Content-Type": "application/json"
    }
  },
  "validation": [{ "path": "status", "eq": 200 }, { "path": "first_name" }, ...],

  //Or To validate just one field

  "validation":{ "path": "status", "eq": 200 },

  // Or validate the field with two values

  "validation":{ "path": "name", "eq": "Jam || Batista" }

}
```

OR

```json
{
  "request": {
    "method": "GET",
    "url": "https://reqres.in/api/users/2",
    "body": null,
    "qs": null,
    "headers": {
      "Content-Type": "application/json"
    }
  },
  "expects": [{ "path": "status", "eq": 200 }, { "path": "first_name" }, ...],

  //Or To validate just one field

  "expects":{ "path": "status", "eq": 200 },

  // Or validate the field with two values

  "expects":{ "path": "name", "eq": "Jam || Batista" }
}
```

OR

```json
{
  "request": {
    "method": "GET",
    "url": "https://reqres.in/api/users/2",
    "body": null,
    "qs": null,
    "headers": {
      "Content-Type": "application/json"
    }
  },
  "expect": [{ "path": "status", "eq": 200 }, { "path": "first_name" }, ...],

  //Or To validate just one field

  "expect":{ "path": "status", "eq": 200 },

  // Or validate the field with two values

  "expect":{ "path": "name", "eq": "Jam || Batista" }
}
```

OR

```json
{
  "request": {
    "method": "GET",
    "url": "https://reqres.in/api/users/2",
    "body": null,
    "qs": null,
    "headers": {
      "Content-Type": "application/json"
    }
  },
  "response": [{ "path": "status", "eq": 200 }, { "path": "first_name" }, ...],

  //Or To validate just one field

  "response":{ "path": "status", "eq": 200 },

  // Or validate the field with two values

  "response":{ "path": "name", "eq": "Jam || Batista" }
}
```

OR

```json
{
  "request": {
    "method": "GET",
    "url": "https://reqres.in/api/users/2",
    "body": null,
    "qs": null,
    "headers": {
      "Content-Type": "application/json"
    }
  },
  "res": [{ "path": "status", "eq": 200 }, { "path": "first_name" }, ...],

  //Or To validate just one field

  "res":{ "path": "status", "eq": 200 },

  // Or validate the field with two values

  "res":{ "path": "name", "eq": "Jam || Batista" }
}
```

OR

```json
{
  "request": {
    "method": "GET",
    "url": "https://reqres.in/api/users/2",
    "headers": {
      "Content-Type": "application/json"
    }
  },
  "checks": [{ "path": "status", "eq": 200 }, { "path": "first_name" }, ...],

  //Or To validate just one field

  "checks":{ "path": "status", "eq": 200 },

  // Or validate the field with two values

  "checks":{ "path": "name", "eq": "Jam || Batista" }
}
```

OR

```json
{
  "request": {
    "method": "GET",
    "url": "https://reqres.in/api/users/2",
    "headers": {
      "Content-Type": "application/json"
    }
  },
  "check": [{ "path": "status", "eq": 200 }, { "path": "first_name" }, ...],

  //Or To validate just one field

  "check":{ "path": "status", "eq": 200 },

  // Or validate the field with two values

  "check":{ "path": "name", "eq": "Jam || Batista" }
}
```

- `Test Validation:` The bodyResponse, response, res, and expects functions are responsible for this:

```javaScript
cy.crud({ payload: "token/createToken.json" }).bodyResponse({path: "name", eq:"Jam Batista"})
cy.crud({ payload: "token/createToken.json" }).response({path: "name", eq:"Jam Batista"})
cy.crud({ payload: "token/createToken.json" }).expects({path: "name", eq:"Jam Batista"})
cy.crud({ payload: "token/createToken.json" }).res({ path: 'job' }, { path: 'nam' })
```

- `Validation type - file Test:` You can use this option to validate the nature of the field, whether it's an Object, a Number, a String, etc.

```javaScript
cy.crud({ payload: "token/createToken.json" }).bodyResponse({path: "name", type:"string"})
cy.crud({ payload: "token/createToken.json" }).response({path: "value", eq: 1, type: "number"})
cy.crud({ payload: "token/createToken.json" }).expects({path: "enterprise", type: "object"})
cy.crud({ payload: "token/createToken.json" }).res({ path: "users", type: "array" })
```

OR

- `Validation type - JSON fixtures:` You can use this option to validate the nature of the field, whether it's an Object, a Number, a String, etc.

```json
{
  "request": {
    "method": "GET",
    "url": "https://reqres.in/api/users/2",
    "body": null,
    "qs": null,
    "headers": {
      "Content-Type": "application/json"
    }
  },
  "validation": [{ "path": "name", "type": "string" }],
  // OR

  "expects": [{ "path": "value", "eq": 1, "type": "number" }],

  // OR

  "expect": [{ "path": "value", "eq": 1, "type": "number" }],

  // OR

  "response": [{ "path": "enterprise", "type": "object" }],

  // OR

  "res": [{ "path": "users", "type": "array" }],

  // OR

  "checks": [{ "path": "name", "type": "string" }],

  // OR

  "check": [{ "path": "value", "eq": 1, "type": "number" }]
}
```

Another validation method introduced is the `search` for specific values, this way saves this value automatically, but to save it with a specific value, just pass the **alias**, or **as**.

```json
{
  "request": {
    "method": "GET",
    "url": "https://reqres.in/api/users",
    "headers": {
      "Content-Type": "application/json"
    }
  },
  "validation": [{ "search": "Jam" }, { "search": 200, "alias": "value" }],
  //OR
  "expects": [{ "search": "Jam" }, { "search": 200, "as": "status_code" }],
  //OR
  "expect": [{ "search": "Jam" }, { "search": 200 }],
  //OR
  "response": [{ "search": "Jam" }, { "search": 200 }],
  //OR
  "res": [{ "search": "Jam" }, { "search": 200 }],
  //OR
  "checks": [{ "search": "Jam" }, { "search": 200 }],
  //OR
  "check": [{ "search": "Jam" }, { "search": 200 }]
}
```

<br>

### **Type save**

The `save` is used to Store the provided value so that it can be retrieved and used later as required.

- `File Test:` The value located at the path specified by the `path` parameter, in this case, "access_token", is retrieved and assigned the name "bearer_token" via the `alias`. This procedure ensures that the "access_token" value can be accessed and used later in the code under the name "bearer_token".

```javaScript
cy.crud({ payload: "token/createToken.json" }).save({ path: "access_token", alias: "bearer_token" // OR as: "bearer_token"});
```

- `JSON fixtures:` The value located in the path defined by the `save` parameter, here being "access_token".

```json
{
  "request": {
    "method": "GET",
    "url": "https://reqres.in/api/users",
    "body": null,
    "qs": null,
    "headers": {
      "Content-Type": "application/json"
    },
    "save": { "path": "access_token" },
    "save": { "path": "access_token", "as": "token" }


  }
}
```

- `Search option:` By using the `search` command to locate the desired field, you can choose to save it with a specific value by employing the term 'alias'.

`JSON fixtures:`

Inside the JSON file located in the fixtures

```json
{
  "request": {
    "method": "GET",
    "url": "https://reqres.in/api/users",
    "headers": {
      "Content-Type": "application/json"
    }
  },
  "validation": [{ "search": "access_token", "alias": "bearer_token" // OR as: "bearer_token" }],
  //OR
  "expects": [{ "search": "access_token", "alias": "bearer_token" }],
  //OR
  "expect": [{ "search": "access_token", "alias": "bearer_token" }],
  //OR
  "response": [{ "search": "access_token", "alias": "bearer_token" }],
  //OR
  "res": [{ "search": "access_token", "alias": "bearer_token" }],
  //OR
  "checks": [{ "search": "access_token", "alias": "bearer_token" }],
  //OR
  "check": [{ "search": "access_token", "alias": "bearer_token" }]
}
```

`File Test`

creating variable

```javaScript
let payload = {
  request: {
    method: "GET",
    url: "https://reqres.in/api/users",
    headers: {
      "Content-Type": "application/json"
    }
  },

  validation: [{search: "access_token", alias: "bearer_token"}],
  //OR
  expects: [{search: "access_token", alias: "bearer_token"}],
  //OR
  expect: [{search: "access_token", alias: "bearer_token"}],
  //OR
  response: [{search: "access_token", alias: "bearer_token"}],
  //OR
  res: [{search: "access_token", alias: "bearer_token"}],
  //OR
  checks: [{search: "access_token", alias: "bearer_token"}],
  //OR
  check: [{search: "access_token", alias: "bearer_token"}]
}
```

validation method

```javaScript
cy.crud({payload: "examples/jsonExamples"}).bodyResponse({search: "access_token", alias: "bearer_token"})

// OR

cy.crud({payload: "examples/jsonExamples"}).response({search: "access_token", alias: "bearer_token"})

// OR

cy.crud({payload: "examples/jsonExamples"}).expects({search: "access_token", alias: "bearer_token"})

//OR

cy.crud({payload: "examples/jsonExamples"}).res({search: "access_token", alias: "bearer_token"})
```

<br>

### **Managing values with Save**

To reuse the values ​​stored in other requests, simply reference the `path` in the JSON file within the fixtures, using the value associated with the `alias`. If an `alias` was not specified, the values ​​can be accessed directly using whatever is passed in `path` or `search`.

`Example 1°:` In the previous example, we used the `search` and `path` parameters to locate the **access_token** value, which was then stored under the name **bearer_token** using the **alias** parameter. In the following example, we will demonstrate how this stored value is utilized in the `Authorization`. Furthermore, we use replace to adapt and apply the value to other variables, enabling flexible manipulation of this data in different contexts of the request.

```json
{
  "request": {
    "method": "POST",
    "url": "https://reqres.in/api/users",
    "replace": "bearer_token",
    "headers": {
      "Content-Type": "application/json",
      "Authorization": "Bearer bearer_token"
    }
  }
}
```

`Example 2°:` For scenarios such as appending a value to the URL being passed, simply include the `path` variable and the value assigned to **alias** or use the value specified in `search` and `path`.

```json
{
  "request": {
    "method": "POST",
    "url": "https://reqres.in/api/users",
    "path": "bearer_token",
    "headers": {
      "Content-Type": "application/json"
    }
  }
}
```

Alternatively, in situations where it is necessary to concatenate the stored value with another value to be passed simultaneously, you can simply use `/` for concatenation. In the following example, the value is stored in the `id` key, but the request also requires the `city` to complete. To achieve this, the `city` is concatenated with the id value stored in the path, as shown below:

```json
{
  "request": {
    "method": "POST",
    "url": "https://reqres.in/api/users",
    "path": "id/city",
    "headers": {
      "Content-Type": "application/json"
    }
  }
}

//exit example -> https://reqres.in/api/users/123456789/city
```

`Example 3°:` For situations requiring validation of the value stored in the `alias` or specified in the `search` and `path`, In the example below, a value has been stored under the key **user**, eliminating the need to pass the value itself—only the key is required.

```json
{
  "request": {
    "method": "POST",
    "url": "https://reqres.in/api/users",
    "replace": "user", // Specifies the key 'user' for replacement
    "headers": {
      "Content-Type": "application/json"
    }
  },
  "validation": [{ "path": "name_user", "eq": "user" }],
  //OR
  "expects": [{ "path": "name_user", "eq": "user" }],
  //OR
  "expect": [{ "path": "name_user", "eq": "user" }],
  //OR
  "response": [{ "path": "name_user", "eq": "user" }],
  //OR
  "res": [{ "path": "name_user", "eq": "user" }],
  //OR
  "checks": [{ "path": "name_user", "eq": "user" }],
  //OR
  "check": [{ "path": "name_user", "eq": "user" }]
}
```

<br>

### **Use Mock**

For requests that require a mock, simply specify the `mock` variable and provide the path to where the mock is stored.

`Example:` The file can be found in fixtures in the **mocks** folder, called **json_mock**.

```json
{
  "request": {
    "method": "GET",
    "url": "https://demo0065046.mockable.io/",
    "mock": "mocks/json_mock",
    "headers": {
      "Content-Type": "application/json"
    }
  }
}
```

`Mock construction:`

- **Incorporating the complete field structure in the body:**

```json
{
  "intercept": {
    "method": "GET",
    "url": "/users/2"
  },
  "response": {
    "status": 200,
    "body": {
      "users": [
        {
          "name": "Alice",
          "enterprise": "AcmeCorp",
          "access_code": "AC1234"
        }
      ]
    },
    "headers": { "Content-Type": "application/json" }
  }
}
```

- **Specify the path in the body of the request to reference the structure of the fields:**

```json
{
  "intercept": {
    "method": "GET",
    "url": "/users/2"
  },
  "response": {
    "status": 200,
    "body": "mocks/json_structure_mock",
    "headers": { "Content-Type": "application/json" }
  }
}
```

In this example, the `body` field directs to the mock file located in the `mocks` folder, which contains the predefined structure of the fields to be returned in the response.

`Validate mock:` To validate the mock, you can simply include the checks in the **JSON** file itself or embed them in the **test** file.

- `JSON fixtures`

```json
{
  "request": {
    "method": "GET",
    "url": "https://demo0065046.mockable.io/",
    "mock": "mocks/json_mock",
    "headers": {
      "Content-Type": "application/json"
    }
  },

  "validation": [{ "path": "name", "eq": "Alice" }],
  //OR
  "expects": [{ "path": "name", "eq": "Alice" }],
  //OR
  "expect": [{ "path": "name", "eq": "Alice" }],
  //OR
  "response": [{ "path": "name", "eq": "Alice" }],
  //OR
  "res": [{ "path": "name", "eq": "Alice" }],
  //OR
  "checks": [{ "path": "name", "eq": "Alice" }],
  //OR
  "check": [{ "path": "name", "eq": "Alice" }]
}
```

- `file test:`

```javaScript
cy.crud({ payload: "jsonMock.json" }).bodyResponse({path: "name", eq:"Alice"})
  //OR
cy.crud({ payload: "jsonMock.json" }).response({path: "name", eq:"Alice"})
  //OR
cy.crud({ payload: "jsonMock.json" }).expects({path: "name", eq:"Alice"})
  //OR
cy.crud({ payload: "jsonMock.json" }).res({ path: 'name', eq:"Alice" })
```

<br>

## **Authors and Contributors**

This project is the collaborative effort of Jameson Batista and Gabriel Lopes. We are proud to share our work with the community and hope it can inspire and assist other developers.

For tips, inquiries, or just to connect, follow us on LinkedIn:

- LinkeIn [Jam Batista](https://www.linkedin.com/in/jam-batista-98101015b/)
- LinkeIn [Gabriel Lopes](https://www.linkedin.com/in/gabriel-lopes-500b71269/)
