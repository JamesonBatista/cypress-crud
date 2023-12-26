const applyStyles = require("./style.js");
import { validate } from "jsonschema";
Cypress.Commands.add("crud", ({ payload = null, alias = "response" }) => {
  applyStyles();
  if (!window.save) {
    window.save = {};
  }

  if (!window.alias) {
    window.alias = {};
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
      // if (!separate) payload.request.url = env;
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

    if (!Cypress.config("isInteractive") && Cypress.env("outputRequisition"))
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
      if (
        !Cypress.config("isInteractive") &&
        Cypress.env("outputRequisition")
      ) {
        // Aqui, encadeamos o cy.task para garantir que ele seja executado de forma assíncrona.
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
            // Retorna a response após a execução de todos os comandos anteriores.
            return response;
          });
      } else {
        if (payload.validations) {
          runValidation(payload.validations);
        }
        // Retorna a response diretamente se estiver em modo interativo.
        return response;
      }
    });
  }
  return cy.fixture(payload).then((crud) => {
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
    // if (data.path && !separate) {
    //   data.url = `${data.url}/${window.save[data.path]}`;
    // }
    if (!Cypress.config("isInteractive") && Cypress.env("outputRequisition"))
      cy.task(
        "crudLog",
        `\x1b[36m** request **\n\x1b[0m${JSON.stringify(crud, null, 2)}`
      );
    return cy.api(data).then((response) => {
      if (!window.alias) {
        window.alias = {};
      }
      window.alias[alias] = response;
      window.alias["bodyResponse"] = response;
      if (
        !Cypress.config("isInteractive") &&
        Cypress.env("outputRequisition")
      ) {
        // Aqui, encadeamos o cy.task para garantir que ele seja executado de forma assíncrona.
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
            // Retorna a response após a execução de todos os comandos anteriores.
            return response;
          });
      } else {
        if (crud.validations) {
          runValidation(crud.validations);
        }
        // Retorna a response diretamente se estiver em modo interativo.
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
