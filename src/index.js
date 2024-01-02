const applyStyles = require("./style.js");
import { validate } from "jsonschema";
const fs = require("fs");
const path = require("path");

const configPath = path.resolve(__dirname, "../../");
const jsconfigFilePath = path.join(
  configPath,
  "node_modules/cypress-crud/src/index.html"
);

Cypress.Commands.add("crud", ({ payload = null, alias = "response" }) => {
  applyStyles();
  if (!window.save) {
    window.save = {};
  }

  if (!window.alias) {
    window.alias = {};
    window.alias.payloadReport = payload;
  } else {
    window.alias.payloadReport = payload;
  }
  if (typeof payload === `object`) {
    let separate = null;
    let env = null;
    if (payload && payload.endpoint) {
      if (Cypress.env("environment")) {
        env = Cypress.env(Cypress.env("environment"))[payload.endpoint];
      }

      if (payload && payload.request.path) {
        if (payload.request.path.startsWith("/")) {
          payload.request.url = `${env || payload.request.url}${
            payload.request.path
          }`;
        } else {
          if (payload.request.path.includes("/")) {
            separate = payload.request.path.split("/");
            let serEnv = env || payload.request.url;
            payload.request.url = `${serEnv}/${window.save[separate[0]]}/${
              separate[1]
            }`;
          }
        }
      } else {
        payload.request.url = `${env || payload.request.url}`;
      }
      const envCy = Cypress.env(Cypress.env("environment"));
      let cyEnv =
        envCy && envCy[payload.endpoint]
          ? envCy[payload.endpoint]
          : `${payload.request.url}${payload.request.path || ""}`;
      const log = {
        name: "env",
        message: `${Cypress.env("environment") || "environment not find"}`,
        consoleProps: () => {
          return {
            env: Cypress.env("environment") || "environment not find",
            path: payload.endpoint,
            endpoint: cyEnv,
            framework: "cy.crud",
          };
        },
      };
      Cypress.log(log);
    } else if (
      payload &&
      !payload.endpoint &&
      payload.request.path &&
      payload.request.path.includes("/")
    ) {
      if (payload && payload.request.path) {
        if (payload.request.path.startsWith("/")) {
          payload.request.url = `${payload.request.url}${payload.request.path}`;
        } else {
          if (payload.request.path.includes("/")) {
            separate = payload.request.path.split("/");
            payload.request.url = `${payload.request.url}/${
              window.save[separate[0]]
            }/${separate[1]}`;
          }
        }
      }
    }

    let data = { ...payload.request };
    if (!window.save) window.save = {};

    if (!Cypress.config("isInteractive"))
      cy.task(
        "crudLog",
        `\x1b[36m** request **\n\x1b[0m${JSON.stringify(payload, null, 2)}`
      );
    data["failOnStatusCode"] = Cypress.env("failOnStatusCode") || false;
    return cy.api(data).then((response) => {
      if (!window.alias) {
        window.alias = {};
      }
      window.alias[alias] = response;
      window.alias["bodyResponse"] = response;
      if (!Cypress.config("isInteractive")) {
        return cy
          .task(
            "crudLog",
            `\x1b[36m** response **\n\x1b[0m${JSON.stringify(
              response.body,
              null,
              2
            )}`
          )
          .then(() => {
            if (payload.validations) {
              runValidation(payload.validations);
            }

            return response;
          });
      } else {
        if (payload.validations) {
          runValidation(payload.validations);
        }
        return response;
      }
    });
  }
  return cy.fixture(payload).then((crud) => {
    if (!window.alias) {
      window.alias = {};
      window.alias.payloadReport = crud;
    } else {
      window.alias.payloadReport = crud;
    }
    let separate = null;
    let env = null;
    if (crud && crud.endpoint) {
      if (Cypress.env("environment")) {
        env = Cypress.env(Cypress.env("environment"))[crud.endpoint];
      }
      if (crud && crud.request.path) {
        if (crud.request.path.startsWith("/")) {
          crud.request.url = `${env || crud.request.url}${crud.request.path}`;
        } else {
          if (crud.request.path.includes("/")) {
            separate = crud.request.path.split("/");
            crud.request.url = `${env || crud.request.url}/${
              window.save[separate[0]]
            }/${separate[1]}`;
          }
        }
      } else {
        crud.request.url = `${env || crud.request.url}`;
      }
      const envCy = Cypress.env(Cypress.env("environment"));
      let cyEnv =
        envCy && envCy[crud.endpoint]
          ? envCy[crud.endpoint]
          : `${crud.request.url}${crud.request.path || ""}`;
      const log = {
        name: "env",
        message: `${Cypress.env("environment") || "environment not find"}`,
        consoleProps: () => {
          return {
            env: Cypress.env("environment") || "environment not find",
            path: crud.endpoint,
            endpoint: cyEnv,
            framework: "cy.crud",
          };
        },
      };
      Cypress.log(log);
    } else if (crud && !crud.endpoint) {
      if (crud && crud.request.path) {
        if (crud.request.path.startsWith("/")) {
          crud.request.url = `${crud.request.url}${crud.request.path}`;
        } else {
          if (crud.request.path.includes("/")) {
            separate = crud.request.path.split("/");
            crud.request.url = `${crud.request.url}/${
              window.save[separate[0]]
            }/${separate[1]}`;
          }
        }
      }
    }
    let data = { ...crud.request };
    data["failOnStatusCode"] = Cypress.env("failOnStatusCode") || false;
    if (!Cypress.config("isInteractive")) {
      cy.task(
        "crudLog",
        `\x1b[36m** request **\n\x1b[0m${JSON.stringify(crud, null, 2)}`
      );
    }

    return cy.api(data).then((response) => {
      if (!window.alias) {
        window.alias = {};
      }
      window.alias[alias] = response;
      window.alias["bodyResponse"] = response;
      if (!Cypress.config("isInteractive")) {
        return cy
          .task(
            "crudLog",
            `\x1b[36m** response **\n\x1b[0m${JSON.stringify(
              response.body,
              null,
              2
            )}`
          )
          .then(() => {
            if (crud.validations) {
              runValidation(crud.validations);
            }
            return response;
          });
      } else {
        if (crud.validations) {
          runValidation(crud.validations);
        }

        return response;
      }
    });
  });
});
function runValidation(validations) {
  if (validations) {
    let valid = validations;
    for (let initValid of valid) {
      let path = findInJson(window.alias.bodyResponse, initValid.path);

      expect(path).exist;
      if (initValid.value) {
        expect(path).to.eql(initValid.value);
      }
    }
  } else {
    const log = {
      name: "runValidation",
      message: `path validation not exist in JSON request`,
      consoleProps: () => {
        return {
          save: "",
          value: "",
          framework: "cy.crud",
        };
      },
    };
    Cypress.log(log);
  }
}

Cypress.Commands.add("runValidation", () => {
  if (window.valid) {
    let valid = window.valid.validations;
    for (let initValid of valid) {
      let path = findInJson(window.alias.bodyResponse, initValid.path);

      expect(path).exist;
      if (initValid.value) {
        expect(path).to.eql(initValid.value);
      }
    }
  } else {
    const log = {
      name: "runValidation",
      message: `path validation not exist in JSON request`,
      consoleProps: () => {
        return {
          save: "",
          value: "",
          framework: "cy.crud",
        };
      },
    };
    Cypress.log(log);
  }
});

Cypress.Commands.add("bodyResponse", ({ path = null, eq = null }) => {
  let search = findInJson(window.alias.bodyResponse, path);

  expect(search).to.exist;
  if (eq) {
    expect(search).to.eql(eq);
  }
  return expect(search);
});
Cypress.Commands.add(
  "save",
  ({ path = null, alias = "save", log = true } = {}) => {
    if (!window.save) {
      window.save = {};
    }

    if (path) {
      let value = findInJson(window.alias.bodyResponse, path);
      if (log) {
        const log = {
          name: "save",
          message: `${alias !== "save" ? alias : ""} ${value}`,
          consoleProps: () => {
            return {
              save: path,
              value: value,
              framework: "cy.crud",
            };
          },
        };
        Cypress.log(log);
      } else {
        if (!log) {
          const log = {
            name: "save",
            message: `${alias !== "save" ? alias : ""} ******`,
            consoleProps: () => {
              return {
                alias: alias,
                value: "******",
                framework: "cy.crud",
              };
            },
          };
          Cypress.log(log);
        }
      }
      return (window.save[alias] = value);
    }
    if (!log) {
      const log = {
        name: "save",
        message: `******`,
        consoleProps: () => {
          return {
            alias: alias,
            value: "******",
            framework: "cy.crud",
          };
        },
      };
      Cypress.log(log);
    } else {
      const log = {
        name: "save",
        message: `${alias !== "save" ? alias : ""} ${window.save[alias]}`,
        consoleProps: () => {
          return {
            alias: alias,
            value: window.save[alias],
            framework: "cy.crud",
          };
        },
      };
      Cypress.log(log);
    }
    return window.save[alias];
  }
);

Cypress.Commands.add("write", ({ path = null, log = true } = {}) => {
  return cy.writeFile(
    `cypress/fixtures/${path ? path : "response"}.json`,
    window.alias.bodyResponse,
    {
      log: log,
    }
  );
});

Cypress.Commands.add("read", ({ path = null, log = true } = {}) => {
  return cy
    .readFile(`cypress/fixtures/JSONs/${path}.json`, {
      log: log,
    })
    .then((read) => {
      return read;
    });
});

Cypress.Commands.add("validateSchema", ({ schema = null }) => {
  cy.fixture(`schemas/${schema}`)
    .as("dataLoader")
    .then((schema) => {
      const validation = validate(window.alias.bodyResponse.body, schema, {
        required: true,
        nestedErrors: true,
      });
      let errors = "";
      if (!validation.valid) {
        errors += validation.errors.map((err) => {
          return "\n" + err.toString();
        });
        throw new Error("SCHEMA VALIDATION ERROR: " + errors);
      }
      // cy.task("log", "Successful JSON Schema validation", validation.valid);
      const log = {
        name: "schemas",
        message: `Successful JSON Schema validation ${validation.valid}`,
        consoleProps: () => {
          return {
            path: `schemas/${schema}`,
            body: window.alias.bodyResponse,
            framework: "cy.crud",
          };
        },
      };
      Cypress.log(log);
    });
});
function findInJson(obj, keyToFind, position = 1) {
  let result = null;
  let fullValue = null;
  let count = 0;

  function traverse(obj) {
    let value;
    if (Array.isArray(obj)) {
      for (let i = 0; i < obj.length; i++) {
        value = traverse(obj[i]);
        if (value) return value;
      }
    } else if (typeof obj === "object" && obj !== null) {
      for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
          if (key === keyToFind && Array.isArray(obj[key])) {
            if (obj[key].length >= position) {
              result = obj[key][position - 1];
              fullValue = obj[key];
              throw new Error("Found value");
            }
          } else if (key === keyToFind) {
            count++;
            if (count === position) {
              result = obj[key];
              throw new Error("Found value");
            }
          }
          value = traverse(obj[key]);
          if (value) return value;
        }
      }
    }
  }

  try {
    traverse(obj);
  } catch (e) {
    if (e.message !== "Found value") {
      throw e;
    }
  }

  return fullValue
    ? { object: fullValue, value: result }
    : result
    ? result
    : console.error(`Path ** ${keyToFind} ** not found`);
}

Cypress.Commands.add("crudScreenshot", (type = "runner") => {
  const app = window.top;
  if (Cypress.env("screenshot") && !Cypress.config("isInteractive")) {
    // Verificar se o estilo já existe, senão adicionar
    cy.get("head", { log: false }).then(($head) => {
      if (!$head.find("[data-hover-style-jsons]").length) {
        $head.append(`
          <style data-hover-style-jsons>
            code, kbd, samp, pre {
              color: white;
              font-size: 11px !important;
            }
            .requestdiv, .responsediv {
              border-radius: 10px;
              box-shadow: 3px 3px 10px rgba(1, 1, 1, 3);
            }
            .text-\\[14px\\] {
              display: none;
            }
          </style>
        `);
      }
    });

    // Gerar e inserir o HTML necessário
    const htmlContent = createHTML(); // A função createHTML deve retornar o HTML necessário
    cy.get("body", { log: false }).then(($body) => {
      $body.empty().append(htmlContent);
      $body.append(`
          <style data-hover-style-jsons>
            code, kbd, samp, pre {
              color: white;
              font-size: 11px !important;
            }
            .requestdiv, .responsediv {
              border-radius: 10px;
              box-shadow: 3px 3px 10px rgba(1, 1, 1, 3);
            }
            .text-\\[14px\\] {
              display: none;
            }
          </style>
        `);
    });
    if (!app.document.head.querySelector("[data-hover-style-jsons]")) {
      const style = app.document.createElement("style");

      style.innerHTML = `
  code, kbd, samp, pre{
   color: white;
  font-size: 11px !important;
  }

  .requestdiv, .responsediv {
    border-radius: 10px;
     box-shadow: 3px 3px 10px rgba(1, 1, 1, 3);
  }
 .text-\\[14px\\] {
    display: none;
  }
    `;

      style.setAttribute("data-hover-styles-jsons", "");
      app.document.head.appendChild(style);
    }
    // Tirar a captura de tela
    return cy.screenshot({ capture: type });
  }
});
function createHTML() {
  const requestJson = JSON.stringify(window.alias.payloadReport, null, 2);
  const responseJson = JSON.stringify(window.alias.bodyResponse.body, null, 2);

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Request & Response</title>
  <style>
  #unified-runner{
    height: 100vh !important;
  }
    body { 
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
      margin: 0; 
      padding: 0; 
      background-color: rgb(27, 30, 46);
    }
    .container { 
      display: flex; 
      justify-content: space-around; 
      align-items: flex-start; 
      padding-top: 10px; /* Espaço no topo */
      height: calc(100vh - 10px); /* Altura total menos o espaço no topo */
       overflow: hidden;
    }
    .card { 
      background-color: #33333357;
      width: 48%; /* Ajuste para margem entre os cartões */
      box-sizing: border-box;
      border-radius: 8px;
      box-shadow: 0 6px 10px rgba(0,0,0,0.25);
      overflow: hidden; /* Garante que o conteúdo não ultrapasse os cantos arredondados */
    }
    .header {
    background-color: #59c773;
    color: white;
    padding: 10px 10px;
    text-align: center;
    letter-spacing: 10px;
    font-size: 16px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    border-bottom: 3px solid #a3d293;
    border-bottom-radius: 5px;
    border-radius: 10px;
    }
    pre { 
      white-space: pre-wrap; 
      word-wrap: break-word; 
      color: white;
      padding: 10px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="card">
      <div class="header">Request</div>
      <pre>${requestJson}</pre>
    </div>
    <div class="card">
      <div class="header">Response</div>
      <pre>${responseJson}</pre>
    </div>
  </div>
</body>
</html>

  `;

  return html;
}
