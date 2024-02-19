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

const supportFilePath = path.join(projectRoot, "cypress/support/e2e.js");

const contentToAdd = `
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

const projectRootPath = path.resolve(__dirname, "../../");
const vscodeFolderPath = path.join(projectRootPath, ".vscode");

const snippetsFilePath = path.join(vscodeFolderPath, "action.code-snippets");
const snippetsFilePathSave = path.join(vscodeFolderPath, "settings.json");
const contentSave = `{"editor.formatOnSave":true, "cSpell.words": ["Cenario", "datafaker", "Entao"]}`;

const snippetContent = `

{ 
  "create cy.crud": {
  "scope": "javascript,typescript",
  "prefix": "crud",
  "body": ["cy.crud({payload:'$1'})", "$2"],
  "description": "create cy.crud"
},
"create snippet for path": {
  "scope": "javascript,typescript",
  "prefix": ".p",
  "body": ["{path:'$1'}", "$2"],
  "description": "create cy.crud"
},
"create snippet for requests": {
  "scope": "javascript,typescript",
  "prefix": "requests",
  "body": ["Requests('$1', function () {});", "$2"],
  "description": "create cy.crud"
},
"create snippet for path eq": {
  "scope": "javascript,typescript",
  "prefix": ".pe",
  "body": ["{path:'$1', eq: ''}", "$2"],
  "description": "create cy.crud"
},
"create snippet for path expects": {
  "scope": "javascript,typescript",
  "prefix": "ex",
  "body": ["expects:[{path: ''}]", "$2"],
  "description": "create cy.crud"
},
  "create cy.save": {
  "scope": "javascript,typescript",
  "prefix": ".save",
  "body": [".save({path:'$1'})"],
  "description": "create cy.save"
},
"create cy.response": {
  "scope": "javascript,typescript",
  "prefix": ".bodyResponse",
  "body": [".bodyResponse({path:'$1'})"],
  "description": "create cy.response"
},
"create cy.bodyResponse": {
  "scope": "javascript,typescript",
  "prefix": ".resp",
  "body": [".response({path:'$1'})"],
  "description": "create cy.crud"
},
"create cy.res": {
  "scope": "javascript,typescript",
  "prefix": ".res",
  "body": [".res({path:'$1'})"],
  "description": "create cy.crud"
},
"create cy.expects": {
  "scope": "javascript,typescript",
  "prefix": ".expects",
  "body": [".expects({path:'$1'})"],
  "description": "create cy.expects"
},
"create cy.schema": {
  "scope": "javascript,typescript",
  "prefix": ".schema",
  "body": [".schema({schema:'$1'})"],
  "description": "create cy.expects"
},
"generate scenario": {
  "scope": "javascript,typescript",
  "prefix": "scenario",
  "body": ["Scenario('$1', function()  {}, {});", "$2"],
  "description": "generate scenario"
},
"generate given": {
  "scope": "javascript,typescript",
  "prefix": "given",
  "body": ["Given('$1', function()  {}, {});", "$2"],
  "description": "generate given"
},
"generate when": {
  "scope": "javascript,typescript",
  "prefix": "when",
  "body": ["when('$1', function()  {}, {});", "$2"],
  "description": "generate when"
},
"generate And": {
  "scope": "javascript,typescript",
  "prefix": "and",
  "body": ["And('$1', function()  {}, {});", "$2"],
  "description": "generate And"
},
"generate Then": {
  "scope": "javascript,typescript",
  "prefix": "then",
  "body": ["Then('$1', function()  {}, {});", "$2"],
  "description": "generate Then"
},
"generate cenario": {
  "scope": "javascript,typescript",
  "prefix": "cenario",
  "body": ["Cenario('$1', function()  {}, {});", "$2"],
  "description": "generate Cenario"
},
"generate Dado": {
  "scope": "javascript,typescript",
  "prefix": "dado",
  "body": ["Dado('$1', function()  {}, {});", "$2"],
  "description": "generate Dado"
},
"generate Quando": {
  "scope": "javascript,typescript",
  "prefix": "quando",
  "body": ["Quando('$1', function()  {}, {});", "$2"],
  "description": "generate Quando"
},
"generate E": {
  "scope": "javascript,typescript",
  "prefix": "e",
  "body": ["E('$1', function()  {}, {});", "$2"],
  "description": "generate E"
},
"generate Entao": {
  "scope": "javascript,typescript",
  "prefix": "entao",
  "body": ["Entao('$1', function()  {}, {});", "$2"],
  "description": "generate Entao"
},
 "generate test bdd": {
  "scope": "javascript,typescript",
  "prefix": "test_bdd",
  "body": ["import {Given, Scenario,faker, When,And, Then} from '../support/e2e'; ",
  "Scenario('', function () {",
   "before(() => {cy.visit(''); });",
   "Given('', function () {}, {});});"],
  "description": "generate full test"
},
"generate test describes its": {
  "scope": "javascript,typescript",
  "prefix": "test_des_its",
  "body": ["import {faker, clone, crudStorage} from '../support/e2e'; ",
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
"generate test crud": {
  "scope": "javascript,typescript",
  "prefix": "test_crud_generate",
  "body": [
  "import { faker, clone, crudStorage, POST, GET, Request } from '../support/e2e';",
  "Request('', function () {",
  "",
   "GET('', function () {});});",
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
"generate POST": {
  "scope": "javascript,typescript",
  "prefix": "post",
  "body": ["POST('$1', function () {});", "$2"],
  "description": "generate post"
},
"generate GET": {
  "scope": "javascript,typescript",
  "prefix": "get",
  "body": ["GET('$1', function () {});", "$2"],
  "description": "generate get"
},
"generate PUT": {
  "scope": "javascript,typescript",
  "prefix": "put",
  "body": ["PUT('$1', function () {});", "$2"],
  "description": "generate PUT"
},
"generate DELETE": {
  "scope": "javascript,typescript",
  "prefix": "delete",
  "body": ["DELETE('$1', function () {});", "$2"],
  "description": "generate DELETE"
},
"generate PATH": {
  "scope": "javascript,typescript",
  "prefix": "path",
  "body": ["PATH('$1', function () {});", "$2"],
  "description": "generate PATH"
},
 "generate test": {
  "scope": "javascript,typescript",
  "prefix": "test_bdd_BR",
  "body": ["import {Dado, Cenario, faker, Quando,E, Entao} from '../support/e2e'; ",
   "Cenario('$1', function () {",
   "before(() => {cy.visit(''); })",
  "Dado('$2', function () {}, {});",
  "Quando('$3', function () {}, {});",
  "E('$4', function () {}, {});",
  "Entao('$5', function () {}, {});",
  "});"
  ],
  "description": "generate full test"
}

}

`;
const projectRootPathJsconfig = path.resolve(__dirname, "../../");

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
} catch (error) {
  console.error("Erro ao criar o arquivo jsconfig.json:", error);
}


if (!fs.existsSync(vscodeFolderPath)) {
  fs.mkdirSync(vscodeFolderPath);
}

fs.writeFileSync(snippetsFilePathSave, contentSave);
fs.writeFileSync(snippetsFilePath, snippetContent);

// add json
const projectRootPathJSON = path.resolve(__dirname, "../../cypress/fixtures/");
const vscodeFolderPathJSON = path.join(projectRootPathJSON, "examples");


const exampleJSON = path.join(projectRootPathJSON, "example_json.json")
const examploJSONContent = `{
  "request": {
    "method": "GET",
    "url": "http://demo7018197.mockable.io/",
    "mock": "mocks/mockJson"
  },
  "save": [],
  "expects":[]
}
`
fs.writeFileSync(exampleJSON, examploJSONContent);

const examploMockJson = path.join(projectRootPathJSON, "example_mock_json.json")
const examploMockJsonContent = `{
  "intercept": {
    "method": "GET",
    "url": "/users/2"
  },
  "response": {
    "status": 200,
    "body": {},
    "headers": { "Content-Type": "application/json" }
  }
}`
fs.writeFileSync(examploMockJson, examploMockJsonContent);


//mocks folder
const jsonExampleMock = path.join(projectRootPathJSON, "mocks");
const mocksJson = path.join(jsonExampleMock, "jsonWithMock.json");




const contentMock = `
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
`;
const payloadWithReplace = path.join(
  vscodeFolderPathJSON,
  "jsonReplaceAlias.json"
);
const contentReplaceAlias = `
{
  "request": {
    "method": "POST",
    "url": "https://reqres.in/api/users/2",
    "replace": "access_token",
    "body": null,
    "qs": null,
    "headers": {
      "Content-Type": "application/json",
      "Authorization": "Bearer access_token"
    }
  }
}
`;
const mockRequestJson = path.join(vscodeFolderPathJSON, "jsonGETMock.json");

const contentRequestMock = `
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
  "expects": [{ "path": "status", "eq": 201 }, { "path": "id" }]
}

`;

//schemas
const vscodeFolderPathJSONSchema = path.join(projectRootPathJSON, "schemas");
const snippetsFilePathJSONSchemas = path.join(
  vscodeFolderPathJSONSchema,
  "jsonSchema.json"
);

const snippetsFilePathJSON = path.join(vscodeFolderPathJSON, "jsonAlias.json");
const jsonWhitParam = path.join(vscodeFolderPathJSON, "jsonWithParam.json");

const jsonWithoutValidation = path.join(
  vscodeFolderPathJSON,
  "jsonWithoutValidation.json"
);
const snippetsFilePathNotAlias = path.join(
  vscodeFolderPathJSON,
  "jsonNotAlias.json"
);
const snippetsFileEndpoint = path.join(
  vscodeFolderPathJSON,
  "jsonEndpoint.json"
);
const jsonBigData = path.join(
  vscodeFolderPathJSON,
  "big_data.json"
);
const jsonUsers = path.join(
  vscodeFolderPathJSON,
  "users.json"
);

const snippetsFileEndpointArray = path.join(
  vscodeFolderPathJSON,
  "jsonGetArray.json"
);
const contentEndpointArray = `
{
  "request": {
    "method": "GET",
    "url": "https://reqres.in/api/users?page=2",
    "body": null,
    "qs": null,
    "headers": {
      "Content-Type": "application/json"
    }
  }
}
`;
const jsonWithParamContent = `
{
  "request": {
    "method": "GET",
    "url": "https://reqres.in/api/users?page=2",
    "path": "id_user/continueEndpoint",
    "body": null,
    "qs": null,
    "headers": {
      "Content-Type": "application/json"
    }
  }
}
`;

const contentEndpoint = `
{
  "endpoint": "getUser",
  "request": {
    "method": "POST",
    "url": "https://reqres.in/api/users/2",
    "body": null,
    "qs": null,
    "headers": {
      "Content-Type": "application/json"
    }
  }
}
`;

const contentBigData = `
{
  "request": {
    "method": "GET",
    "url": "http://demo7018197.mockable.io/",
    "headers": {
      "Content-Type": "application/json"
    }
  },
  "expects": [
    { "path": "status", "eq": 200 },
    { "path": "team", "eq": "John Doe" },
    { "path": "features", "eq": "Premium Interior" },
    { "path": "number", "eq": "123-456-7890" }
  ]
}

`;
const contentUsers = `
{
  "request": {
    "method": "GET",
    "url": "https://fakerestapi.azurewebsites.net/api/v1/Users",
    "body": null,
    "qs": null,
    "headers": {
      "Content-Type": "application/json"
    }
  },
  "expects": [{ "path": "status", "eq": 200 }]
}

`;

const contentJSonAlias = `
{
  "request": {
    "method": "POST",
    "url": "https://reqres.in/api/users/2",
    "path": "save",
    "body": null,
    "qs": null,
    "headers": {
      "Content-Type": "application/json"
    }
  },
  "expects": [{ "path": "status", "eq": 201 }, { "path": "id" }]
}
`;

const contentJSonAliasNot = `
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
  "expects": [{ "path": "status", "eq": 200 }, { "path": "first_name" }]
}
`;

const contentWithoutValid = `
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

describe("template spec", () => {
  afterEach(() => {
    cy.crudScreenshot();
  });
  it("Example simple requisition", () => {
    cy.crud({ payload: "examples/jsonNotAlias" })
      .save({ path: "id" })
      .save({ path: "id", alias: "id_user" });
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
    cy.crud({ payload: "examples/jsonNotAlias" }).save({ path: "id" });
    // .crudScreenshot(); // or save({path:'id', log: false}) // save id 7
  });

  it("Example whit .save and .write, create JSON response in", () => {
    cy.crud({ payload: "examples/jsonNotAlias" })
      .save({ path: "id" }) // or save({path:'id', log: false})
      .write({ path: "user/user" });
    //.crudScreenshot(); // save in fixtures/user/user.json .write() // save in fixtures/response.json
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
    // .crudScreenshot(); ;
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
    // chanve environment and new endpoint add
    let env = Cypress.env();
    env.environment = "DEV";
    env.DEV = {
      getUser: "https://reqres.in/api/users/2",
    };
    console.log(env);
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
        path: "id/continueWhitWndpoint",
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
        path: "id/continueWhitWndpoint",
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

  it("Example simple requisition whit MOCK", () => {
    cy.crud({ payload: "examples/jsonGETMock" });
  });
  it("Example simple requisition", () => {
    cy.crud({ payload: "examples/jsonNotAlias" }).save({
      path: "first_name",
      alias: "access_token",
    });
  });
  it("Example simple requisition with replace token, param, etc...", () => {
    cy.crud({ payload: "examples/jsonReplaceAlias" })
      .save({
        path: "Authorization",
      })
      .save({ path: "Authorization", position: 1 });
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
    data.request.method = "POST";
    data.request.url = "https://reqres.in/api/users/2";
    data.request.replace =
      "save, year, address, user, features, veh, addresses";
    data.request.body = {
      name: "year address user",
      city: "address",
      lastName: "user",
      vacation: "features",
      professional: "veh",
      addresses: "addresses",
    };
    data.expects = [{ path: "status", eq: 201 }];
    cy.crud({ payload: data });
    console.log(rescue_save());
  });
  it("Test in api save value id", () => {
    cy.crud({ payload: users }).save({
      path: "id",
      eq: 5,
      alias: "save_id_users",
    });
  });
  it("Test rescue save_id_users", () => {
    let data = clone(users);
    data.request.url += "/" + rescue_save("save_id_users");
    // data.request.path = 'save_id_users'
    data.expects = [{ path: "userName", eq: "User 5" }, { path: "status" }];
    cy.crud({ payload: data });
  });
  it("Rescue data save in alias", function () {
    console.log(rescue_save()); // save, token, access_token, etc.
    cy.log(rescue_save());
  });
  it("GET Rest Countries", () => {
    let payload = {
      // set in file .json payload.json
      request: {
        method: "GET",
        url: "https://restcountries.com/v3.1/name/eesti",
      },
      expect: [
        { path: "common" },
        { path: "common", type: "array" },
        { path: "tld" },
        { path: "cca2" },
        { path: "common", position: 3 },
        { path: "cioc" },
        { path: "independent", eq: true },
        { path: "kor" },
        { path: "latlng" },
        { path: "borders" },
        { path: "f" },
        { path: "postalCode" },
        { path: "status" },
        { path: "EUR" },
        { path: "suffixes" },
        { path: "symbol" },
        { path: "timezones" },
        { path: "flag" },
        { path: "flags" },
        { path: "car" },
        { path: "signs" },
        { path: "startOfWeek" },
        { path: "region" },
        { path: "official" },
        { path: "root", eq: "+3" },
        { path: "side" },
        { path: "side", eq: "right" },
        { path: "side", eq: "right", type: "string" },
      ],
    };
    // set path fixtures payload.json ex: cy.crud({path: '../fixtures/payload.json'})
    cy.crud({ payload: payload });
  });

  it("GET Rest Countries EESTI and save[alias] search TRUE", () => {
    let payload = {
      // set in file .json payload.json
      request: {
        method: "GET",
        url: "https://restcountries.com/v3.1/name/eesti",
      },
      expect: [
        { search: ".ee" },
        { search: ".ee", alias: "ee" },
        { search: "€" },
        { search: "€", alias: "euro" },
        { search: 200, alias: "status" },
        { search: "EST", alias: "est" },
      ],
    };
    // set path fixtures payload.json ex: cy.crud({path: '../fixtures/payload.json'})
    cy.crud({ payload: payload });
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

// request mock
fs.writeFileSync(mockRequestJson, contentRequestMock);

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

fs.writeFileSync(snippetsFilePathJSON, contentJSonAlias);
fs.writeFileSync(jsonWhitParam, jsonWithParamContent);

//schemas
fs.writeFileSync(snippetsFilePathJSONSchemas, contentSchemas);

fs.writeFileSync(snippetsFileEndpoint, contentEndpoint);
fs.writeFileSync(jsonBigData, contentBigData);
fs.writeFileSync(jsonUsers, contentUsers);

fs.writeFileSync(snippetsFileEndpointArray, contentEndpointArray);

fs.writeFileSync(jsonWithoutValidation, contentWithoutValid);

fs.writeFileSync(snippetsFilePathNotAlias, contentJSonAliasNot);

const configPath = path.resolve(__dirname, "../../");
const jsconfigFilePath = path.join(configPath, "cypress.config.js");
const newContent = `
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
  "request": {
    "method": "GET",
    "url": "https://demo8370198.mockable.io/",
    "body": null,
    "qs": null,
    "headers": {
      "Content-Type": "application/json"
    }
  },
  "expects": [
    { "path": "status", "eq": 200 },
    { "path": "street", "eq": "Gordon Russell 123" }
  ]
}

`;
fs.writeFileSync(mocksJson1, contentMock1);
//
// mock json 2
const mocksJson2 = path.join(jsonExampleMockable, "json2.json");
const contentMock2 = `
{
  "request": {
    "method": "GET",
    "url": "https://demo8168190.mockable.io/",
    "body": null,
    "qs": null,
    "headers": {
      "Content-Type": "application/json"
    }
  },
  "expects": [
    { "path": "status", "eq": 200 },
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
  "request": {
    "method": "GET",
    "url": "https://demo0065046.mockable.io/",
    "body": null,
    "qs": null,
    "headers": {
      "Content-Type": "application/json"
    }
  },
  "expects": [
    { "path": "status", "eq": 200 },
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
  "request": {
    "method": "GET",
    "url": "https://demo0065046.mockable.io/",
    "mock": "mocks/jsonmock4",
    "body": null,
    "qs": null,
    "headers": {
      "Content-Type": "application/json"
    }
  },
  "expects": [
    { "path": "status", "eq": 200 },
    { "path": "social", "eq": "Ford" },
    { "path": "name", "eq": "Nimiror" },
    { "path": "key", "eq": 336699 },
    { "path": "permissions", "eq": "full" }
  ]
}

`;
const contentMocks4 = `
{
  "intercept": {
    "method": "GET",
    "url": "/users/2"
  },
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
  "request": {
    "method": "GET",
    "url": "https://demo0065046.mockable.io/",
    "mock": "mocks/jsonmock5",
    "body": null,
    "qs": null,
    "headers": {
      "Content-Type": "application/json"
    }
  },
  "expects": [
    { "path": "status", "eq": 200 },
    { "path": "title" },
    { "path": "main" },
    { "path": "title_quarta_camada" }
  ]
}
`;
const contentMocks5 = `

{
  "intercept": {
    "method": "GET",
    "url": "/users/2"
  },
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
  "request": {
    "method": "GET",
    "url": "https://demo0065046.mockable.io/",
    "mock": "mocks/jsonmock6",
    "body": null,
    "qs": null,
    "headers": {
      "Content-Type": "application/json"
    }
  },
  "expects": [
    { "path": "status" },
    { "path": "bancos" },
    { "path": "cnpj", "eq": 35143510351514 }
  ]
}

`;
const contentMocks6 = `
{
  "intercept": {
    "method": "GET",
    "url": "/users/2"
  },
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
