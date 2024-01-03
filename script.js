const fs = require("fs");
const path = require("path");

function findProjectRoot(dir) {
  const isPackageJsonPresent = fs.existsSync(path.join(dir, "package.json"));
  const isInNodeModules = dir.includes("node_modules");

  if (isPackageJsonPresent && !isInNodeModules) {
    // Diretório raiz do projeto encontrado
    return dir;
  }

  const parentDir = path.dirname(dir);
  if (parentDir === dir) {
    // Chegamos ao diretório raiz do sistema sem encontrar o diretório do projeto
    throw new Error("Não foi possível encontrar o diretório raiz do projeto.");
  }

  // Recursivamente subir na hierarquia de diretórios
  return findProjectRoot(parentDir);
}

// Encontrar o diretório raiz do projeto a partir do diretório atual
const projectRoot = findProjectRoot(__dirname);

// Construir o caminho para o arquivo e2e.js
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
} from "cypress-crud/src/gherkin/bdd.js";
import "cypress-plugin-steps";
export const faker = require("generate-datafaker");
import "cypress-crud";
import "cypress-plugin-api";
import "cypress-mochawesome-reporter/register";


// USE IN cypress.config.js

  // testIsolation: false,
  // experimentalRunAllSpecs: true,
  // env: {
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
  // },

  // example use in crudScreenshot whit report
 // const { defineConfig } = require("cypress");

// module.exports = defineConfig({
//   reporter: "cypress-mochawesome-reporter",

//   e2e: {
//     setupNodeEvents(on, config) {
//       require("cypress-mochawesome-reporter/plugin")(on);
//       on("task", {
//         crudLog(message) {
//           console.log(message);
//           return null;
//         },
//       });
//       // implement node event listeners here
//     },
//   },
//   env: {
//     screenshot: true, // required true, for active screenshot
//   },
// });


`;

const appendToFile = (filePath, content) => {
  if (fs.existsSync(filePath)) {
    const existingContent = fs.readFileSync(filePath, "utf8");

    // Verificar se o conteúdo já existe no arquivo
    if (!existingContent.includes(content.trim())) {
      fs.appendFileSync(filePath, content, "utf8");
    }
  } else {
    console.error(`path not found: ${filePath}`);
  }
};

appendToFile(supportFilePath, contentToAdd);
//

// Caminho para a raiz do projeto
const projectRootPath = path.resolve(__dirname, "../../");
// Caminho para a pasta .vscode
const vscodeFolderPath = path.join(projectRootPath, ".vscode");

// Caminho para o arquivo action.action-snippets dentro da pasta .vscode
const snippetsFilePath = path.join(vscodeFolderPath, "action.code-snippets");
const snippetsFilePathSave = path.join(vscodeFolderPath, "settings.json");
const contentSave = `{"editor.formatOnSave":true, "cSpell.words": ["Cenario", "datafaker", "Entao"]}`;

// Texto que será adicionado ao arquivo action.action-snippets
const snippetContent = `{ 
    "create cy.crud": {
    "scope": "javascript,typescript",
    "prefix": "crud",
    "body": ["cy.crud({payload:'$1'})", "$2"],
    "description": "create cy.crud"
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
    "body": ["import {describes, its,faker} from '../support/e2e'; ",
    "describes('', function () {",
     "its('', function () {}, {});});"],
    "description": "generate full test describes its"
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

}`;

try {
  // Define o caminho da raiz do projeto
  const projectRootPathJsconfig = path.resolve(__dirname, "../../");

  // Define o caminho para o arquivo jsconfig.json na raiz do projeto
  const jsconfigFilePath = path.join(projectRootPathJsconfig, "jsconfig.json");

  // Conteúdo para o arquivo jsconfig.json
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

  // Escreve o conteúdo no arquivo jsconfig.json
  fs.writeFileSync(jsconfigFilePath, contentTsConfig);
} catch (error) {
  console.error("Erro ao criar o arquivo jsconfig.json:", error);
}

if (!fs.existsSync(vscodeFolderPath)) {
  fs.mkdirSync(vscodeFolderPath);
}

fs.writeFileSync(snippetsFilePathSave, contentSave);
// Cria ou sobrescreve o arquivo action.action-snippets
fs.writeFileSync(snippetsFilePath, snippetContent);

// add json
const projectRootPathJSON = path.resolve(__dirname, "../../cypress/fixtures/");
// Caminho para a pasta .vscode
const vscodeFolderPathJSON = path.join(projectRootPathJSON, "examples");

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
  "validations": [{ "path": "status", "value": 201 }, { "path": "id" }]
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
  "validations": [{ "path": "status", "value": 201 }, { "path": "id" }]
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
  "validations": [{ "path": "status", "value": 200 }, { "path": "first_name" }]
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
const snipExample = path.join(generateFileExample, "cy-crud.cy.js");

const contentExample = `
const { crudStorage } = require("../support/e2e");

describe("template spec", () => {
    afterEach(() => {
    cy.crudScreenshot();
  });
  it("Example simple requisition", () => {
    cy.crud({ payload: "examples/jsonNotAlias" }).save({ path: "id" })
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
    cy.crud({ payload: "examples/jsonNotAlias" }).save({ path: "id" })
   // .crudScreenshot(); // or save({path:'id', log: false}) // save id 7
  });

  it("Example whit .save and .write, create JSON response in", () => {
    cy.crud({ payload: "examples/jsonNotAlias" })
      .save({ path: "id" }) // or save({path:'id', log: false})
      .write({ path: "user/user" })
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
    cy.crud({ payload: "examples/jsonAlias" })
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

    it("Example simple requisition whit MOCK", () => {
    cy.crud({ payload: "examples/jsonGETMock" });
  });
});

`;

fs.writeFileSync(snipExample, contentExample);

if (!fs.existsSync(vscodeFolderPathJSON)) {
  fs.mkdirSync(vscodeFolderPathJSON);
}

// request mock
fs.writeFileSync(mockRequestJson, contentRequestMock);

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

fs.writeFileSync(snippetsFileEndpointArray, contentEndpointArray);

fs.writeFileSync(jsonWithoutValidation, contentWithoutValid);

fs.writeFileSync(snippetsFilePathNotAlias, contentJSonAliasNot);

const configPath = path.resolve(__dirname, "../../");
const jsconfigFilePath = path.join(configPath, "cypress.config.js");
// Novo conteúdo para ser adicionado
const newContent = `

  // testIsolation: false,
  // experimentalRunAllSpecs: true,
  // env: {
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
  // },
`;
const contentLog = `
// reporter: "cypress-mochawesome-reporter",

 require("cypress-mochawesome-reporter/plugin")(on);
  on('task', {
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
`;

fs.readFile(jsconfigFilePath, "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  // Verifica se a setupNodeEvents já existe
  if (data.includes("crudLog")) {
    return;
  }

  // Localiza onde inserir o novo conteúdo
  const updatedData = data.replace(/(e2e: {)/, `$1${newContent}`);
  const updateNode = data.replace(
    /(setupNodeEvents\(on, config\) {\s*)/,
    `$1${contentLog}`
  );
  fs.writeFile(jsconfigFilePath, updateNode, "utf8", (err) => {
    if (err) {
      console.error(err);
      return;
    }
  });
});
