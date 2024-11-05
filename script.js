const fs = require("fs");
const path = require("path");

const projectRootPath = path.resolve(__dirname, "../../");

// CONFIG
const config = path.join(projectRootPath, "cypress.config.js");
if (!fs.existsSync(config)) {
  const supportConfigEnv_content = `
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
  fs.writeFileSync(config, supportConfigEnv_content);
}
// CYPRESS
const folderCypress = path.join(projectRootPath, "cypress");
if (!fs.existsSync(folderCypress)) {
  fs.mkdirSync(folderCypress);
}
const folderE2E = path.join(folderCypress, "e2e");
if (!fs.existsSync(folderE2E)) {
  fs.mkdirSync(folderE2E);
  const co = path.join(folderE2E, "test.cy.js");
  const cot = ``;
  fs.writeFileSync(co, cot);
}
const folderFixtures = path.join(folderCypress, "fixtures");
if (!fs.existsSync(folderFixtures)) {
  fs.mkdirSync(folderFixtures);
}
const folderSupport = path.join(folderCypress, "support");
if (!fs.existsSync(folderSupport)) {
  fs.mkdirSync(folderSupport);

  const su = path.join(folderSupport, "e2e.js");
  const sut = `
import './commands'
export { crudStorage } from "cypress-crud/src/functions/storage.js";
export const faker = require("generate-datafaker");
import "cypress-plugin-steps";
import "cypress-crud";
import "cypress-plugin-api";
import "cypress-mochawesome-reporter/register";
import spok from "cy-spok";
// export default spok;

// close json file in variable
import _ from "lodash";
export function clone(json) {
  return _.cloneDeep(json);
}`;
  fs.writeFileSync(su, sut);

  const co = path.join(folderSupport, "commands.js");
  const cot = ``;
  fs.writeFileSync(co, cot);
}

// ENV
const env = path.join(projectRootPath, "cypress.env.json");
if (!fs.existsSync(env)) {
  const env_content = `
	{
	  "environment": "QA",
	  "QA": {
		"endpoint": "https://restcountries.com/v3.1/translation/germany",
		"reqres": "https://reqres.in/api/users/2",
		"base_reqres": {
		  "reqres_all": "https://reqres.in/api/users",
		  "reqres_id": "https://reqres.in/api/users/{id}"
		}
	  },
	  "PROD": {
		"endpoint": "https://restcountries.com/v3.1/translation/germany",
		"reqres": "https://reqres.in/api/users/2",
		"base_reqres": {
		  "reqres_all": "https://reqres.in/api/users",
		  "reqres_id": "https://reqres.in/api/users/{id}"
		}
	  },
	  "DEV": {
		"endpoint": "https://restcountries.com/v3.1/translation/germany",
		"reqres": "https://reqres.in/api/users/2",
		"base_reqres": {
		  "reqres_all": "https://reqres.in/api/users",
		  "reqres_id": "https://reqres.in/api/users/{id}"
		}
	  }
	}
	
	`;

  fs.writeFileSync(env, env_content);
}

// .VSCODE SNIPETS
const vscodeFolderPath = path.join(projectRootPath, ".vscode");
if (!fs.existsSync(vscodeFolderPath)) {
  fs.mkdirSync(vscodeFolderPath);
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
  const snippetsFilePath = path.join(vscodeFolderPath, "global.code-snippets");
  fs.writeFileSync(snippetsFilePath, snippetContent);
}
// JSCONFIG
const jsconfigFilePath = path.join(projectRootPath, "jsconfig.json");
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

// ENV-QA
const env_qa = path.join(projectRootPath, "env_qa.js");
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
