const fs = require("fs");
const path = require("path");

function findProjectRoot(dir) {
  const isPackageJsonPresent = fs.existsSync(path.join(dir, "package.json"));
  const isInNodeModules = dir.includes("node_modules");

  if (isPackageJsonPresent && !isInNodeModules) {
    return dir;
  }

  const parentDir = path.dirname(dir);
  if (parentDir === dir) {
    throw new Error("Não foi possível encontrar o diretório raiz do projeto.");
  }

  return findProjectRoot(parentDir);
}

const projectRoot = findProjectRoot(__dirname);
const projectRootPathJsconfig = path.resolve(__dirname, "../../");

const supportFilePath = path.join(projectRoot, "cypress/support/e2e.js");

const contentToAdd = `
export { crudStorage } from "cypress-crud/src/functions/storage.js";
import "cypress-plugin-steps";
import applyStyles from "cypress-crud/src/style";
applyStyles();
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
`;

const appendToFile = (filePath, content) => {
  if (fs.existsSync(filePath)) {
    const existingContent = fs.readFileSync(filePath, "utf8");

    if (!existingContent.includes(content.trim())) {
      fs.appendFileSync(filePath, content, "utf8");
    }
  } else {
    console.error(`path not found: ${filePath}`);
  }
};

appendToFile(supportFilePath, contentToAdd);
//
// ADD command.js
const supportFilePathCommand = path.join(
  projectRoot,
  "cypress/support/commands.js"
);
const contentToAddCommand = `
// CREATE COUNTER

const counter = window;
let compare;
if (!counter.des) {
  counter.des = 1;
  counter.its = 1;
}
const confer = () => counter.des;

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

export const BDD_ = {
  given: "𝐆𝐢𝐯𝐞𝐧 - ",
  when: "𝐖𝐡𝐞𝐧 - ",
  and: "𝐀𝐧𝐝 - ",
  then: "𝐓𝐡𝐞𝐧 - ",
  scenario: "𝐒𝐜𝐞𝐧𝐚𝐫𝐢𝐨 ➠ ",
};
`;
// config.env.js
const supportConfigEnv = path.join(projectRootPathJsconfig, "cypress.env.json");
const supportConfigEnv_content = `
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
}
`;

//
const appendToFileCommand = (filePath, content) => {
  if (fs.existsSync(filePath)) {
    const existingContent = fs.readFileSync(filePath, "utf8");

    if (!existingContent.includes(content.trim())) {
      fs.appendFileSync(filePath, content, "utf8");
    }
  } else {
    console.error(`path not found: ${filePath}`);
  }
};

appendToFileCommand(supportFilePathCommand, contentToAddCommand);

const projectRootPath = path.resolve(__dirname, "../../");
const vscodeFolderPath = path.join(projectRootPath, ".vscode");

const snippetsFilePath = path.join(vscodeFolderPath, "global.code-snippets");
const snippetsFilePathSave = path.join(vscodeFolderPath, "settings.json");
const contentSave = `{"editor.formatOnSave":true, "cSpell.words": ["Cenario", "datafaker", "Entao"]}`;

const snippetContent = `
{
  "create cy.crud": {
    "scope": "javascript,typescript",
    "prefix": "crud",
    "body": [
      "cy.crud('$1')",
      "$2"
    ],
    "description": "create cy.crud"
  },
  "create path": {
    "scope": "javascript,typescript",
    "prefix": "pathExpect",
    "body": [
      "{path: ''}",
      "$2"
    ],
    "description": "create cy.crud"
  },
  "create as": {
    "scope": "javascript,typescript",
    "prefix": "asExpect",
    "body": [
      "as: ''",
      "$2"
    ],
    "description": "create cy.as"
  },
  "create eq": {
    "scope": "javascript,typescript",
    "prefix": "eqExpect",
    "body": [
      "eq: ''",
      "$2"
    ],
    "description": "create cy.as"
  },
  "create search": {
    "scope": "javascript,typescript",
    "prefix": "searchExpect",
    "body": [
      "search: ''",
      "$2"
    ],
    "description": "create cy.as"
  },
  "create alias": {
    "scope": "javascript,typescript",
    "prefix": "asExpect",
    "body": [
      "alias: ''",
      "$2"
    ],
    "description": "create cy.as"
  },
  "create schema": {
    "scope": "javascript,typescript",
    "prefix": "schemaExpect",
    "body": [
      "schema: ''",
      "$2"
    ],
    "description": "create cy.as"
  },
  "create snippet for path": {
    "scope": "javascript,typescript",
    "prefix": ".p",
    "body": [
      "{path:'$1'}",
      "$2"
    ],
    "description": "create cy.crud"
  },
  "create snippet for reqs": {
    "scope": "javascript,typescript",
    "prefix": "requests",
    "body": [
      "Requests('$1', function () {});",
      "$2"
    ],
    "description": "create cy.crud"
  },
  "create snippet for path eq": {
    "scope": "javascript,typescript",
    "prefix": ".pe",
    "body": [
      "{path:'$1', eq: ''}",
      "$2"
    ],
    "description": "create cy.crud"
  },
  "create snippet for path expects": {
    "scope": "javascript,typescript",
    "prefix": "ex",
    "body": [
      "expects:[{path: ''}]",
      "$2"
    ],
    "description": "create cy.crud"
  },
  "create cy.save": {
    "scope": "javascript,typescript",
    "prefix": ".save",
    "body": [
      ".save({path:'$1'})"
    ],
    "description": "create cy.save"
  },
  "create cy.response": {
    "scope": "javascript,typescript",
    "prefix": ".bodyResponse",
    "body": [
      ".bodyResponse({path:'$1'})"
    ],
    "description": "create cy.response"
  },
  "create cy.bodyResponse": {
    "scope": "javascript,typescript",
    "prefix": ".resp",
    "body": [
      ".response({path:'$1'})"
    ],
    "description": "create cy.crud"
  },
  "create cy.res": {
    "scope": "javascript,typescript",
    "prefix": ".res",
    "body": [
      ".res({path:'$1'})"
    ],
    "description": "create cy.crud"
  },
  "create cy.expects": {
    "scope": "javascript,typescript",
    "prefix": ".expects",
    "body": [
      ".expects({path:'$1'})"
    ],
    "description": "create cy.expects"
  },
  "create cy.schema": {
    "scope": "javascript,typescript",
    "prefix": ".schema",
    "body": [
      ".schema({schema:'$1'})"
    ],
    "description": "create cy.expects"
  },
  "generate test describes its": {
    "scope": "javascript,typescript",
    "prefix": "test_des_its",
    "body": [
      "import {faker, clone, crudStorage} from '../support/e2e'; ",
      "describe('', function () {",
      "",
      "it('', function () {});});",
      "",
      "",
      "function rescue_save(params) {",
      " if (params) {",
      "return crudStorage.save[params];",
      " }",
      "return JSON.stringify(crudStorage.save);",
      "  }",
    ],
    "description": "generate full test describes its"
  },
  "generate test describes its text": {
    "scope": "javascript,typescript",
    "prefix": "complete_test",
    "body": [
      "import {faker, clone, crudStorage} from '../support/e2e'; ",
      "describe('$1', () => { ",

      "it('$1', () => {    });  });",
      "",
      "",
      "function rescue_save(params) {",
      " if (params) {",
      "return crudStorage.save[params];",
      " }",
      "return JSON.stringify(crudStorage.save);",
      "  }",
    ],
    "description": "generate full test describes its text"
  }
}
`;

try {
  const jsconfigFilePath = path.join(projectRootPathJsconfig, "jsconfig.json");

  const contentTsConfig = `{
  "compilerOptions": {
    // "target": "ES6",
    //"module": "commonjs",
    //"lib": ["es6", "dom"],
    // "baseUrl": "./",
    // "paths": {
    //   "@/*": ["./path/to/aliases/*"]
    // },
    "types": ["cypress"]
  },
  // "include": ["**/*"],
  "exclude": ["node_modules"]
}
`;

  fs.writeFileSync(jsconfigFilePath, contentTsConfig);
  fs.writeFileSync(supportConfigEnv, supportConfigEnv_content);
} catch (error) {
  console.error("Erro ao criar o arquivo jsconfig.json:", error);
}
const env_qa = path.join(projectRootPathJsconfig, "env_qa.js");

const contentEnv = `
const { defineConfig } = require("cypress");

const config = require("./cypress.config");

const e2e = {
  ...config.e2e,
  env: {
    endpoint: "https://restcountries.com/v3.1/translation/germany",
    reqres: "https://reqres.in/api/users/2",
    swagger: "https://fakerestapi.azurewebsites.net/api/v1/",
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
`;

fs.writeFileSync(env_qa, contentEnv);

if (!fs.existsSync(vscodeFolderPath)) {
  fs.mkdirSync(vscodeFolderPath);
}

fs.writeFileSync(snippetsFilePathSave, contentSave);
fs.writeFileSync(snippetsFilePath, snippetContent);

// add json
const projectRootPathJSON = path.resolve(__dirname, "../../cypress/fixtures/");
const vscodeFolderPathJSON = path.join(projectRootPathJSON, "examples");

const exampleJSON = path.join(projectRootPathJSON, "example_json.json");
const examploJSONContent = `{
    "get": "http://demo7018197.mockable.io/",
    "mock": "mocks/mockJson",
  "save": [],
  "expects":[]
}
`;
// fs.writeFileSync(exampleJSON, examploJSONContent);

const examploMockJson = path.join(
  projectRootPathJSON,
  "example_mock_json.json"
);
const examploMockJsonContent = `
{
  "response": {
    "status": 201,
    "body": { "id": 7, "name": "mock response" },
    "headers": { "Content-Type": "application/json" }
  }
}
`;
fs.writeFileSync(examploMockJson, examploMockJsonContent);

//mocks folder
const jsonExampleMock = path.join(projectRootPathJSON, "mocks");
const mocksJson = path.join(jsonExampleMock, "jsonWithMock.json");

const contentMock = `
{
  "response": {
    "status": 201,
    "body": { "id": 7, "name": "mock response" },
    "headers": { "Content-Type": "application/json" }
  }
}
`;
const payloadWithReplace = path.join(
  vscodeFolderPathJSON,
  "jsonReplaceAlias.json"
);
const contentReplaceAlias = `
{
    "post": "https://reqres.in/api/users/2",
    "body": null,
    "qs": null,
    "headers": {
      "Content-Type": "application/json",
      "Authorization": "Bearer {access_token}"
    }
}
`;

//schemas
const vscodeFolderPathJSONSchema = path.join(projectRootPathJSON, "schemas");
const snippetsFilePathJSONSchemas = path.join(
  vscodeFolderPathJSONSchema,
  "jsonSchema.json"
);

const jsonWithoutValidation = path.join(
  vscodeFolderPathJSON,
  "jsonWithoutValidation.json"
);
const snippetsFilePathNotAlias = path.join(
  vscodeFolderPathJSON,
  "jsonNotAlias.json"
);

const jsonBigData = path.join(vscodeFolderPathJSON, "big_data.json");
const jsonUsers = path.join(vscodeFolderPathJSON, "users.json");

const contentBigData = `
{

    "get": "http://demo7018197.mockable.io/",
    "headers": {
      "Content-Type": "application/json"
    },
  "expects": [
    
    { "path": "team", "eq": "John Doe" },
    { "path": "features", "eq": "Premium Interior" },
    { "path": "number", "eq": "123-456-7890" }
  ]
}

`;
const contentUsers = `
{
    "get": "https://fakerestapi.azurewebsites.net/api/v1/Users",
    "body": null,
    "qs": null,
    "headers": {
      "Content-Type": "application/json"
    }
}

`;

const contentJSonAliasNot = `
{
    "get": "https://reqres.in/api/users/2",
    "body": null,
    "qs": null,
    "headers": {
      "Content-Type": "application/json"
    },
  "expects": [{ "path": "first_name" }]
}
`;

const contentWithoutValid = `
{

    "get": "https://reqres.in/api/users/2",
    "body": null,
    "qs": null,
    "headers": {
      "Content-Type": "application/json"
  }
}
`;

const contentSchemas = `
{
  "$schema": "http://json-schema.org/draft-04/schema#",
  "type": "object",
  "properties": {
    "data": {
      "type": "object",
      "properties": {
        "id": {
          "type": "integer"
        },
        "email": {
          "type": "string"
        },
        "first_name": {
          "type": "string"
        },
        "last_name": {
          "type": "string"
        },
        "avatar": {
          "type": "string"
        }
      },
      "required": [
        "id",
        "email",
        "first_name",
        "last_name",
        "avatar"
      ]
    },
    "support": {
      "type": "object",
      "properties": {
        "url": {
          "type": "string"
        },
        "text": {
          "type": "string"
        }
      },
      "required": [
        "url",
        "text"
      ]
    }
  },
  "required": [
    "data",
    "support"
  ]
}
`;

const generateFileExample = path.resolve(__dirname, "../../cypress/e2e/");
const snipExample = path.join(generateFileExample, "crud.cy.js");

const contentExample = `
import { clone, crudStorage, faker } from "../support/e2e";
import json from "../fixtures/examples/big_data";
import users from "../fixtures/examples/users";

describe("Examples cypress-crud", () => {
  before(() => {
    crudStorage.save.name_mercado = faker.generateName();
    crudStorage.save.cnpj = faker.generateCNPJ();
    crudStorage.save.address = faker.generateStreet();
  });
  it("Example simple requisition", () => {
    cy.crud({ payload: "examples/jsonNotAlias" })
      .save({ path: "id" })
      .save({ path: "id", alias: "id_user" });
  });
  it("Example whit .bodyResponse", () => {
    cy.crud({ payload: "examples/jsonNotAlias" }).bodyResponse({
      path: "last_name",
      eq: "Weaver",
    });
  });

  it("Example whit .save and .write, create JSON response in", () => {
    cy.crud({ payload: "examples/jsonNotAlias" })
      .save({ path: "id" })
      .write({ path: "user/user" });
  });

  it("Example whit  .save", () => {
    cy.crud({ payload: "examples/jsonNotAlias" }).save({ path: "id" });
  });

  it("Example crud change JSON before request", () => {
    let json = require("../fixtures/examples/jsonNotAlias");
    let data = { ...json };

    data.body = { id: 3 };

    cy.crud({ payload: data });
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

  it("Example validate schema", () => {
    cy.crud({ payload: "examples/jsonNotAlias" }).validateSchema({
      schemas: "schemas/jsonSchema",
    });

    cy.log("ID first requisition", crudStorage.save.id_user);
  });

  it("Example simple requisition", () => {
    cy.crud({ payload: "examples/jsonNotAlias" }).save({
      path: "first_name",
      alias: "access_token",
    });
  });

  it("JSON 1", function () {
    cy.crud({ payload: "mockable/json1" });
  });

  it("JSON 2", function () {
    cy.crud({ payload: "mockable/json2" });
  });

  it("JSON 3", function () {
    cy.crud({ payload: "mockable/json3" });
  });
  it("JSON 4", function () {
    cy.crud({ payload: "mockable/json4" });
  });
  it("JSON 5", function () {
    cy.crud({ payload: "mockable/json5" });
  });
  it("JSON 6", function () {
    cy.crud({ payload: "mockable/json6" });
  });
  it("Big data testing", function () {
    cy.crud({ payload: json })
      .expects({
        path: "team",
        eq: "Maria Smith",
      })
      .save({ path: "team", eq: "Maria Smith" })
      .save({ path: "age", eq: 30, alias: "year" })
      .save({ path: "type", eq: "residential", alias: "address" })
      .save({ path: "name", eq: "Maria Smith", alias: "user" })
      .save({ path: "features", alias: "features" })
      // .save({ path: "features", alias: "features", position: 2 })
      .save({ path: "vehicle", alias: "veh" })
      .save({ path: "name", alias: "username" })
      .save({ path: "name", alias: "username", position: 2 })
      .save({ path: "addresses", alias: "addresses" });
  });

  it("POST data testing", function () {
    let data = clone(json);
    delete data.status;
    data.get = "https://reqres.in/api/users/2";
    data.body = {
      name: "{year} {address} {user}",
      city: "{address}",
      lastName: "{user}",
      vacation: "{features}",
      professional: "{veh}",
      addresses: "{addresses}",
    };
    delete data.expects;
    cy.crud({ payload: data });
    console.log(rescue_save());
  });
  it("Test in api save value id", () => {
    let data = clone(users);
    cy.crud({ payload: data }).save({
      path: "id",
      eq: 5,
      alias: "save_id_users",
    });
  });
  it("Test rescue save_id_users", () => {
    let data = clone(users);
    data.get += "/" + rescue_save("save_id_users");
    // data.req.path = 'save_id_users'
    data.expects = [{ path: "userName", eq: "User 5" }];
    cy.crud({ payload: data });
  });
  it("Rescue data save in alias", function () {
    console.log(rescue_save()); // save, token, access_token, etc.
    cy.log(rescue_save());
  });
});

describe("Test autenticação and validation schema", () => {
  crudStorage.save.name_mercado = faker.generateName();
  crudStorage.save.cnpj = faker.generateCNPJ();
  crudStorage.save.address = faker.generateStreet();
  const array_jsons = [
    { get: "swagger/mercado", status: 200 },
    {
      status: 201,
      post: "swagger/mercado",
      body: {
        nome: "{name_mercado}",
        cnpj: "{cnpj}",
        endereco: "{address}",
      },
      save: { path: "id" },
      expect: { path: "nome" },
    },
    {
      post: "endpoint_mercado/hortifruit/frutas",
      body: { nome: "Uva", valor: 7 },
      status: 201,
      save: { path: "id", as: "frutaId" },
    },
    {
      get: "endpoint_mercado/hortifruit/frutas",
      status: 200,
      expect: { path: "nome" },
    },

    {
      post: "endpoint_mercado/hortifruit/legumes",
      body: { nome: "Cenoura", valor: 12 },
      status: 201,
      save: { path: "id", as: "legumesId" },
    },
    {
      get: "endpoint_mercado/hortifruit/legumes",
      status: 200,
      expect: { path: "nome" },
    },
    {
      post: "endpoint_mercado/padaria/doces",
      body: { nome: "Brigadeiro", valor: 10 },
      status: 201,
      save: { path: "id", as: "docesId" },
    },
    {
      get: "endpoint_mercado/padaria/doces",
      status: 200,
      expect: { path: "nome" },
    },
    {
      post: "endpoint_mercado/padaria/salgados",
      body: { nome: "Pastel", valor: 10 },
      status: 201,
      save: { path: "id", as: "salgadosId" },
    },
    {
      get: "endpoint_mercado/padaria/salgados",
      status: 200,
      expect: { path: "nome" },
    },
    {
      post: "swagger/mercado/{id}/produtos/acougue/bovinos",
      body: { nome: "Picanha", valor: 10 },
      status: 201,
    },
    {
      get: "swagger/mercado/{id}/produtos/acougue/bovinos",
      status: 200,
      expect: { path: "nome" },
    },
    {
      post: "swagger/mercado/{id}/produtos/acougue/suinos",
      body: { nome: "Bacon", valor: 10 },
      status: 201,
    },
    {
      get: "swagger/mercado/{id}/produtos/acougue/suinos",
      status: 200,
      expect: { path: "nome" },
    },
    {
      post: "swagger/mercado/{id}/produtos/acougue/aves",
      body: { nome: "Coxa de Frango", valor: 10 },
      status: 201,
      save: { path: "id", as: "avesId" },
    },
    {
      get: "swagger/mercado/{id}/produtos/acougue/aves",
      status: 200,
      expect: { path: "nome" },
    },
  ];

  it("Runner in array json", () => {
    for (let index = 0; index < array_jsons.length; index++) {
      cy.crud(array_jsons[index]);
    }
  });
});
function rescue_save(params) {
  if (params) {
    return crudStorage.save[params];
  }
  return JSON.stringify(crudStorage.save);
}
after(() => {
  console.log(crudStorage.request);
  console.log(crudStorage.response);
});

`;

fs.writeFileSync(snipExample, contentExample);

if (!fs.existsSync(vscodeFolderPathJSON)) {
  fs.mkdirSync(vscodeFolderPathJSON);
}

// replace
fs.writeFileSync(payloadWithReplace, contentReplaceAlias);

if (!fs.existsSync(vscodeFolderPathJSONSchema)) {
  fs.mkdirSync(vscodeFolderPathJSONSchema);
}

// mock
if (!fs.existsSync(jsonExampleMock)) {
  fs.mkdirSync(jsonExampleMock);
}
fs.writeFileSync(mocksJson, contentMock);

//schemas
fs.writeFileSync(snippetsFilePathJSONSchemas, contentSchemas);

fs.writeFileSync(jsonBigData, contentBigData);
fs.writeFileSync(jsonUsers, contentUsers);

fs.writeFileSync(jsonWithoutValidation, contentWithoutValid);

fs.writeFileSync(snippetsFilePathNotAlias, contentJSonAliasNot);

const configPath = path.resolve(__dirname, "../../");
const jsconfigFilePath = path.join(configPath, "cypress.config.js");
const newContent = `
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

`;

fs.writeFile(jsconfigFilePath, newContent, "utf8", function (err) {});
const jsonExampleMockable = path.join(projectRootPathJSON, "mockable");
// mock
if (!fs.existsSync(jsonExampleMockable)) {
  fs.mkdirSync(jsonExampleMockable);
}
// mock json 1
const mocksJson1 = path.join(jsonExampleMockable, "json1.json");
const contentMock1 = `
{
  "get": "https://demo8370198.mockable.io/",
  "body": null,
  "qs": null,
  "headers": {
    "Content-Type": "application/json"
  },
  "expects": [{ "path": "street", "eq": "Gordon Russell 123" }]
}

`;
fs.writeFileSync(mocksJson1, contentMock1);
//
// mock json 2
const mocksJson2 = path.join(jsonExampleMockable, "json2.json");
const contentMock2 = `
{

    "get": "https://demo8168190.mockable.io/",
    "body": null,
    "qs": null,
    "headers": {
      "Content-Type": "application/json"
    },
  "expects": [
    { "path": "Order", "eq": 2 }
  ]
}
`;
fs.writeFileSync(mocksJson2, contentMock2);
//
// mock json 3
const mocksJson3 = path.join(jsonExampleMockable, "json3.json");
const contentMock3 = `
{

    "get": "https://demo0065046.mockable.io/",
    "body": null,
    "qs": null,
    "headers": {
      "Content-Type": "application/json"
    },
  "expects": [
    { "path": "city", "eq": "Matthews" }
  ]
}
`;
fs.writeFileSync(mocksJson3, contentMock3);
//

// mock json 4
const mocksJson4 = path.join(jsonExampleMockable, "json4.json");
const mocks4 = path.join(jsonExampleMock, "jsonmock4.json");

const contentMock4 = `
{
    "get": "https://demo0065046.mockable.io/",
    "mock": "mocks/jsonmock4",
    "body": null,
    "qs": null,
    "headers": {
      "Content-Type": "application/json"
    },
  "expects": [
    { "path": "social", "eq": "Ford" },
    { "path": "name", "eq": "Nimiror" },
    { "path": "key", "eq": 336699 },
    { "path": "permissions", "eq": "full" }
  ]
}

`;
const contentMocks4 = `
{
  "response": {
    "status": 200,
    "body": {
      "users_funcionarios": [
        {
          "name": "Nimiror",
          "enterprise": "Tesla"
        },
        {
          "name": "Gilwen",
          "enterprise": "Ford"
        },
        {
          "name": "Tinucufa",
          "enterprise": "Ferrari"
        },
        {
          "name": "Arel",
          "enterprise": "Nitro"
        },
        {
          "name": "Saessell",
          "enterprise": "Microsoft"
        }
      ],
      "enterprises": [
        {
          "social": "Tesla",
          "foundation": "1987",
          "access_key": {
            "authorization": {
              "key": 202010
            }
          }
        },
        {
          "social": "Ford",
          "foundation": 1975,
          "access_key": [
            {
              "authorization": {
                "key": 369852
              }
            }
          ]
        },
        {
          "social": "Ferrari Ltda",
          "foundation": 1875,
          "access_key": {
            "authorization": [147852, 369852]
          }
        },
        {
          "social": "Enterprise Nitro Foundation",
          "foundation": 2001,
          "access_key": [
            {
              "name_root": "Michael"
            },
            {
              "key": 336699
            }
          ]
        },
        {
          "social": "Foundation Word Microsoft",
          "foundation": "1965",
          "access_key": {
            "one_state": {
              "authorization": [
                {
                  "access": {
                    "root": [
                      {
                        "permissions": "full"
                      },
                      {
                        "key": 456123
                      }
                    ]
                  }
                }
              ]
            }
          }
        }
      ],
      "desafio": "Imagine que isso remete a um acesso empresarial, onde existem várias empresas e cada uma tem seu sistema. Então, de acordo com a lista de usuários e a empresa que ele trabalha no campo Enterprise, imprima o seguinte texto: Meu nome é xxxx trabalho na xxxx meu código de acesso é xxxx. Para todos os usuários na lista."
    },
    "headers": { "Content-Type": "application/json" }
  }
}
`;
fs.writeFileSync(mocksJson4, contentMock4);
fs.writeFileSync(mocks4, contentMocks4);

//

// mock json 5
const mocksJson5 = path.join(jsonExampleMockable, "json5.json");
const mocks5 = path.join(jsonExampleMock, "jsonmock5.json");

const contentMock5 = `
{

    "get": "https://demo0065046.mockable.io/",
    "mock": "mocks/jsonmock5",
    "body": null,
    "qs": null,
    "headers": {
      "Content-Type": "application/json"
    },
  "expects": [
    { "path": "title" },
    { "path": "main" },
    { "path": "title_quarta_camada" }
  ]
}
`;
const contentMocks5 = `

{
  "response": {
    "status": 200,
    "body": [
      {
        "users": [
          {
            "main": [
              {
                "intro": [
                  {
                    "title": "desafio",
                    "description": "Impossível de validar"
                  },
                  {
                    "primeira_camada": [
                      {
                        "segunda_camada": [
                          {
                            "title_segunda_camada": "difícil chegar aqui"
                          },
                          {
                            "terceira_camada": [
                              {
                                "title_terceira_camada": "cada vez mais difícil"
                              },
                              {
                                "quarta_camada": [
                                  {
                                    "title_quarta_camada": "complicando ainda mais"
                                  },
                                  {
                                    "objeto_quarta_camada": {
                                      "title": "as vezes a camada precisa de uns objetos pra complicar",
                                      "objeto_dentro_de_objeto_da_quarta_camada": {
                                        "title": "Ainda mais complicado, 2 objetos dentro de uma camada",
                                        "terceiro_objeto_da_camada": "é impossível ter um json assim kkk"
                                      }
                                    }
                                  },
                                  {
                                    "quinta_camada": [
                                      {
                                        "title": "depois da quarta-camada a quinta pode complicar mais ainda",
                                        "intro_quinta_camada": [
                                          {
                                            "title": "essa intro complica mais ainda porque nasceu um array dentor de um objeto da quinta camada. Assim não dá."
                                          }
                                        ]
                                      },
                                      {
                                        "sexta_camada": [
                                          {
                                            "title": "ah, sexta camada, normal, simples, sem complicações"
                                          },
                                          {
                                            "intro_sexta_camada": {
                                              "array_sexta_camada": [
                                                {
                                                  "title": "acima tem um array dentro de um objeto, que complicado"
                                                },
                                                {
                                                  "objeto_sexta_camada": {
                                                    "title": "segundo objeto da camada-array tem outro objeto dentro, impossível isso."
                                                  }
                                                },
                                                {
                                                  "title_sem_objeto": "Acho que 6 camadas são suficiente"
                                                }
                                              ]
                                            }
                                          }
                                        ]
                                      }
                                    ]
                                  }
                                ]
                              }
                            ]
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "desafio": "Se desafie, valide todos os campos, entrando em todas as camadas, JSON praticamente impossível no mercado, mas vai te dar um conhecimento ABSURDO."
      }
    ],
    "headers": { "Content-Type": "application/json" }
  }
}

`;
fs.writeFileSync(mocksJson5, contentMock5);
fs.writeFileSync(mocks5, contentMocks5);

//
// mock json 5
const mocksJson6 = path.join(jsonExampleMockable, "json6.json");
const mocks6 = path.join(jsonExampleMock, "jsonmock6.json");

const contentMock6 = `
{

    "get": "https://demo0065046.mockable.io/",
    "mock": "mocks/jsonmock6",
    "body": null,
    "qs": null,
    "headers": {
      "Content-Type": "application/json"
    },
  "expects": [
    { "path": "bancos" },
    { "path": "cnpj", "eq": 35143510351514 }
  ]
}

`;
const contentMocks6 = `
{
  "response": {
    "status": 200,
    "body": [
      {
        "bancos": [
          {
            "cnpj": 35143510351514,
            "credito": {
              "lista_de_creditos": [
                {
                  "name": "Básico",
                  "salario_requerido": 3000,
                  "capital_empresa": 60000,
                  "consulta_cpf/cnpj": {
                    "required": false,
                    "credito_pessoal": 10000,
                    "credito_empresarial": 100000
                  }
                },
                {
                  "name": "PLUS",
                  "salario_requerido": 5000,
                  "capital_empresa": 80000,
                  "consulta_cpf/cnpj": {
                    "required": true,
                    "credito_pessoal": 20000,
                    "credito_empresarial": 200000
                  }
                },
                {
                  "name": "MAX",
                  "salario_requerido": 10000,
                  "capital_empresa": 500000,
                  "consulta_cpf/cnpj": {
                    "required": true,
                    "credito_pessoal": 100000,
                    "credito_empresarial": 10000000
                  }
                }
              ]
            }
          },
          {
            "cnpj": 314614651651663,
            "credito": {
              "lista_de_creditos": [
                {
                  "name": "Básico",
                  "salario_requerido": 4000,
                  "capital_empresa": 70000,
                  "consulta_cpf/cnpj": {
                    "required": false,
                    "credito_pessoal": 30000,
                    "credito_empresarial": 300000
                  }
                },
                {
                  "name": "PLUS",
                  "salario_requerido": 6000,
                  "capital_empresa": 90000,
                  "consulta_cpf/cnpj": {
                    "required": false,
                    "credito_pessoal": 30000,
                    "credito_empresarial": 400000
                  }
                },
                {
                  "name": "MAX",
                  "salario_requerido": 20000,
                  "capital_empresa": 600000,
                  "consulta_cpf/cnpj": {
                    "required": true,
                    "credito_pessoal": 200000,
                    "credito_empresarial": 30000000
                  }
                }
              ]
            }
          },
          {
            "cnpj": 3541861465181636,
            "credito": {
              "lista_de_creditos": [
                {
                  "name": "Básico",
                  "salario_requerido": 7000,
                  "capital_empresa": 100000,
                  "consulta_cpf/cnpj": {
                    "required": true,
                    "credito_pessoal": 1000000,
                    "credito_empresarial": 10000000
                  }
                },
                {
                  "name": "PLUS",
                  "salario_requerido": 8000,
                  "capital_empresa": 100000,
                  "consulta_cpf/cnpj": {
                    "required": true,
                    "credito_pessoal": 200000,
                    "credito_empresarial": 2000000
                  }
                },
                {
                  "name": "MAX",
                  "salario_requerido": 100000,
                  "capital_empresa": 5000000,
                  "consulta_cpf/cnpj": {
                    "required": true,
                    "credito_pessoal": 1000000,
                    "credito_empresarial": 100000000
                  }
                }
              ]
            }
          }
        ]
      },
      {
        "data_bancos": [
          {
            "name": "Banco SA",
            "cnpj": 35143510351514
          },
          {
            "name": "Banco Forbs",
            "cnpj": 314614651651663
          },
          {
            "name": "Banco Heiks",
            "cnpj": 3541861465181636
          }
        ]
      },
      {
        "clientes": [
          {
            "name": "Miguel",
            "salario": 3000,
            "restrições_cpf": true
          },
          {
            "name": "Gabriel",
            "salario": 10000,
            "restrições_cpf": false
          },
          {
            "name": "Rafael",
            "salario": 5000,
            "restrições_cpf": false
          },
          {
            "name": "Luiz",
            "salario": 30000,
            "restrições_cpf": true
          }
        ]
      },
      {
        "empresas": [
          {
            "name": "Black Djarum",
            "valor_capital": 100000
          },
          {
            "name": "Nice Vinhos",
            "valor_capital": 500000,
            "restricoes": true
          },
          {
            "name": "Live Car",
            "valor_capital": 10000000
          }
        ]
      },
      {
        "desafio": "Listar/Imprimir quais bancos os clientes e empresas podem pedir crédito de acordo com seu salario/valor_capital e exigencia ou não de restrição no cpf/cnpj"
      }
    ],

    "headers": { "Content-Type": "application/json" }
  }
}

`;
fs.writeFileSync(mocksJson6, contentMock6);
fs.writeFileSync(mocks6, contentMocks6);

//
