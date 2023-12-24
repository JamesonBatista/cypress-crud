# cypress-crud

![cypress](https://img.shields.io/badge/cypress.crud-1.0.0-brightgreen)
![cypress](https://img.shields.io/badge/cypress-13.6.0-brightgreen)
![generate-datafaker](https://img.shields.io/badge/datafaker-1.0.2-yellow)

> ## generate-datafaker

[generate-datafaker](https://www.npmjs.com/package/generate-datafaker)

### Required

| NodeJs
| Cypress version 10 >

## Installation

**To install the package, run the following command in your Cypress project:**

```bash
npm i cypress-crud
```

## Use Snippets in cy.action

test_bdd<br>

> test_action<br>
>
> test_bdd_BR<br>
>
> scenario<br>
>
> given<br>
>
> when<br>
>
> and<br>
>
> then<br>
>
> cenario<br>
>
> dado<br>
>
> quando<br>
>
> e<br>
>
> entao<br>

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

>   JSON

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




    it('Generate id ', ()=>{
        cy.crud({ payload: "token/createToken.json" })
    })
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
  },
  "validation": [{ "path": "status", "value": 200 }, { "path": "first_name" }, ...]
}

cy.crud({ payload: "token/createToken.json" })

assert expected 200 to exist

assert expected 200 to deeply equal 200

assert expected Michael to exist
```

# .bodyResponse()

💻 **If you don't want to use validations directly in JSON, you can use .bodyResponse to validate the return.**

```javascript
cy.crud({ payload: "token/createToken.json" })
.bodyResponse({path: "name", value:"Jam Batista"})
// .bodyResponse({path: "name""})

code hiden bodyResponse

  expect(search).to.exist;
  if (equal) {
    expect(search).to.eql(equal);
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

## Contributions

Contributions are always welcome. Feel free to open issues or send pull requests.

## License

This project is licensed under the terms of the MIT License.
