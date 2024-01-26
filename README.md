# cypress-crud

![cypress](https://img.shields.io/badge/cypress.crud-1.8.1-brightgreen)
![cypress](https://img.shields.io/badge/cypress-13.6.0-brightgreen)
![generate-datafaker](https://img.shields.io/badge/datafaker-1.0.2-yellow)

> ## generate-datafaker

[generate-datafaker](https://www.npmjs.com/package/generate-datafaker)

### Required

```bash
 NodeJs
 Cypress version 10 >
```

## Installation

**To install the package, run the following command in your Cypress project:**

```bash
npm i cypress-crud
```

## Use Snippets in cy.action

1. test_bdd<br>
1. test_action<br>
1. test_bdd_BR<br>
1. scenario<br>
1. given<br>
1. when<br>
1. and<br>
1. then<br>
1. cenario<br>
1. dado<br>
1. quando<br>
1. e<br>
1. entao<br>

<br>

## Settings

_**cy.crud automatically adds dependencies to the project in e2e.js file**_
<br>

```javascript
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
} from "cypress-crud/src/gherkin/bdd.js";
import "cypress-plugin-steps";
export const faker = require("generate-datafaker");
import "cypress-crud";
import "cypress-plugin-api";
import "cypress-mochawesome-reporter/register";
```

# Use

🚩 **create a json in the fixtures folder, which can be inside a subfolder "fixtures/token/createToken.json"**

```javascript
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

 cy.crud({ payload: "requests/createToken.json" }) // save response in crudStorage.alias.bodyResponse
 cy.crud({ payload: "requests/createToken.json", alias:"body" }) // save response in crudStorage.alias.body
```

Or

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

cy.crud({ payload: obj });
```

# cy.crud whit endpoint param

```javascript
{
  "request": {
    "method": "GET",
    "url": "https://reqres.in/api/users/2",
    "path": "save" // or alias defined in save({path:"id", alias: "id_user"})
    "body": null,
    "qs": null,
    "headers": {
      "Content-Type": "application/json"
    }
  }
}
```

# Use in different environments

### in cypress.config.js

```javascript
        env: {
            environment: "QA", // modify env for DEV or PROD
            QA: {
             getUser: "https://reqres.in/api/users?page=2",
             },
            DEV: {
                getUser: "https://reqres.in/api/users?page=2"
            },
            PROD: {
                getUser: "https://reqres.in/api/users?page=2"
            },
        }


        in JSON

        {
        "endpoint": "getUser", // endpoint modify for path in env
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

# Use whit validations

💻 **with validations you just need to inform the path and the value, regardless of which part of your JSON it is.**

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
  "validation": [{ "path": "status", "value": 200 }, { "path": "first_name" }, ...]
}
OR

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
  "expects": [{ "path": "status", "value": 200 }, { "path": "first_name" }, ...]
}
```

# .bodyResponse()

💻 **If you don't want to use validations directly in JSON, you can use .bodyResponse to validate the return.**

```javascript
cy.crud({ payload: "token/createToken.json" })
.bodyResponse({path: "name", eq:"Jam Batista"})
// .bodyResponse({path: "name""})

code hiden bodyResponse

  expect(search).to.exist;
  if (equal) {
    expect(search).to.eql(eq);
  }
  return expect(search);

```

# .save()

💻 **save will set aside a value entered to be used in the future when you request it.**

```javascript
cy.crud({ payload: "token/createToken.json" }).save({ path: "name" }); // save name in crudStorage
// .save({path:"name", alias: "user_id"}) // save name in crudStorage whit new alias

console.log("storage", crudStorage.save.save);
// console.log('storage', crudStorage.save.user_id)
```

## get data in .save()

```javascript

// .save({path:"name"})
    cy.save({ log: false }).then((rescue) => {
      expect(rescue).to.eql("Weaver");
    });
  });


  // .save({path:"name", alias:"name"})
    cy.save({ log: false , alias:"name"}).then((rescue) => {
      expect(rescue).to.eql("Weaver");
    });
  });


OR

   console.log('save',  crudStorage.save.save)
```

# .write()

💻 **Uses cy.writeFile requirements**

```javascript
cy.crud({ payload: "token/createToken.json" }).write({ path: "user/getUser" }); // create json response in cypress/fixtures/user
```

# .read()

💻 **Uses cy.writeFile requirements**

```javascript
cy.crud({ payload: "token/createToken.json" }).read({ path: "user/getUser" }); // read json response in cypress/fixtures/user

cy.read({ path: "user/getUser" }).then((json) => {
  console.log(json);
});
```

# Use by inheritance

```javascript

        it('Generate access_token', ()=>{

           cy.crud({ payload: "requests/getUser" })
            .save({ path: "access_token", alias: "token" }); // save token in alias token
        })


        🖥 in another file or in the same test

        let json require('../fixtures/requests/createToken.json')
        let data = {...json};

        it('Get token in use headers', ()=>{

            data.request.headers = {Authorization: `Bearer ${crudStorage.save.token}`}
            cy.crud({ payload: data })
            .bodyResponse({path: "status", equal: 201})
            .bodyResponse({path: "name", equal:"Jam"})
            .save({ path: "data"})
            .write({ path: "user/getUser" });

        })

```

# Examples:

```javascript
const { crudStorage } = require("../support/e2e");

describe("template spec", () => {
  it("Example simple requisition", () => {
    cy.crud({ payload: "examples/jsonNotAlias" }).save({ path: "id" });
    // validation JSON path validations:[]
  });
  it("Example simple requisition return array", () => {
    cy.crud({ payload: "examples/jsonGetArray" }).then((response) => {
      for (let items of response.body?.data) {
        expect(items.id).to.exist;
        if (items.id == 7) crudStorage.save.id_Seven = items.id;
      }
    });
  });
  it("Example whit .bodyResponse", () => {
    cy.crud({ payload: "examples/jsonNotAlias" }).bodyResponse({
      path: "last_name",
      eq: "Weaver",
    });
  });

  it("Example whit  .save", () => {
    cy.crud({ payload: "examples/jsonNotAlias" }).save({ path: "id" }); // or save({path:'id', log: false}) // save id 7
  });

  it("Example whit .save and .write, create JSON response in", () => {
    cy.crud({ payload: "examples/jsonNotAlias" })
      .save({ path: "id" }) // or save({path:'id', log: false})
      .write({ path: "user/user" }); // save in fixtures/user/user.json .write() // save in fixtures/response.json
  });

  it("Example whit  .save", () => {
    cy.crud({ payload: "examples/jsonNotAlias" }).save({ path: "id" }); // or save({path:'id', log: false})
  });

  it("Example use JSON whit alias, rescue save", () => {
    /** {
    "request": {
      "method": "GET",
      "url": "https://reqres.in/api/users/2",
      "path": "save",
      "body": null,
      "qs": null,
      "headers": {
        "Content-Type": "application/json"
      }
    },
    "validations": [{ "path": "status", "value": 200 }, { "path": "first_name" }]
  }
   */
    cy.crud({ payload: "examples/jsonAlias" });
  });

  it("Example crud change JSON before request", () => {
    let json = require("../fixtures/examples/jsonNotAlias");
    cy.log(json);
    let data = { ...json };

    data.request.body = { id: crudStorage.save.save }; // Authorization: Bearer token, etc.

    cy.crud({ payload: data });
  });

  it("Example without  path validations in JSON", () => {
    cy.crud({ payload: "examples/jsonWithoutValidation" });
  });

  it("Example without  path validations in JSON, but use .bodyResponse", () => {
    cy.crud({ payload: "examples/jsonWithoutValidation" }).bodyResponse({
      path: "status",
      eq: 200,
    });
  });

  it("Example use variable crudStorage", () => {
    cy.log("last requisition", crudStorage.alias.bodyResponse);
    cy.log("save", crudStorage.save?.save);
    // for use crudStorage

    crudStorage.reserve = {};

    crudStorage.reserve.value = "Hello"; // another reserve.value reserve.body reserve.id etc
  });
  it("Example change ENVIRONMENT QA DEV PROD etc", () => {
    /** USE in cypress.config.js
   *
   * const { defineConfig } = require("cypress");

    module.exports = defineConfig({
    e2e: {
      setupNodeEvents(on, config) {
        // implement node event listeners here
      },
      testIsolation: false,
      env: {
        environment: "QA", // chance environment
        QA: {
          getUser: "https://reqres.in/api/users/2",
        },
        DEV: {
          getUser: "https://reqres.in/api/users/2",
        },
        PROD: {
          getUser: "https://reqres.in/api/users/2",
        },
      },
    },
  });

   */
    cy.crud({ payload: "examples/jsonEndpoint" });
  });

  it("Example without path endpoint, but path id_user/continueEndpoint", () => {
    cy.crud({ payload: "examples/jsonWithParam" });
  });

  it("Example whit path endpoint, but path id_user/continueEndpoint", () => {
    // Used whit JSON file

    let obj = {
      endpoint: "getUser", // configure env in cypress.config.js
      request: {
        method: "POST",
        url: "https://reqres.in/api/users/2",
        path: "save/continueWhitWndpoint",
        body: null,
        qs: null,
        headers: {
          "Content-Type": "application/json",
        },
      },
    };

    cy.crud({ payload: obj });
  });

  it("Example without path endpoint, but path id_user/continueEndpoint", () => {
    // Used in JSON file
    let obj = {
      request: {
        method: "POST",
        url: "https://reqres.in/api/users/2",
        path: "save/continueWhitWndpoint",
        body: null,
        qs: null,
        headers: {
          "Content-Type": "application/json",
        },
      },
    };

    cy.crud({ payload: obj });
  });

  it("Example without path endpoint, but path /continueEndpoint", () => {
    // Used in JSON file

    // endpoint:"alias defined"
    let obj = {
      request: {
        method: "POST",
        url: "https://reqres.in/api/users/2",
        path: "/continueWhitWndpoint",
        body: null,
        qs: null,
        headers: {
          "Content-Type": "application/json",
        },
      },
    };

    cy.crud({ payload: obj });
  });

  it("Example validate schema", () => {
    cy.crud({ payload: "examples/jsonNotAlias" }).validateSchema({
      schema: "jsonSchema",
    });

    cy.log("ID first requisition", crudStorage.save.id_Seven);
  });
});
```

# crudScreenshot

```javascript
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
      screenshot: true, // required true, for active screenshot
      visualPayloads: false,
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

# Funcation findInJSON

The findInJson function is designed to loop through a JSON object (or a data structure that resembles a JSON, like an array or object in JavaScript) and find a specific value associated with a key (keyToFind). The function also has the ability to deal with arrays and find an element at a specific position within that array. Here are all the scenarios this function covers:

Recursive Search:

The function recursively searches all properties and sub-properties of objects and arrays.
Array Handling:

When it finds an array, it iterates over each element of the array and applies recursive search.
Object Handling:

When it finds an object, it checks each key to see if it matches keyToFind.
Finding Specific Keys in Arrays:

If the desired key (keyToFind) is found and its associated value is an array, the function will attempt to return the element at the position specified by the position parameter.
Finding Specific Keys in Objects:

If the desired key is found and its value is not an array, the function will count how many times that key has been found so far. If the counter matches the specified position, it returns that value.
Flow Control with Errors:

The function uses the throw new Error("Found value") exception to stop execution as soon as it finds the desired value. This is a form of flow control to immediately exit deep recursion.
Conditional Return:

The function returns an object with two properties (object and value) if the value found is part of an array. If it is a simple value (not an array), it returns just the value.
Error Handling:

If an error is thrown other than the "Found value" flow control, the error will be propagated.
Custom Error Messages:

If the key is not found, the function logs a custom error to the console and returns undefined.
Ignore Non-Object Values:

If the function encounters types that are not arrays or objects (such as strings, numbers, or Boolean values), it ignores them and continues the search.
Ignore Prototype Properties:
The function checks whether the property belongs to the object itself (using obj.hasOwnProperty(key)) to avoid enumerating properties inherited from the prototype.
Multiple Occurrence Scenario:
If the desired key occurs multiple times, the function can find the specific occurrence based on the position parameter.

```javascript
// Teste 1: Objeto Simples
const objSimple = { name: "Alice", age: 30 };
console.log(cy.findInJson(objSimple, "name"));

// Teste 2: Array
const objArray = {
  users: [
    { id: 1, name: "Bob" },
    { id: 2, name: "Carol" },
  ],
};
console.log(cy.findInJson(objArray, "name"));

const objNested = { user: { id: 1, details: { name: "Dave", age: 40 } } };
console.log(cy.findInJson(objNested, "name"));

const objRepeatedKey = {
  user: { id: 1, name: "Eve" },
  manager: { id: 2, name: "Frank" },
};
console.log(cy.findInJson(objRepeatedKey, "name"));

const objFail = { user: { id: 1, name: "George" } };
console.log(cy.findInJson(objFail, "city"));


describe('Meu Teste', () => {
  it('deve encontrar um valor em um JSON', () => {
    const obj = { ... };
    cy.findInJson(obj, 'chave').then(value => {
      expect(value).to.equal(...);
    });
  });
})
```

# Mock in cypress-crud

```json
// fixtures/example/ jsonMock.json

{
  "endpoint": "getUser",
  "request": {
    "method": "POST",
    "url": "https://reqres.in/api/users/2",
    "mock": "mocks/jsonWithMock.json",
    "body": null,
    "qs": null,
    "headers": {
      "Content-Type": "application/json"
    }
  },
  "validations": [{ "path": "status", "value": 201 }, { "path": "id" }]
}

//in mock json fixtures/mocks

{
  "intercept": {
    "method": "POST",
    "url": "/users/2"
  },
  "response": {
    "status": 201,
    "body": { "id": 7, "name": "mock response" },
    "headers": { "Content-Type": "application/json" }
  }
}



```

## in Tests

```javascript
it("Example simple requisition whit MOCK", () => {
  cy.crud({ payload: "examples/jsonMock" });
});
```

# Replace alias for value

```javascript
it("Example simple requisition", () => {
  cy.crud({ payload: "examples/jsonNotAlias" }).save({
    path: "id",
    alias: "access_token", // save value ..... token, param, etc.
  });
});
```

```json
// JSON get param access_token
{
  "request": {
    "method": "POST",
    "url": "https://reqres.in/api/users/2",
    "replace": "access_token", // replace
    "body": null,
    "qs": null,
    "headers": {
      "Content-Type": "application/json",
      "Authorization": "Bearer access_token"
    }
  }
}
```

```javascript
it("Example simple requisition with replace token, param, etc...", () => {
  cy.crud({ payload: "examples/jsonReplaceAlias" }).save({
    path: "Authorization",
  });
});
```

```json
// previous jsons used save()
// save({path: "name", alias:"nameUser"})
// save({path: "access_token", alias:"token"})

{
  "request": {
    "method": "POST",
    "url": "https://reqres.in/api/users/2",
    "replace": "access_token, nameUser",
    "body": null,
    "qs": { "name": "nameUser" },
    "headers": {
      "Content-Type": "application/json",
      "Authorization": "Bearer token"
    }
  }
}
```

## Contributions

Contributions are always welcome. Feel free to open issues or send pull requests.

## License

This project is licensed under the terms of the MIT License.
