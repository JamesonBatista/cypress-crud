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

## Contributions

Contributions are always welcome. Feel free to open issues or send pull requests.

## License

This project is licensed under the terms of the MIT License.
