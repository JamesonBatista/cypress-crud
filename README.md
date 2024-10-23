# Cypress-Crud Introduction

[![Npm package weekly downloads](https://badgen.net/npm/dw/cypress-crud)](https://npmjs.com/package/cypress-crud)
[![Npm package weekly downloads](https://badgen.net/npm/dm/cypress-crud)](https://npmjs.com/package/cypress-crud)
[![Npm package weekly downloads](https://badgen.net/npm/dy/cypress-crud)](https://npmjs.com/package/cypress-crud)
[![Npm package weekly downloads](https://badgen.net/npm/dt/cypress-crud)](https://npmjs.com/package/cypress-crud)

<div style="text-align: center;">
<img src="cypress.png" alt="Rounded Image" width="400">
</div>

<br>
<div display="flex" align-items="center">
  <h1 style="margin: 0;">Pre-requisitos</h1>
</div>
<br>

NodeJS must be installed and Cypress must be version 10 or higher for this package to function correctly.

```brash
 NodeJs
 Cypress version 10 >
```

<br>

<div display="flex" align-items="center">
    
<h1 style="margin: 0;">  Instalattion</h1>
</div>
<br>

To install the package in your Cypress project, use the command

```brash
npm i cypress

npx cypress open

and

configure cypress

npm i cypress-crud
```

<br>
<div display="flex" align-items="center">
    
  <h1 style="margin: 0;">Configuration</h1>
</div>
<br>

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
// close json file in variable
import _ from "lodash";
export function clone(json) {
  return _.cloneDeep(json);
}
```

- `cypress.config.js:`

```javaScript


const { defineConfig } = require("cypress");
const fs = require("fs");
const path = require("path");
const readFixtures = require("./node_modules/cypress-crud/src/runAllJson");
module.exports = defineConfig({
  reporter: "cypress-mochawesome-reporter",

  e2e: {
    defaultCommandTimeout: 180000,
    pageLoadTimeout: 160000,
    requestTimeout: 160000,
    trashAssetsBeforeRuns: true,
    testIsolation: false,
    experimentalRunAllSpecs: true,

    setupNodeEvents(on, config) {
      // reporter: "cypress-mochawesome-reporter",

      require("cypress-mochawesome-reporter/plugin")(on);
      on("task", {
        crudLog(message) {
          console.log(message);
          return null;
        },
        runFixtures({ folderPath }) {
          const fixturesDir = path.join(
            __dirname,
            "./cypress/fixtures",
            folderPath || ""
          );
          const files = readFixtures(fixturesDir);
          const data = files.map((file) => ({
            fileName: file.replace(fixturesDir + path.sep, ""),
            content: JSON.parse(fs.readFileSync(file, "utf8")),
          }));
          return data;
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

  },
});

// CHANGE TITLE and SUBTITLE
// in cypress.env.json

// "title": "TESTING",
// "subTitle": "Project in Cypress"
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
  }
  // "title": "TESTING",
  // "subTitle": "Project in Cypress"
}
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

_Use faker. options for generate data faker_

```json

    {
      "post": "swagger/login",
      "body": {
        "username": "admin",
        "password": "password",
        "name": "faker.name", // faker.nome
        "email": "faker.email",
        "enterprise": "faker.enterpriseName", // faker.empresaNome faker.entrerprise
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
        "imagem": "faker.image", // faker.imagem
        "text": "faker.text", // faker.texto
        "title": "faker.title", // faker.titulo
        "actualDate": "faker.actualDate", // faker.dataAtual
        "futureDate": "faker.futureDate", // faker.dataFutura
        "fruta": "faker.fruta",
        "fruit": "faker.fruit",
        "object": "faker.object", // faker.objeto
        "num": "faker.number(12)", // 123484218445
        "number": "faker.number(7)", // 9713187


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
      "avatar": "https://avatars.githubusercontent.com/u/36132952",
      "num": "123484218445",
      "number": "9713187"
    }

```

```js
it("Run all JSONs in folder", () => {
  cy.runFixtures("examples"); // run all JSONs in folder
});
it("Run all JSONs", () => {
  cy.runFixtures(); // run all JSONs in fixtures
});
```

<br>

<div display="flex" align-items="center">
    
  <h1 style="margin: 0;">Types od JSONs</h1>
</div>
<br>

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

<div display="flex" align-items="center">
    
  <h1 style="margin: 0;">Run envs</h1>
</div>
<br>

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


 <div display="flex" align-items="center">
    
  <h1 style="margin: 0;">Save</h1>
</div>
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

<br>
<div display="flex" align-items="center">
    
  <h1 style="margin: 0;">Save value payload or request</h1>
</div>
<br>

```json
// request
{
  "text": "Expect validação do tipo de retorno string number boolean ...",
  "get": "https://reqres.in/api/users/2",
  "body": {
    "name": "Jhon"
  },
  "saveRequest": "name"
}
// saved name
```
<br>
<div display="flex" align-items="center">
    
  <h1 style="margin: 0;">Use saved request or payload</h1>
</div>
<br>

```json
{
  "get": "https://reqres.in/api/users/2",
  "body": {
    "name": "{request_name}"
  }
  // result Jhon
}
```

<br>
<div display="flex" align-items="center">
    
  <h1 style="margin: 0;">Saved in expect</h1>
</div>
<br>

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
<br>
<div display="flex" align-items="center">
    
  <h1 style="margin: 0;">Expect</h1>
</div>
<br>

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


<br>
<div display="flex" align-items="center">
    
  <h1 style="margin: 0;">Expect equal</h1>
</div>
<br>


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

<br>
<div display="flex" align-items="center">
    
  <h1 style="margin: 0;">Expect save</h1>
</div>
<br>

`br:` Usando ::: você usará o salvar o valor da key
<br>

`en:` Using ::: you will use save the key value
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
{
  // save name in position 4
  "expect": "name:::>4"
}
{
  // save name whit alias user_name in position 4
  "expect": "name:::user_name>4"
}

{
  // eq name Micheal save alias user
  "expect": "name===Michael:::user"
}

```

![expect](./src/images/expect:::.png)

> expect eq and as
> <br>

![expect](./src/images/expect_eq_as.png)

<br>
<div display="flex" align-items="center">
    
  <h1 style="margin: 0;">Expect position</h1>
</div>
<br>

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

<br>
<div display="flex" align-items="center">
    
  <h1 style="margin: 0;">Expect type</h1>
</div>
<br>

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

<br>
<div display="flex" align-items="center">
    
  <h1 style="margin: 0;">Expect validating various possibilities</h1>
</div>
<br>


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


<br>
<div display="flex" align-items="center">
    
  <h1 style="margin: 0;">Condition</h1>
</div>
<br>

`br:` O condiction está relacionado a request anterior, caso o condition seja condition-accept o `cypress-crud` passará para o JSON seguinte.
<br>

`en:`
The condition is related to the previous request, if the condition is condition-accept, `cypress-crud` will pass to the next JSON.

```json
{
  "text": "post create new user",
  "get": "swagger/users"
} // return 200

{ // if return previous request  name not null
  "condition": { "path": "name" },
  "get": "swagger/users",
}
```

```json
{ // if return previous request status 200
  "condition": 200,
  "get": "swagger/users",
}

{ // if return previous request name
  "condition": "name",
  "get": "swagger/users",
}

```

```json
{
  // if return previous request name eq Jam
  "condition": { "path": "name", "eq": "Jam" },
  "get": "swagger/users"
}
```
<br>
<div display="flex" align-items="center">
    
  <h1 style="margin: 0;">CRUD</h1>
</div>
<br>

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

<br>
<div display="flex" align-items="center">
    
  <h1 style="margin: 0;">CRUD use expect</h1>
</div>
<br>

```js
cy.crud({ get: "http...." }).expect({ path: "first_name" });
```

<br>
<div display="flex" align-items="center">
    
  <h1 style="margin: 0;">CRUD use save</h1>
</div>
<br>


```js
cy.crud({ get: "http...." }).save({ path: "first_name" });
```

<br>
<div display="flex" align-items="center">
    
  <h1 style="margin: 0;">CRUD run all jsons our run all jsons in path</h1>
</div>
<br>


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

<br>
<div display="flex" align-items="center">
    
  <h1 style="margin: 0;">Schema</h1>
</div>
<br>


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

<br>
<div display="flex" align-items="center">
    
  <h1 style="margin: 0;">Snippets</h1>
</div>
<br>

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


<br>
<div display="flex" align-items="center">
    
  <h1 style="margin: 0;">write</h1>
</div>
<br>


This function is used to write data to a JSON file in the Cypress fixtures directory. It creates a JSON file with the provided data from the specified request response. This is useful for generating simulated response files for testing purposes.

```javaScript
cy.crud( "token/createToken.json").write({ path: "user/getUser" });
```

`explanation:` create json response in cypress/fixtures/user

<br>

<br>
<div display="flex" align-items="center">
    
  <h1 style="margin: 0;">read</h1>
</div>
<br>


This function is used to read data from a JSON file in the Cypress fixtures directory. It reads the content of the specified JSON file and makes it available for use in the test

```javaScript
cy.crud( "token/createToken.json" ).read({ path: "user/getUser" });

cy.read({ path: "user/getUser" }).then((json) => {
  console.log(json);
});
```

`explanation:` read json response in cypress/fixtures/user

<br>

<br>
<div display="flex" align-items="center">
    
  <h1 style="margin: 0;">Use Mock</h1>
</div>
<br>


For requests that require a mock, simply specify the `mock` variable and provide the path to where the mock is stored.

`Example:` The file can be found in fixtures in the **mocks** folder, called **json_mock**.

```json
{
  "get": "https://demo0065046.mockable.io/", // or get: true // post: true // delete": true // path: true
  "mock": "mocks/json_mock"
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
  "mock": "mocks/json_mock"
}
```

<br>

<br>
<div display="flex" align-items="center">
    
  <h1 style="margin: 0;">hideReport</h1>
</div>
<br>


```json
// in cypress.env.json

 "hideReport": ["body", "headers"]

 // result

 {
  "get": "https://reqres.in/api/users/2",
  "failOnStatusCode": false,
  "body": "hide active in path",
  "headers": "hide active in path"
}

```

<br>

<br>
<div display="flex" align-items="center">
    
  <h1 style="margin: 0;">Tips</h1>
</div>
<br>


`br:` sempre que você efetua uma requisição, a url é salva em crudStora.save.url, então na próxima requisição você pode usar como a abaixo:
<br>

`en:` whenever you make a request, the url is saved in crudStora.save.url, so in the next request you can use it like the one below:

```json

  {
    "text": "GET list in projects",
    "get": "swagger/projects", // https://api-desafio-qa.onrender.com/projects
  },
  {
    "text": "Post in projects using data fakers",
    "body": {
      "name": "faker.enterprise",
      "leader": "faker.name",
      "description": "faker.text",
      "endDate": "2024-08-08",
    },
    "post": "{url}", // https://api-desafio-qa.onrender.com/projects
  }
```
<br>
<div display="flex" align-items="center">
    
  <h1 style="margin: 0;">crudSafeData</h1>
</div>
<br>

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

<br>
<div display="flex" align-items="center">
    
  <h1 style="margin: 0;">Alias</h1>
</div>
<br>

1. > crudStorage
1. > crudStorage.alias
1. > crudStorage.alias.bodyResponse
1. > crudStorage.save
1. > crudStorage
1. > crudStorage.save.url
1. > crudStorage.save.beforeUrl
1. > crudStorage.request

## Use

```js
it("crud run", () => {
  cy.crud("example").then(() => {
    expect(crudStorage.save.nome).not.empty;
  });
});
```
<br>
<div display="flex" align-items="center">
    
  <h1 style="margin: 0;">External validation</h1>
</div>
<br>


```json
// response

[
  {
    "address": "Av. Paulista, 1000",
    "city": "São Paulo",
    "cnpj": "12345678901234",
    "employees": [
      {
        "email": "maria.silva@techinnovations.com.br",
        "employeeId": 1,
        "name": "Maria Silva",
        "position": "Gerente de Projetos"
      }
    ],
    "id": 1,
    "name": "Tech Innovations Ltda",
    "products": [
      {
        "price": 5000,
        "productDescription": "Software completo para gestão empresarial, incluindo módulos de finanças, vendas e operações.",
        "productId": 1,
        "productName": "Software de Gestão"
      }
    ]
  }
]
```

```js
it("Company crud", () => {
  cy.crud({ get: "swagger/company" }).then(() => {
    cy.findInJson("city").should("deep.equal", ["São Paulo"]);
    cy.findInJson("productId").should("deep.equal", [1]);
  });
});
```

<br>
<div display="flex" align-items="center">
    
  <h1 style="margin: 0;">Examples</h1>
</div>
<br>

> 1

![alt text](image.png)

> 2

![alt text](image-2.png)

> 3

![alt text](image-3.png)

> 4

![alt text](image-4.png)

> 5

![alt text](image-5.png)

> 6

![alt text](image-6.png)

> 7

![alt text](image-7.png)

> 8

![alt text](image-8.png)

> 9

![alt text](image-9.png)

## **Authors and Contributors**

This project is the collaborative effort of Jameson Batista and Gabriel Lopes. We are proud to share our work with the community and hope it can inspire and assist other developers.

For tips, inquiries, or just to connect, follow us on LinkedIn:

- LinkedIn [Jam Batista](https://www.linkedin.com/in/jam-batista-98101015b/)
- LinkedIn [Gabriel Lopes](https://www.linkedin.com/in/gabriel-lopes-500b71269/)



![alt text](image-10.png)