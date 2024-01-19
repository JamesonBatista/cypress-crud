const applyStyles = require("./style.js");
import { validate } from "jsonschema";
import { crudStorage } from "./gherkin/bdd.js";

let counter = 0;
let counterResponse = 0;
let colorNum;
let numberRequest = 0;

function generateInt() {
  const standardColors = [
    "\x1b[30m",
    "\x1b[31m",
    "\x1b[32m",
    "\x1b[33m",
    "\x1b[34m",
    "\x1b[35m",
    "\x1b[36m",
    "\x1b[37m",
    "\x1b[1;30m",
    "\x1b[1;31m",
    "\x1b[1;32m",
    "\x1b[1;33m",
    "\x1b[1;34m",
    "\x1b[1;35m",
    "\x1b[1;36m",
    "\x1b[1;37m",
  ];

  const extendedColors = new Array(256)
    .fill(0)
    .map((_, i) => `\x1b[38;5;${i}m`);

  const allColors = standardColors.concat(extendedColors);

  const randomIndex = Math.floor(Math.random() * allColors.length);
  colorNum = allColors[randomIndex];
  return allColors[randomIndex];
}

function textNpxRunCypress({
  type = null,
  payload = null,
  mocks = null,
  response = null,
}) {
  if (type === "request")
    return `${generateInt()} \n\n** ----- 🅲 🆁 🆄 🅳    🆁 🅴 🆀 🆄 🅴 🆂 🆃 ----- ** [ ${(numberRequest += 1)} ]\n${JSON.stringify(
      payload,
      null,
      2
    )}\n${colorNum}     ----  🡇  -----\n`;

  if (type === "mock")
    return `${colorNum} \n** ----- 🅲 🆁 🆄 🅳     🅼 🅾  🅲 🅺     🆁 🅴 🆂 🅿  🅾 🅽 🆂 🅴  ----- ** [ ${numberRequest} ] \n${JSON.stringify(
      mocks,
      null,
      2
    )}\n${colorNum}     ----- 🅵 🅸 🅽 🅰  🅻  -----\n`;

  if (type === "response")
    return `${colorNum}\n** ----- 🅲 🆁 🆄 🅳     🆁 🅴 🆂 🅿  🅾  🅽 🆂 🅴 ----- ** [ ${numberRequest} ]\n${JSON.stringify(
      response,
      null,
      2
    )}\n${colorNum}     ----- 🅵 🅸 🅽 🅰  🅻  -----\n`;
}
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

  if (!crudStorage.request || !crudStorage.response) {
    crudStorage.request = {};
    crudStorage.response = {};
  }

  if (typeof payload === `object`) {
    let separate = null;
    let env = null;
    if (payload.request.replace) {
      payload = replaceAllStrings(payload);
    }
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
        message: `${Cypress.env("environment") || "environment not found"}`,
        consoleProps: () => {
          return {
            env: Cypress.env("environment") || "environment not found",
            path: payload.endpoint,
            endpoint: cyEnv,
            framework: "cypress-crud",
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
        textNpxRunCypress({ type: "request", payload: payload })
      );
    data["failOnStatusCode"] = Cypress.env("failOnStatusCode") || false;

    counter += 1;
    window.request[`payload${counter}`] = data;

    if (data && data.mock) {
      window.mock = {};

      return cy.fixture(data.mock).then((mocks) => {
        const log = {
          name: "mock",
          message: ` Intercept ** ${data.mock} ** `,
          consoleProps: () => {
            return {
              mock: payload.request.mock,
              body: mocks,
              framework: "cypress-crud",
            };
          },
        };
        Cypress.log(log);

        return cy
          .intercept(mocks.intercept, (req) => {
            req.reply(mocks.response);
          })
          .then((requestMock) => {
            if (!window.alias) {
              window.alias = {};
            }
            window.alias[alias] = mocks;
            window.alias["bodyResponse"] = mocks;
            window.mock.active = true;
            counterResponse += 1;
            crudStorage.response[`response${counterResponse}`] = mocks;

            if (!Cypress.config("isInteractive")) {
              return cy
                .task(
                  "crudLog",
                  textNpxRunCypress({ type: "mock", mocks: mocks })
                )
                .then(() => {
                  if (crud.validations) {
                    runValidation(crud.validations);
                  }
                  return mocks;
                });
            } else {
              if (crud.validations) {
                runValidation(crud.validations);
              }
              return mocks;
            }
          });
      });
    }

    return cy.api(data).then((response) => {
      if (!window.alias) {
        window.alias = {};
      }
      window.alias[alias] = response;
      window.alias["bodyResponse"] = response;
      counterResponse += 1;
      crudStorage.response[`response${counterResponse}`] = response;

      if (!Cypress.config("isInteractive")) {
        return cy
          .task(
            "crudLog",
            textNpxRunCypress({ type: "response", response: response.body })
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
    //replace
    if (crud.request.replace) {
      crud = replaceAllStrings(crud);
    }
    //replace

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
            framework: "cypress-crud",
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
      console.log("TASKKK", generateInt());
      cy.task("crudLog", textNpxRunCypress({ type: "request", payload: crud }));
    }

    counter += 1;
    crudStorage.request[`payload${counter}`] = data;
    //mock
    if (data && data.mock) {
      window.mock = {};
      return cy.fixture(data.mock).then((mocks) => {
        const log = {
          name: "mock",
          message: ` Intercept ** ${data.mock} ** `,
          consoleProps: () => {
            return {
              mock: data.mock,
              body: mocks,
              framework: "cypress-crud",
            };
          },
        };
        Cypress.log(log);

        return cy
          .intercept(mocks.intercept, (req) => {
            req.reply(mocks.response);
          })
          .then((requestMock) => {
            if (!window.alias) {
              window.alias = {};
            }
            window.alias[alias] = mocks;
            window.alias["bodyResponse"] = mocks;
            counterResponse += 1;
            crudStorage.response[`response${counterResponse}`] = mocks;
            window.mock.active = true;
            if (!Cypress.config("isInteractive")) {
              return cy
                .task(
                  "crudLog",
                  textNpxRunCypress({ type: "mock", mocks: mocks })
                )
                .then(() => {
                  if (crud.validations) {
                    runValidation(crud.validations);
                  }
                  return mocks;
                });
            } else {
              if (crud.validations) {
                runValidation(crud.validations);
              }
              return mocks;
            }
          });
      });
    }
    //mock
    return cy.api(data).then((response) => {
      if (!window.alias) {
        window.alias = {};
      }
      window.alias[alias] = response;
      window.alias["bodyResponse"] = response;
      counterResponse += 1;
      crudStorage.response[`response${counterResponse}`] = response;

      if (!Cypress.config("isInteractive")) {
        return cy
          .task(
            "crudLog",
            textNpxRunCypress({ type: "response", response: response.body })
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
Cypress.Commands.add("expects", ({ path = null, eq = null }) => {
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
function findInJson(obj = window.alias.bodyResponse, keyToFind, position = 1) {
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

Cypress.Commands.add("findInJson", (obj, keyToFind, position = 1) => {
  return findInJson(obj, keyToFind, position);
});

Cypress.Commands.add("crudScreenshot", (type = "runner") => {
  if (Cypress.env("screenshot") && !Cypress.config("isInteractive")) {
    // Verificar se o estilo já existe, senão adicionar
    createHTML();
    // Tirar a captura de tela
    return cy.screenshot({ capture: type });
  } else {
    if (window.mock && window.mock.active) {
      createHTML();
    }
  }
});
function createHTML() {
  const app = window.top;

  const requestJson = JSON.stringify(window.alias.payloadReport, null, 2);
  const responseJson = JSON.stringify(
    window.alias.bodyResponse.body || window.alias.bodyResponse,
    null,
    2
  );
  let responseText = window.alias.bodyResponse.body
    ? "Response"
    : "Mock Response";
  const htmlContent = `
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
      font-size: 14px !important;
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
    
      <div class="header">${responseText}</div>
      <pre>${responseJson}</pre>
    </div>
  </div>
</body>
</html>

  `;

  cy.get("head", { log: false }).then(($head) => {
    if (!$head.find("[data-hover-style-jsons]").length) {
      $head.append(`
          <style data-hover-style-jsons>
            code, kbd, samp, pre {
              color: white;
              font-size: 14px !important;
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
  cy.get("body", { log: false }).then(($body) => {
    $body.empty().append(htmlContent);
    $body.append(`
          <style data-hover-style-jsons>
            code, kbd, samp, pre {
              color: white;
              font-size: 14px !important;
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
  font-size: 14px !important;
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
}
function replaceAllStrings(obj) {
  if (!obj.request.replace || typeof obj.request.replace !== "string") {
    return obj;
  }

  const replaceParams = obj.request.replace.split(", ");

  const subs = replaceParams.map((param) => {
    return {
      search: param,
      subsFor: window.save[param],
    };
  });

  let data = JSON.stringify(obj);

  subs.forEach((subst) => {
    data = data.replace(new RegExp(subst.search, "g"), subst.subsFor);
  });

  const newObj = JSON.parse(data);
  delete newObj.request.replace;
  return newObj;
}
