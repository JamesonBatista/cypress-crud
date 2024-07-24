# Cypress-Crud Introduction


### **Pre-requisitos**

NodeJS must be installed and Cypress must be version 10 or higher for this package to function correctly.

```brash
 NodeJs
 Cypress version 10 >
```

<br>

### **Installation**

To install the package in your Cypress project, use the command

```brash
npm i cypress

npx cypress open

and

configure cypress

npm i cypress-crud
```

<br>

### **Configuration**

The CRUD was designed to automatically add dependencies and configurations to the `e2e.js` file and the `cypress.config.js` file, eliminating the need to manually include anything for the library's functionality.

- `e2e.js:`

```javaScript
export {
  crudStorage,
} from "cypress-crud/src/gherkin/bdd.js";
import "cypress-plugin-steps";
export const faker = require("generate-datafaker");
import "cypress-crud";
import "cypress-plugin-api";
import "cypress-mochawesome-reporter/register";
import spok from "cy-spok";
// export default spok;
const applyStyles = require("../../node_modules/cypress-crud/src/style");
if (!Cypress.env("styles") && Cypress.env("crudStyles")) applyStyles();
// close json file in variable
import _ from "lodash";
export function clone(json) {
  return _.cloneDeep(json);
}
```

- `cypress.config.js:`

```javaScript

const { defineConfig } = require("cypress");

module.exports = defineConfig({
  reporter: "cypress-mochawesome-reporter",

  e2e: {
    setupNodeEvents(on, config) {
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
  },
});
```

- `cypress.env.json:`

```json
{
  "environment": "QA",
  "QA": {
    "endpoint": "https://restcountries.com/v3.1/translation/germany",
    "reqres": "https://reqres.in/api/users/2",
    "location": "https://rickandmortyapi.com/api/location",
    "serverest": "https://serverest.dev",
    "getUser": "https://reqres.in/api/users/2",
    "swagger": "https://api-desafio-qa.onrender.com/",
    "crud_base": {
      "crud_get_post": "swagger/crud",
      "crud_getId_delete": "swagger/crud/{id}"
    },
    "endpoint_mercado": "swagger/mercado/{id}/produtos"
  },
  "PROD": {
    "endpoint": "https://restcountries.com/v3.1/translation/germany",
    "reqres": "https://reqres.in/api/users/2",
    "location": "https://rickandmortyapi.com/api/location",
    "serverest": "https://serverest.dev",
    "getUser": "https://reqres.in/api/users/2",
    "swagger": "https://api-desafio-qa.onrender.com/",
    "crud_base": {
      "crud_get_post": "swagger/crud",
      "crud_getId_delete": "swagger/crud/{id}"
    },
    "endpoint_mercado": "swagger/mercado/{id}/produtos"
  },
  "DEV": {
    "endpoint": "https://restcountries.com/v3.1/translation/germany",
    "reqres": "https://reqres.in/api/users/2",
    "location": "https://rickandmortyapi.com/api/location",
    "serverest": "https://serverest.dev",
    "getUser": "https://reqres.in/api/users/2",
    "swagger": "https://api-desafio-qa.onrender.com/",
    "crud_base": {
      "crud_get_post": "swagger/crud",
      "crud_getId_delete": "swagger/crud/{id}"
    },
    "endpoint_mercado": "swagger/mercado/{id}/produtos"
  },

  "screenshot": true,
  "crudStyles": true
  // "title": "TESTING",
  // "subTitle": "Project in Cypress"
}
```

- `commands.js:`

```js
// CREATE COUNTER IMPORT IN FILE .CY.JS

IMPORT IN FILE  // import { des, its } from "../support/commands";

const counter = window;
let compare;
if (!counter.des) {
  counter.des = 1;
  counter.its = 1;
}
const confer = () => counter.des;
console.log(confer());

export let des = () => {
  return String(counter.des++).padStart(2, "0") + " ➠ "  ;
};
export let its = () => {
  if (!compare || confer() !== compare) {
    counter.its = 1;
    compare = confer();
  }
  return String(counter.its++).padStart(2, "0") + " - " ;
};
```

- `env_qa.js:`

```js
const { defineConfig } = require("cypress");

const config = require("./cypress.config");

const e2e = {
  ...config.e2e,
  env: {
    endpoint: "https://restcountries.com/v3.1/translation/germany",
    reqres: "https://reqres.in/api/users/2",
    swagger: "https://api-desafio-qa.onrender.com/",
    location: "https://rickandmortyapi.com/api/location",
    ...config.env,
  },

  testIsolation: false, //  in e2e:{}
  experimentalRunAllSpecs: true, // in e2e:{}
  chromeWebSecurity: false,
};

module.exports = defineConfig({
  ...config,
  e2e,
});

// IN PACKAGE.JSON
// "scripts": {
//     "cy:run:qa": "cypress run --config-file env_qa.js"
//   },
```

- `package.json`

```json
// create new environment DEV env_dev.js, env_prod.js
"scripts": {
    "cy:run:qa": "cypress run --config-file env_qa.js",
    "cy:open:qa": "cypress open --config-file env_qa.js",

  }
```

- ### **Version 2.4.4 +**

_Use faker. options for generate data faker_

```json

    {
      "post": "swagger/login",
      "body": {
        "username": "admin",
        "password": "password",
        "name": "faker.name", // faker.nome
        "email": "faker.email",
        "enterprise": "faker.enterpriseName", // faker.empresaNome
        "state": "faker.state", // faker.estado
        "city": "faker.city", // faker.cidade
        "country": "faker.country", //faker.pais
        "street": "faker.street", // faker.endereco // faker.address // faker.rua
        "phoneNumber": "faker.phoneNumber", // faker.numeroTelefone
        "cep": "faker.cep",
        "cpf": "faker.cpf",
        "cnpj": "faker.cnpj",
        "passwords": "faker.password", //faker.senha
        "uuid": "faker.uuid",
        "birthdate": "faker.birthdate", // faker.aniversario
        "avatar": "faker.avatar",
        "professional": "faker.professional", // faker.profissao
        "product": "faker.product", // faker.produto
      },
    };


// result

    {
      "username": "admin",
      "password": "password",
      "test": "Jam Batista",
      "email": "joaogabriel@hotmail.com",
      "enterprise": "Ana Clara CloudNet",
      "state": "Ceará",
      "city": "Guatemala City",
      "country": "Alemanha",
      "street": "Alhambra, Granada, Spain",
      "phoneNumber": "11995655467",
      "cep": "69304525",
      "cpf": "94344989023",
      "cnpj": "02708629000116",
      "passwords": "4)={[W.oHj",
      "uuid": "0de2e006-8bfa-44cb-b05f-d3c019249a20",
      "birthdate": "1952-06-15T02:41:02.520Z",
      "avatar": "https://avatars.githubusercontent.com/u/36132952"
    }

```

- ### **Version 2.4.1 +**

```js
it("Run all JSONs in folder", () => {
  cy.runFixtures("examples"); // run all JSONs in folder
});
it("Run all JSONs", () => {
  cy.runFixtures(); // run all JSONs in fixtures
});
```

<br>

### **Types of JSONs**

`en:` For your project setup, you need to create a JSON file inside the `Fixtures` folder. This file can be placed directly in the folder or within a subfolder for better organization according to your project's needs.<br>
<br>
`br:` Para configurar o seu projeto, você precisa criar um arquivo JSON dentro da pasta `Fixtures`. Este arquivo pode ser colocado diretamente na pasta ou dentro de uma subpasta para melhor organização de acordo com a necessidade do seu projeto.

`Example path:` Fixtures/Token/createToken.json

- 1 `JSON`:<br>
  `br:` Aqui temos algumas formas de usar o GET, que pode ser diretamente com a url preterida, ou com o nome da key criada no env (cypress.env.json) swagger (ou qualquer outro nome), e também você pode usar a continuação da sua url.
  <br><br>
  `en:` Here we have some ways to use GET, which can be directly with the deprecated url, or with the name of the key created in the env (cypress.env.json) swagger (or any other name), and you can also use the continuation of your url.

```json
{
  "get": "https://reqres.in/api/users/2",
}

{
  "get": "swagger", // show in cypress.env.json
}

{
  "get": "swagger/login", // result: https://api-desafio-qa.onrender.com/login
}

```

- 1.1
  <br>
  <br>
  `br:` Abaixo, um JSON efetuando uma request com a path `text` que servirá para documentar a ação do JSON.
  <br><br>
  `en:` Below, a JSON making a request with path `text` that will serve to document the JSON action.

```json
{
  "text": "efetaundo request Mockable.io",
  "get": "http://demo7018197.mockable.io/"
}
```

![GET whit text]('../../src/images/get_text.png)

### Run envs

`br:` Para executar diferentes jsons em diferentes ambientes na mesma execução.
<br>

`en:` To run different jsons in different environments in the same run.

```js
  it("request", () => {
    cy.crud({ get: "crud_get_post", env: "PROD" });
    cy.crud({ get: "crud_get_post", env: "DEV" });
  });

```
```text
image

```
![image]('../../src/images/changeenv.png)

- 1.2 <br>
  <br>
  <br>
  `br:` Efetuando request e salvando o email do retorno da requisição. Conforme imagem, imagem foi salva na variável email. (crudStorage.save.email).
  <br>
  Caso, seja necessário salvar essa variável com outro nome, basta usar da forma 2 ou 3.
  Exemplo 4 antes de salvar verificamos se o valor é igual.
  <br><br>
  `en:`
  Making a request and saving the request return email. As shown in the image, the image was saved in the email variable. (crudStorage.save.email).
  <br>
  If it is necessary to save this variable with another name, just use form 2 or 3.
  Example 4, before saving, we check if the value is the same.

```json
// 1
{
  "text": "efetaundo request Reqres.in",
  "get": "https://reqres.in/api/users/2",
  "save": "email"
}
// 2
{
  "text": "efetaundo request Reqres.in",
  "get": "https://reqres.in/api/users/2",
  "save": "email ::: user_email"
}
// 3
{
  "text": "efetaundo request Reqres.in",
  "get": "https://reqres.in/api/users/2",
  "save": {"path":"email", "as": "user_email"}
}
// 4
{
  "text": "salvando com variável email e alias",
  "get": "https://reqres.in/api/users/2",
  "save": {
    "path": "email",
    "eq": "janet.weaver@reqres.in",
    "as": "user_email"
  }
}
```

> save email 1
> <br>

![save email]('../../src/images/save_email.png)

> save whit alias 2<br>

![save email alias]('../../src/images/save_email_alias.png)

> save whit path and as 3
> <br>

![save email alias]('../../src/images/save_email_alias.png)

> save whit path eq and as 4
> <br>

![save email alias]('../../src/images/save_email_alias.png)

### Used saved value

`br:` Para usar, resgatar um valor salvo na requisição anterior ou requisições feitas ante, existem duas forma:
<br>

`en:` To use, redeem a value saved in the previous request or requests made before, there are two ways:

```text
  Request JSON
```

```json
{
  "text": "Expect validação do tipo de retorno string number boolean ...",
  "get": "https://reqres.in/api/users/2",
  "expect": {
    "path": "first_name",
    "as": "name"
  }
}
```

![save email alias]('../../src/images/saveUse.png)

```text
  Use data save
```

```json
[
  {
    "text": "salvando para usar em outra request",
    "get": "https://reqres.in/api/users/2",
    "expect": {
      "path": "first_name",
      "as": "name"
    }
  },
  {
    "text": "usando valor salvo",
    "post": "https://reqres.in/api/users/2",
    "body": {
      "name": "{name}"
    },
    "expect": "name"
  }
]
```

```text
  Result
```

![save email alias]('../../src/images/resultUseSave.png)

```text
Rescue save valur in url
```

```json
{
  "text": "save id",
  "get": "https://reqres.in/api/users/2",
  "save": "id"
}
```

```json
// in new json rescue id

{
  "text": "rescue id and use in url",
  "get": "https://reqres.in/api/users/{id}"
}
```

```text
Second way of use
```

```js
import { faker, clone, crudStorage } from "../support/e2e";
describe("", () => {
  afterEach(() => {
    cy.crudScreenshot();
  });
  it("request show json", () => {
    console.log(crudStorage.save.name); // result Janet
  });
});
```

## Expect

`br:` Expect irá nos ajudar nas validações das keys, veremos exemplos:
<br>

1. validação simples, apenas verificando se o campo existe

`en:` Expect will help us with key validations, we will see examples:
<br>

1. simple validation, just checking if the field exists

```json
{
  "text": "usando expect",
  "get": "https://reqres.in/api/users/2",
  "expect": "first_name"
}
```

![expect]('../../src/images/expect.png)

### Expect equal

`br:` Usando === você usará o equal para validar
<br>

`en:` Using === you will use equal to validate
<br>

```json
 // 1
{
  "text": "usando expect com === para validar",
  "get": "https://reqres.in/api/users/2",
  "expect": "first_name === Janet"
}
// 2
{
  "text": "usando expect com === para validar",
  "get": "https://reqres.in/api/users/2",
  "expect": {"path":"first_name", "eq": "Janet"}
}

```

![expect]('../../src/images/expect_save===.png)

### Expect save

`br:` Usando ::: você usará o salvar o valor da key
<br>

`en:` Using === you will use save the key value
<br>

```json
 // 1
{
  "text": "usando expect com ::: para salvar o valor da key",
  "get": "https://reqres.in/api/users/2",
  "expect": "first_name ::: name"
}
// 2
{
  "text": "usando expect com ::: para validar",
  "get": "https://reqres.in/api/users/2",
  "expect": {"path":"first_name", "as": "name"}
}
// 3
{
  "text": "usando expect com ::: para salvar o valor da key",
  "get": "https://reqres.in/api/users/2",
  "expect": { "path": "first_name", "eq": "Janet", "as": "name" }
}

```

![expect](./src/images/expect:::.png)

> expect eq and as
> <br>

![expect](./src/images/expect_eq_as.png)

### Expect position

`br:` Usando o position você consegue validar numa lista de array a posição informada.
<br>

`en:`Using position you can validate the entered position in an array list.

```txt
Return image
```

![array image](./src/images/array.png)

```json
{
  "text": "Expect validação por array",
  "get": "https://reqres.in/api/users",
  "expect": { "path": "first_name", "position": 2 }
}
```

```text
Result image
```

![return image](./src/images/return.png)

```md
save position
```

```json
{
  "text": "Expect validação por array",
  "get": "https://reqres.in/api/users",
  "expect": { "path": "first_name", "position": 2, "as": "name" }
}
```

![return image](./src/images/array_save_position.png)

### Expect type

`br:` Adicionando type ao seu json, você irá validar qual o tipo o dado retornado
<br>

`en:` By adding type to your json, you will validate the type of data returned.

```json
{
  "text": "Expect validação do tipo de retorno string number boolean ...",
  "get": "https://reqres.in/api/users/2",
  "expect": {
    "path": "first_name",
    "type": "string"
  }
}
```

```text
Return
```

![return image](./src/images/typereturn.png)

### Expect validating various possibilities

`br:` Usando `||` você consegue validar a possibilidade de vários valores, ideal para quando o retorno pode ser de valores diferentes.
<br>

`en:` Using `||` you can validate the possibility of multiple values, ideal for when the return may be different values.

```json
{
  "text": "Equal validando possibilidade de vários valores",
  "get": "https://reqres.in/api/users/2",
  "expect": {
    "path": "first_name",
    "eq": "Jam || Batista || test || Janet"
  }
}
```

![return image](./src/images/expectmultiplevalues.png)

## CRUD

`br:` Para usar o cy.crud é simples, basta colocar os jsons na pasta `fixtures` ou subpastas da `fixtures` abaixo formas de uso:
<br>

`en:` To use cy.crud, it's simple, just place the jsons in the `fixtures` folder or subfolders of `fixtures` below:

```js
it("request show json", () => {
  cy.crud("examples/big_data");
});

it("request show json", () => {
  cy.crud("big_data");
});
```

```text
Use for object
```

```js
let json = { get: "http..." };
it("request show json", () => {
  cy.crud(json);
});
```

```js
it("request show json", () => {
  cy.crud({ get: "http...." });
});
```

### CRUD use expect

```js
cy.crud({ get: "http...." }).expect({ path: "first_name" });
```

### CRUD use save

```js
cy.crud({ get: "http...." }).save({ path: "first_name" });
```

### CRUD run all jsons our run all jsons in path

`br:` Com o cy.crud você consegue em apenas um `it` rodas todos os jsons que estão na pasta `fixtures` ou subpastas.
<br>

`en:` With cy.crud you can in just one `it` run all the jsons that are in the `fixtures` folder or subfolders.

![return image](./src/images/runall.png)

```js
it("RUN all jsons in path fixtures", () => {
  cy.runFixtures();
});
```

```text
Run all jsons in path
```

![return image](./src/images/runallpath.png)

```js
it("RUN all jsons in path fixtures", () => {
  cy.runFixtures("crud");
});
```

### Schema

`br:` A função `schema`. Ele garante que a resposta de uma solicitação atenda aos critérios especificados em um esquema JSON específico. Essa validação ajuda a confirmar se a estrutura e os dados retornados estão alinhados com as expectativas definidas no teste.
<br>

`en:` The `schema` function. It ensures that a request's response meets criteria specified in a specific JSON schema. This validation helps confirm that the structure and data returned align with the expectations defined in the test.

```json
{
  "text": "validando schema",
  "get": "https://reqres.in/api/users/2",
  "schema": "crud_users"
}
```

```js
cy.crud("json");
```

```javaScript
 cy.crud({ payload: "examples/json" }).schema({schema: "crud_users",});
```
![return image](./src/images/schema.png)

<br>

### **Snippets**

A snippet has been created to streamline the test construction process.

- crud

```javascript
cy.crud();
```

- .save

```javascript
.save({path:''})
```

- .expects

```javascript
.expects({path:''})
```

- .schema

```javascript
.schema({schema:''})
```

<br>
```

### **write**

This function is used to write data to a JSON file in the Cypress fixtures directory. It creates a JSON file with the provided data from the specified request response. This is useful for generating simulated response files for testing purposes.

```javaScript
cy.crud( "token/createToken.json").write({ path: "user/getUser" });
```

`explanation:` create json response in cypress/fixtures/user

<br>

### **read**

This function is used to read data from a JSON file in the Cypress fixtures directory. It reads the content of the specified JSON file and makes it available for use in the test

```javaScript
cy.crud( "token/createToken.json" ).read({ path: "user/getUser" });

cy.read({ path: "user/getUser" }).then((json) => {
  console.log(json);
});
```

`explanation:` read json response in cypress/fixtures/user

<br>

### **Use Mock**

For requests that require a mock, simply specify the `mock` variable and provide the path to where the mock is stored.

`Example:` The file can be found in fixtures in the **mocks** folder, called **json_mock**.

```json
{
  "get": "https://demo0065046.mockable.io/", // or get: true // post: true // delete": true // path: true
  "mock": "mocks/json_mock",
  "headers": {
    "Content-Type": "application/json"
  }
}
```

`Mock construction:`

```json
{
  "response": {
    "status": 200,
    "body": { "authorization": "Bearer" }
  }
}
```

In this example, the `body` field directs to the mock file located in the `mocks` folder, which contains the predefined structure of the fields to be returned in the response.

`Validate mock:` To validate the mock, you can simply include the checks in the **JSON** file itself or embed them in the **test** file.

- `JSON fixtures`

```json
{
  "get": "https://demo0065046.mockable.io/", // or get: true // post: true // delete": true // path: true
  "mock": "mocks/json_mock",
  "headers": {
    "Content-Type": "application/json"
  }
}
```

<br>

- ### **_Tips_**

```js
cy.crud({ get: "swagger/eventos", expect: "id::id" }); // save id expect:{path: "id", as: "id"}
cy.crud({ get: "swagger/eventos", expect: "name===Jam" }); // equal result expect:{path: "name", eq: "Jam"}
```

<br>

<br>

### **crudSafeData**

```js
describe(`Test cypress-crud Property search`, () => {
  let data;
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXkiOiIxMjM0NTY3ODkwIiwicGFzc3dvcmQiOiJKb2huIERvZSJ9.d7gibg6eK9oxrpcCob-MuNz65NHMWNK1x4otVLyHPCo";

  before(function () {
    cy.crudSafeData(token).then((safe) => {
      crudStorage.save.email_login = safe.key;
      crudStorage.save.password_login = safe.password;
    });
  });

  it("Decode", () => {
    console.log(crudStorage.save);
  });
});

  OUR

  IN CYPRESS.ENV.JSON

  "dataSafe": "token jwt",
  "hideCredentials": true,
  "hideCredentialsOptions": { "body": ["email", "password"] } // change for your paths

  COMPLETE ENV
    env: {
        hideCredentials: true,
        hideCredentialsOptions: {
          headers: ['authorization'],
          auth: ['pass'],
          body: ['username'],
          query: ['password']
        }
      }

   OUR

  CYPRESS.CONFIG.JS

  env:{
  "dataSafe": "your token jwt",
  "hideCredentials": true,
  "hideCredentialsOptions": { "body": ["email", "password"] } // change for your paths
  }

  COMPLETE ENV
    env: {
        hideCredentials: true,
        hideCredentialsOptions: {
          headers: ['authorization'],
          auth: ['pass'],
          body: ['username'],
          query: ['password']
        }
      }
```

<br>

### **hideReport**

```json
// in cypress.env.json

 "hideReport": ["body", "headers"]

 // result

 {
  "method": "POST",// or get: true // post: true // delete": true // path: true
  "url": "https://reqres.in/api/users/2",
  "failOnStatusCode": false,
  "body": "hide active in path",
  "headers": "hide active in path"
}

```

<br>

- ### **_Report_**

To generate the report, the tests must be executed in `run` mode. Furthermore, to include screenshots of the request payload in the report, a specific configuration needs to be adjusted in the `cypress.config.js` file and in your `test` file.

`cypress.config.js:` To activate the option, simply add `screenshot: true`

```json
{
  "environment": "QA",
  "QA": {
    "endpoint": "https://restcountries.com/v3.1/translation/germany",
    "reqres": "https://reqres.in/api/users/2",
    "location": "https://rickandmortyapi.com/api/location",
    "serverest": "https://serverest.dev",
    "getUser": "https://reqres.in/api/users/2",
    "swagger": "https://api-desafio-qa.onrender.com/",
    "crud_base": {
      "crud_get_post": "swagger/crud",
      "crud_getId_delete": "swagger/crud/{id}"
    },
    "endpoint_mercado": "swagger/mercado/{id}/produtos"
  },
  "PROD": {
    "endpoint": "https://restcountries.com/v3.1/translation/germany",
    "reqres": "https://reqres.in/api/users/2",
    "location": "https://rickandmortyapi.com/api/location",
    "serverest": "https://serverest.dev",
    "getUser": "https://reqres.in/api/users/2",
    "swagger": "https://api-desafio-qa.onrender.com/",
    "crud_base": {
      "crud_get_post": "swagger/crud",
      "crud_getId_delete": "swagger/crud/{id}"
    },
    "endpoint_mercado": "swagger/mercado/{id}/produtos"
  },
  "DEV": {
    "endpoint": "https://restcountries.com/v3.1/translation/germany",
    "reqres": "https://reqres.in/api/users/2",
    "location": "https://rickandmortyapi.com/api/location",
    "serverest": "https://serverest.dev",
    "getUser": "https://reqres.in/api/users/2",
    "swagger": "https://api-desafio-qa.onrender.com/",
    "crud_base": {
      "crud_get_post": "swagger/crud",
      "crud_getId_delete": "swagger/crud/{id}"
    },
    "endpoint_mercado": "swagger/mercado/{id}/produtos"
  },

  "screenshot": true,
  "crudStyles": true
}
```

## **Authors and Contributors**

This project is the collaborative effort of Jameson Batista and Gabriel Lopes. We are proud to share our work with the community and hope it can inspire and assist other developers.

For tips, inquiries, or just to connect, follow us on LinkedIn:

- LinkedIn [Jam Batista](https://www.linkedin.com/in/jam-batista-98101015b/)
- LinkedIn [Gabriel Lopes](https://www.linkedin.com/in/gabriel-lopes-500b71269/)
