import { validate } from "jsonschema";
import { crudStorage } from "./functions/storage.js";
import { faker, simpleFaker } from "@faker-js/faker";
import FakerUse from "./faker.js";
const app = window.top;
import applyStyles from "../src/style.js";

let counter = 0;
let counterResponse = 0;
let colorNum;
let numberRequest = 0;
crudStorage.num = {};
crudStorage.num.counter = 1;
crudStorage.counter = {};
crudStorage.counter.int = 1;

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
    return `${generateInt()} \n\n** ----- 🅲 🆁 🆄 🅳    🆁 🅴 🆀 🆄 🅴 🆂 🆃 ----- ** [ ${(numberRequest += 1)} ]\n\n** ✓ Test: ${Cypress.currentTest.titlePath[1].toUpperCase()}\n\n${JSON.stringify(
      payload,
      null,
      2
    )}\n${colorNum}     ----  🡇  -----\n`;

  if (type === "mock")
    return `${colorNum} \n** ----- 🅲 🆁 🆄 🅳     🅼 🅾  🅲 🅺     🆁 🅴 🆂 🅿  🅾 🅽 🆂 🅴  ----- ** [ ${numberRequest} ] \n${JSON.stringify(
      mocks,
      null,
      2
    )}\n${colorNum}     -------------------- 🅵 🅸 🅽 🅰  🅻  --------------------\n\n`;

  if (type === "response")
    return `${colorNum}\n** ----- 🅲 🆁 🆄 🅳     🆁 🅴 🆂 🅿  🅾  🅽 🆂 🅴 ----- ** [ ${numberRequest} ]\n${JSON.stringify(
      response,
      null,
      2
    )}\n${colorNum}     -------------------- 🅵 🅸 🅽 🅰  🅻  --------------------\n\n`;
}

Cypress.Commands.add("crud", (input) => {
  applyStyles();

  if (typeof input === "string") {
    cy.fixture(`${input}`).then((jsons) => {
      if (Array.isArray(jsons)) {
        jsons.forEach((item) => {
          cy.supportCrud(item);
        });
      } else {
        cy.supportCrud(jsons);
      }
    });
  } else {
    if (Array.isArray(input)) {
      input.forEach((item) => {
        cy.supportCrud(item);
      });
    } else {
      if (input.payload) {
        if (typeof input.payload === "string") {
          cy.fixture(`${input.payload}`).then((jsons) => {
            if (Array.isArray(jsons)) {
              jsons.forEach((item) => {
                cy.supportCrud(item);
              });
            } else {
              cy.supportCrud(jsons);
            }
          });
        } else {
          cy.supportCrud(input.payload);
        }
      } else {
        cy.supportCrud(input);
      }
    }
  }
});
Cypress.Commands.add("supportCrud", (input) => {
  cy.clearAllCookies({ log: false });
  cy.clearAllLocalStorage({ log: false });

  const organizeJSON = (payload, payloadCreate) => {
    payloadCreate.req = {};
    let cp = (payloadCreate.req = {});

    if (payload.method) cp.method = payload.method;

    if (payload.post && typeof payload.post === "boolean") {
      cp.method = "POST";
      delete payload.post;
    } else if (payload.post && typeof payload.post === "string") {
      cp.method = "POST";
      cp.url = payload.post;
      delete payload.post;
    }

    if (payload.put && typeof payload.put === "boolean") {
      cp.method = "PUT";
      delete payload.put;
    } else if (payload.put && typeof payload.put === "string") {
      cp.method = "PUT";
      cp.url = payload.put;
      delete payload.put;
    }

    if (payload.delete && typeof payload.delete === "boolean") {
      cp.method = "DELETE";
      delete payload.delete;
    } else if (payload.delete && typeof payload.delete === "string") {
      cp.method = "DELETE";
      cp.url = payload.delete;
      delete payload.delete;
    }

    if (payload.get && typeof payload.get === "boolean") {
      cp.method = "GET";
      delete payload.get;
    } else if (payload.get && typeof payload.get === "string") {
      cp.method = "GET";
      cp.url = payload.get;
      delete payload.get;
    }
    if (payload.path && typeof payload.path === "boolean") {
      cp.method = "PATH";
      delete payload.path;
    } else if (payload.path && typeof payload.path === "string") {
      cp.method = "PATH";
      cp.url = payload.path;
      delete payload.path;
    }

    if (cp.method === "GET") payload.status = 200;
    if (cp.method === "POST") payload.status = 201;

    if (payload.url) cp.url = payload.url;
    if (payload.form) cp.form = payload.form;

    if (payload.status || payload.statusCode)
      cp.status = payload.status || payload.statusCode;
    if (payload.headers || payload.header)
      cp.headers = payload.headers || payload.header;

    if (payload.schema || payload.schemas)
      cp.schema = payload.schema || payload.schemas;

    if (payload.body || payload.payload)
      cp.body = payload.body || payload.payload;

    if (payload.qs || payload.param || payload.params)
      cp.qs = payload.qs || payload.param || payload.params;

    if (payload.mock) cp.mock = payload.mock;

    if (payload.failOnStatusCode) {
      cp.failOnStatusCode = payload.failOnStatusCode;
    } else cp.failOnStatusCode = false;

    if (payload.search) {
      payloadCreate.search = payload.search;
    }
    if (payload.auth) payloadCreate.auth = payload.auth;

    if (payload.followRedirect)
      payloadCreate.followRedirect = payload.followRedirect;

    if (payload.encoding) payloadCreate.encoding = payload.encoding;

    if (payload.gzip) payloadCreate.gzip = payload.gzip;

    if (payload.retryOnStatusCodeFailure)
      payloadCreate.retryOnStatusCodeFailure = payload.retryOnStatusCodeFailure;

    if (payload.retryOnNetworkFailure)
      payloadCreate.retryOnNetworkFailure = payload.retryOnNetworkFailure;

    if (payload.text) {

      payloadCreate.text = formatText(payload.text);
    
    }

    if (payload.env) cp.env = payload.env;

    if (payload.timeout) {
      payloadCreate.timou = payload.timeout;
    } else {
      payloadCreate.timeout = 60000;
    }

    if (payload.condition) payloadCreate.condition = payload.condition

    const validate =
      payload.expect ||
      payload.expects ||
      payload.chech ||
      payload.checks ||
      payload.assert ||
      payload.validations ||
      payload.res ||
      payload.response ||
      payload.validate ||
      payload.should ||
      payload.exist;

    if (validate) {
      payloadCreate.expect = validate;
    }

    if (payload.save) payloadCreate.save = payload.save;
    return payloadCreate;
  };
  function formatText(text) {
    const regex = /\{([^}]+)\}/g;
    const formattedText = text.replace(regex, '*{$1}*');
    return formattedText;
}

  let payload,
    alias = "response",
    log = false;
  if (typeof input === "string") {
    payload = input;
  } else if (typeof input === "object") {
    ({ payload = input, alias = "response", log = false } = input);
  }

  let payloadCreate = {};

  if (!window.save) {
    window.save = {};
  }
  if (!crudStorage.save) {
    crudStorage.save = {};
  }
  if (!crudStorage.request || !crudStorage.response) {
    crudStorage.request = {};
    crudStorage.response = {};
  }

  let environment;
  function findValueByKey(obj, key) {
    let result;

    function search(obj) {
      if (!obj || typeof obj !== "object") {
        return;
      }
      if (obj.hasOwnProperty(key)) {
        result = obj[key];
        return;
      }
      for (let k in obj) {
        if (obj.hasOwnProperty(k)) {
          search(obj[k]);
        }
      }
    }

    search(obj);
    return result;
  }
  const handleEndWithEndpoint = (reqPath) => {
    let envCheck = reqPath.env
      ? Cypress.env(reqPath.env)
      : Cypress.env(Cypress.env("environment"));
    return new Cypress.Promise((resolve, reject) => {
      try {
        const handleEnv = (url) => {
          let split = url.split("/");
          split.forEach((item) => {
            let url_ = (envCheck && envCheck[item]) || Cypress.env(item);
            if (url_) {
              if (url_ === "string" && url_.endsWith("/")) {
                environment = url_.slice(0, -1);
              } else {
                environment = url_;
              }
            } else {
              if (environment.endsWith("/")) {
                environment = environment.slice(0, -1);
              }
              environment = `${environment}/${item}`;
            }
            // payload.req.url = environment;
          });
          return environment;
        };
        let url;

        if (reqPath.url.includes("/")) {
          let split_url = reqPath.url.split("/");

          split_url.forEach((endpoint, index, arr) => {
            if (envCheck) {
              url = findValueByKey(envCheck, endpoint);
            } else {
              url = findValueByKey(Cypress.env(), endpoint);
            }

            if (url) {
              if (url && url.endsWith("/")) {
                environment = url.slice(0, -1);
              } else {
                environment = url;
              }
            } else {
              if (url && url.endsWith("/")) {
                environment = url.slice(0, -1);
              } else {
                environment = `${environment}/${endpoint}`;
              }
              reqPath.url = environment;
              // payload.req.url = environment;
            }
          });
        } else {
          if (envCheck) {
            environment = findValueByKey(envCheck, reqPath.url);
          } else {
            environment = findValueByKey(Cypress.env(), reqPath.url);
          }

          if (environment && environment.startsWith("http")) {
            reqPath.url = environment;
            // payload.req.url = environment;
          }
        }
        if (environment && !environment.startsWith("http")) {
          reqPath.url = handleEnv(environment);
        }

        if (reqPath.env) {
          Cypress.log({
            name: "env",
            message: `${reqPath.env || "environment not found"}`,
            consoleProps: () => {
              return {
                env: `${reqPath.env || "environment not found"}`,
                path: reqPath.url,
                endpoint: environment,
                framework: "cypress-crud",
              };
            },
          });
        } else if (Cypress.env("environment")) {
          Cypress.log({
            name: "env",
            message: `${Cypress.env("environment") || "environment not found"}`,
            consoleProps: () => {
              return {
                env: `${Cypress.env("environment") || "environment not found"}`,
                path: reqPath.url,
                endpoint: environment,
                framework: "cypress-crud",
              };
            },
          });
        }

        resolve(environment); // Resolve a promessa com o valor de environment
      } catch (error) {
        reject(error); // Rejeita a promessa em caso de erro
      }
    });
  };

  const handleMocks = (data, payload) => {
    const mockUrlandMethod = (mock, payload) => {
      mock.intercept = {};
      delete mock.body;
      if (payload.req && payload.req.status) {
        mock.response.status = payload.req.status || 200;
      } else if (!mock.response.status) mock.response.status = 200;
      if (payload.req.headers && !mock.response.headers) {
        mock.response.headers;
        mock.response.headers = payload.req.headers || {};
      }
      if (payload.req.status) delete payload.req.status;
      if (payload.req.body) delete payload.req.body;
      delete payload.req.mock;
      delete payload.req.failOnStatusCode;
      delete payload.req.qs;
      delete payload.req.form;
      delete payload.req.auth;
      delete payload.auth;
      if (payload.req.schema) payload.schema = payload.req.schema;
      delete payload.req.schema;
      mock.intercept = payload.req;
      delete mock.intercept.body;
      return mock;
    };
    return cy.fixture(data.mock).then((mocks) => {
      mockUrlandMethod(mocks, payload);
      Cypress.log({
        name: "mock",
        message: `Intercept ** ${data.mock}.json ** `,
        consoleProps: () => {
          return {
            mock: data.mock,
            body: mocks,
            framework: "cypress-crud",
          };
        },
      });
      Cypress.log({
        name: payload.req.method,
        message: payload.req.url,
        consoleProps: () => {
          return {
            mock: data.mock,
            body: mocks,
            framework: "cypress-crud",
          };
        },
      });
      if (typeof mocks.response.body === "string") {
        cy.fixture(`${mocks.response.body}`).then((json) => {
          mocks.response.body = json;
          return cy
            .intercept(mocks.intercept, (req) => {
              req.reply(mocks.response);
            })
            .then(() => {
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
                    expectValidations(payload);
                    return mocks;
                  });
              } else {
                expectValidations(payload);
                return mocks;
              }
            })
            .then(() => {
              payload.req.schema = payload.schema;
              delete payload.schema;
              const hasStringSchema = (payload) => {
                const properties = ["schema", "schemas", "contract"];
                return properties.some(
                  (prop) =>
                    (payload.req && typeof payload.req[prop] === "string") ||
                    typeof payload[prop] === "string"
                );
              };
              const schemaVerify = hasStringSchema(payload);
              if (schemaVerify) {
                const verifySchema =
                  payload.req.schema ||
                  payload.req.schemas ||
                  payload.req.contract;
                schemaValidation(verifySchema);
              }

              if (payload.search) {
                searchEq(
                  window.alias.bodyResponse,
                  payload.search.search,
                  payload.search.as
                );
              }
              removeBeforePseudoElement();
            });
        });
      } else {
        return cy
          .intercept(mocks.intercept, (req) => {
            req.reply(mocks.response);
          })
          .then(() => {
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
                  expectValidations(payload);
                  return mocks;
                });
            } else {
              expectValidations(payload);
              return mocks;
            }
          })
          .then(() => {
            payload.req.schema = payload.schema;
            delete payload.schema;
            const hasStringSchema = (payload) => {
              const properties = ["schema", "schemas", "contract"];
              return properties.some(
                (prop) =>
                  (payload.req && typeof payload.req[prop] === "string") ||
                  typeof payload[prop] === "string"
              );
            };
            const schemaVerify = hasStringSchema(payload);
            if (schemaVerify) {
              const verifySchema =
                payload.req.schema ||
                payload.req.schemas ||
                payload.req.contract;
              schemaValidation(verifySchema);
            }

            if (payload.search) {
              searchEq(
                window.alias.bodyResponse,
                payload.search.search,
                payload.search.as
              );
            }
            removeBeforePseudoElement();
          });
      }
    });
  };
  function removeBeforePseudoElement() {
    const app = window.top;

    if (
      !app.document.head.querySelector("[data-hover-black-delete-beforepost]")
    ) {
      const style = app.document.createElement("style");
      let post = `#unified-reporter > div > div > div.wrap > ul > li > div > div.collapsible-content.runnables-region > ul > li > div > div.collapsible-content.runnable-instruments > div > ul > li > div > div.collapsible-content.attempt-content > div > div.runnable-commands-region > ul > li > div > div.collapsible-content > ul > li.command.command-name-POST`;
      let get = `#unified-reporter > div > div > div.wrap > ul > li > div > div.collapsible-content.runnables-region > ul > li > div > div.collapsible-content.runnable-instruments > div > ul > li > div > div.collapsible-content.attempt-content > div > div.runnable-commands-region > ul > li > div > div.collapsible-content > ul > li.command.command-name-GET`;
      let delete_ = `#unified-reporter > div > div > div.wrap > ul > li > div > div.collapsible-content.runnables-region > ul > li > div > div.collapsible-content.runnable-instruments > div > ul > li > div > div.collapsible-content.attempt-content > div > div.runnable-commands-region > ul > li > div > div.collapsible-content > ul > li.command.command-name-DELETE`;
      let put = `#unified-reporter > div > div > div.wrap > ul > li > div > div.collapsible-content.runnables-region > ul > li > div > div.collapsible-content.runnable-instruments > div > ul > li > div > div.collapsible-content.attempt-content > div > div.runnable-commands-region > ul > li > div > div.collapsible-content > ul > li.command.command-name-PUT`;
      let path = `#unified-reporter > div > div > div.wrap > ul > li > div > div.collapsible-content.runnables-region > ul > li > div > div.collapsible-content.runnable-instruments > div > ul > li > div > div.collapsible-content.attempt-content > div > div.runnable-commands-region > ul > li > div > div.collapsible-content > ul > li.command.command-name-PATH`;

      let div = `div > span > div > span.command-info > span.command-method::before {content: '';}`;
      style.innerHTML = `
      ${post} ${div}
      ${get} ${div}
      ${delete_} ${div}
      ${put} ${div}
      ${path} ${div}
      ${post} div > span > div > span.command-info > span.command-method{
        padding: 2px 5px 0px;
        border-radius: 3px;
      }
      ${get} div > span > div > span.command-info > span.command-method{
        padding: 2px 5px 0px;
        border-radius: 3px;
      }  
       ${delete_} div > span > div > span.command-info > span.command-method{
        padding: 2px 5px 0px;
        border-radius: 3px;
      }  
       ${put} div > span > div > span.command-info > span.command-method{
        padding: 2px 5px 0px;
        border-radius: 3px;
      } 
        ${path} div > span > div > span.command-info > span.command-method{
        padding: 2px 5px 0px;
        border-radius: 3px;
      }

      `;

      style.setAttribute("data-hover-black-delete-beforepost", "");
      app.document.head.appendChild(style);
    }
  }
  const schemaValidation = (schemas) => {
    const json_response =
      window.alias.bodyResponse.body || window.alias.bodyResponse.response.body;
    cy.fixture(`${schemas}.json`)
      .as("dataLoader")
      .then((schema) => {
        const validation = validate(json_response, schema, {
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
        const log = {
          name: "schemas",
          message: `${schemas}.json Successful JSON Schema validation ${validation.valid}`,
          consoleProps: () => {
            return {
              path: `${schemas}.json`,
              body: window.alias.bodyResponse,
              framework: "cypress-crud",
            };
          },
        };
        Cypress.log(log);
      });
  };

  const handleRequest = (data, payload) => {
    if (payload.text) {
      cy.step(payload.text);
    }
    return cy
      .api(data)
      .then((response) => {

        if (!window.alias) {
          window.alias = {};
        }
        if (data.status) {
          expect(response.status, `${randonItens()}status::`).to.eq(
            data.status
          );
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
              expectValidations(payload);

              return response;
            });
        } else {
          expectValidations(payload);
          return response;
        }
      })
      .then(() => {
        const hasStringSchema = (payload) => {
          const properties = ["schema", "schemas", "contract"];
          return properties.some(
            (prop) =>
              (payload.req && typeof payload.req[prop] === "string") ||
              typeof payload[prop] === "string"
          );
        };
        const schemaVerify = hasStringSchema(payload);
        if (schemaVerify) {
          const verifySchema =
            payload.req.schema || payload.req.schemas || payload.req.contract;
          schemaValidation(verifySchema);
        }

        if (payload.search) {
          ``;
          searchEq(
            window.alias.bodyResponse,
            payload.search.search,
            payload.search.as
          );
        }
        if (!Cypress.config("isInteractive")) {
          // createHTML();
          cy.screenshot();
        }
      });
  };
  if (typeof payload === `object`) {
    const reqExist = payload.req || payload.request;
    if (!reqExist) payload = organizeJSON(payload, payloadCreate);

    const reqPath = payload.request || payload.req;

    if (reqPath.url.endsWith("/")) {
      const req = payload.request || payload.req;
      req.url = req.url.slice(0, -1);
    }

    if (reqPath.url && !reqPath.url.startsWith("http")) {
      handleEndWithEndpoint(reqPath);
    }
    payload = replaceAllStrings(payload);

    let req = payload.request || payload.req;

    let data = { ...req };
    if (!window.save) window.save = {};

    if (!Cypress.config("isInteractive"))
      cy.task("crudLog", textNpxRunCypress({ type: "request", payload: data }));

    data.failOnStatusCode = Cypress.env("failOnStatusCode") || false;

    counter += 1;
    crudStorage.request[`payload${counter}`] = data;
    if (!window.alias) {
      window.alias = {};
      delete req.path;
      window.alias.payloadReport = payload;
    } else {
      delete req.path;
      window.alias.payloadReport = payload;
    }
    if (data && data.mock) {
      window.mock = {};
      handleMocks(data, payload);
    } else {
      if (payload.condition) {
        let verify = conditionContinueTest(payload)
        if (verify) handleRequest(data, payload)
      } else {
        handleRequest(data, payload);
      }
    }
  }
});

function conditionContinueTest(json) {
  const formattedJson = JSON.stringify(json, null, 2);

  let condicionAccept = null;
  let eqCondition = null;
  let logCondition = false;
  let result = null;
  const handleCondition = (json) => {
    const { path, eq } = json.condition;
    condicionAccept = path;
    eqCondition = eq;
    if (path && eq) {
      result = findInJson(window.alias.bodyResponse, path);
      for (let iteration of result) {
        if (eq.trim().includes("||")) {
          let splitEq = eq.split("||");
          for (let splitUse of splitEq) {
            if (iteration === splitUse.trim()) logCondition = true;

            condicionAccept = path;
            eqCondition = splitUse;
          }
        } else if (iteration === eq) {
          logCondition = true;
          eqCondition = eq;
          condicionAccept = path;
        }
      }
    } else {
      result = findInJson(window.alias.bodyResponse, path);

      if (result) {
        logCondition = true;
      }
    }
  }

  if (typeof json.condition === "string") {
     result = findInJson(window.alias.bodyResponse, json.condition);

    if (result) {
      logCondition = true;
    } else {
      logCondition = false;
    }
    condicionAccept = json.condition;
  } else if (typeof json.condition === "number") {
    result = findInJson(window.alias.bodyResponse, "status");

    if (result === json.condition) {
      logCondition = true;
    } else {
      logCondition = false;
    }
    condicionAccept = json.condition;
  } else if (typeof json.condition === "object") {
    if (!Array.isArray(json.condition)) {
      handleCondition(json)
    }
  }


  if (logCondition) {

    Cypress.log({
      name: `condition-accpet`,
      message: `${condicionAccept ? condicionAccept : json.condition} ${eqCondition ? `: ${eqCondition}` : `[*${result}*]`
        }`,
      consoleProps: () => ({
        json: formattedJson,
        condition: json.condition,
        value: result,
        framework: "cypress-crud",
      }),
    });
  } else {
    Cypress.log({
      name: `condition-error`,
      message: `${condicionAccept ? condicionAccept : ""} ${eqCondition ? `= ${eqCondition}` : ""
        } [*${formattedJson}*]`,
      consoleProps: () => ({
        json: formattedJson,
        condition: json.condition,
        value: result,
        framework: "cypress-crud",
      }),
    });
  }
  return logCondition;
}
function dataVales(searchValue, path) {
  crudStorage.save[path] = searchValue;
  Cypress.log({
    name: `save`,
    message: `[${path}] = ${typeof searchValue === "object"
      ? JSON.stringify(searchValue)
      : searchValue
      }`,
    consoleProps: () => ({
      alias: path,
      value: searchValue,
      framework: "cypress-crud",
    }),
  });
}
function haveProperty(objeto, propriedade, reserve) {
  let found = false;

  function searchProperty(obj) {
    if (Array.isArray(obj)) {
      obj.forEach((item) => searchProperty(item));
    } else if (typeof obj === "object" && obj !== null) {
      if (obj.hasOwnProperty(propriedade)) {
        expect(obj).to.have.property(propriedade);
        found = true;
      }
      Object.values(obj).forEach((valor) => searchProperty(valor));
    }
  }

  searchProperty(objeto);

  if (!found) {
    throw new Error(`Property '${propriedade}' not found.`);
  }
  if (reserve) {
    if (reserve) {
      let searchValue = findInJson(window.alias.bodyResponse, propriedade);
      crudStorage.save[
        typeof reserve == "string" ? reserve : propriedade || propriedade
      ] = searchValue;
      Cypress.log({
        name: "save",
        message: `[${typeof reserve == "string" ? reserve : propriedade || "save"
          }] = ${typeof searchValue === "object"
            ? JSON.stringify(searchValue)
            : searchValue
          }`,
        consoleProps: () => ({
          alias: typeof reserve == "string" ? reserve : propriedade || "save",
          value: searchValue,
          framework: "cypress-crud",
        }),
      });
    }
  }
}

function runValidation(initValid) {
  if (typeof initValid === "string") {
    if (initValid.trim().includes(":::")) {
      const split_ = initValid.trim().split(":::");
      initValid = {};
      initValid.path = split_[0].trim();
      initValid.as = split_[1].trim();
    } else if (initValid.trim().includes("===")) {
      const split_ = initValid.trim().split("===");
      initValid = {};
      initValid.path = split_[0].trim();
      initValid.eq = split_[1].trim();
    } else {
      const value = initValid;
      initValid = {};
      initValid.path = value;
    }
  }

  if (
    window.alias &&
    window.alias.bodyResponse &&
    window.alias.bodyResponse.allRequestResponses
  ) {
    delete window.alias.bodyResponse.allRequestResponses;
  }
  const {
    path,
    eq,
    position,
    type,
    search,
    alias = null,
    as = null,
    property = null,
    key = null,
  } = initValid;

  let aliasPath = alias || as;
  const key_property = property || key;
  let path_and_key = path || key;
  path_and_key = path_and_key.trim();
  if (aliasPath) aliasPath = aliasPath.trim();

  if (!path_and_key && !eq && !position && !type && search) {
    searchEq(window.alias.bodyResponse, search, aliasPath);
    return;
  }

  if (key_property) {
    haveProperty(window.alias.bodyResponse, key_property, aliasPath);
    return;
  }

  if (initValid && path_and_key && !initValid.search) {
    validatePathAndKey(initValid, path_and_key, aliasPath);
  }
}

function validatePathAndKey(initValid, path_and_key, aliasPath) {
  const paths = findInJson(window.alias.bodyResponse, path_and_key);
  const shouldCheckEquality = initValid.hasOwnProperty("eq");
  const validateType = initValid.hasOwnProperty("type");

  if (Array.isArray(paths) && paths.every(Array.isArray)) {
    handleNestedArrays(
      paths,
      initValid,
      shouldCheckEquality,
      validateType,
      aliasPath
    );
  } else if (Array.isArray(paths)) {
    handleArrayPaths(
      paths,
      initValid,
      shouldCheckEquality,
      validateType,
      aliasPath
    );
  } else {
    handleSinglePath(
      paths,
      initValid,
      shouldCheckEquality,
      validateType,
      aliasPath,
      path_and_key
    );
  }
}

function handleNestedArrays(
  paths,
  initValid,
  shouldCheckEquality,
  validateType,
  aliasPath
) {
  const valueFoundInAnyArray = paths.some((path) => {
    if (!Array.isArray(path)) return false;
    return checkPathEquality(path, initValid, shouldCheckEquality);
  });

  if (shouldCheckEquality && !valueFoundInAnyArray) {
    reportError(paths, initValid);
  } else if (shouldCheckEquality && valueFoundInAnyArray) {
    expectPathToBeFound(valueFoundInAnyArray, initValid, aliasPath);
    if (validateType)
      typeAssert(valueFoundInAnyArray, initValid.path, initValid.type);
  } else if (valueFoundInAnyArray && !shouldCheckEquality) {
    expectPathToExist(paths, initValid, aliasPath);
    if (validateType) typeAssert(paths, initValid.path, initValid.type);
  }
}

function handleArrayPaths(
  paths,
  initValid,
  shouldCheckEquality,
  validateType,
  aliasPath
) {
  if (
    initValid.position &&
    typeof initValid.position === "number" &&
    initValid.position <= paths.length
  ) {
    validatePosition(
      paths,
      initValid,
      shouldCheckEquality,
      validateType,
      aliasPath
    );
  } else {
    const valueFound = checkArrayEquality(
      paths,
      initValid,
      shouldCheckEquality
    );
    if (!valueFound) {
      expectPathToExist(paths, initValid, aliasPath);
      if (validateType) typeAssert(paths, initValid.path, initValid.type);
    }
    if (shouldCheckEquality && !valueFound) {
      reportError(paths, initValid);
    } else if (shouldCheckEquality && valueFound) {
      expectPathToBeFound(valueFound, initValid, aliasPath);
      if (validateType) typeAssert(valueFound, initValid.path, initValid.type);
    }
  }
}

function handleSinglePath(
  paths,
  initValid,
  shouldCheckEquality,
  validateType,
  aliasPath,
  path_and_key
) {
  if (shouldCheckEquality && validateType) {
    validateTypeAndEquality(paths, initValid, aliasPath, path_and_key);
  } else {
    expectPathToExist(paths, initValid, aliasPath);
    if (shouldCheckEquality) {
      validateEquality(paths, initValid, aliasPath, path_and_key);
    }
    if (validateType) {
      typeAssert(paths, path_and_key, initValid.type);
    }
  }
}

function checkPathEquality(path, initValid, shouldCheckEquality) {
  if (!initValid.eq) {
    if (initValid.position && typeof initValid.position === "number") {
      return (
        initValid.position <= path.length &&
        path[initValid.position - 1] !== undefined
      );
    } else {
      return path;
    }
  } else if (typeof initValid.eq === "string") {
    return initValid.eq
      .split("||")
      .map((eqValue) => eqValue.trim())
      .some((eqValue) => path.includes(eqValue));
  }
  return false;
}

function validatePosition(
  paths,
  initValid,
  shouldCheckEquality,
  validateType,
  aliasPath
) {
  if (initValid.type && !shouldCheckEquality) {
    expect(
      paths[initValid.position - 1],
      `Type check for path '${initValid.path}':`
    ).to.be.an(initValid.type);
    if (aliasPath)
      dataVales(
        paths[initValid.position - 1],
        typeof aliasPath != "boolean" ? aliasPath : path || path
      );
  } else if (shouldCheckEquality && initValid.type) {
    expect(
      paths[initValid.position - 1],
      `Type check for path '${initValid.path}':`
    ).to.be.an(initValid.type);
    expect(
      paths[initValid.position - 1],
      `${randonItens()}${initValid.path}::`
    ).to.eq(initValid.eq);
    if (aliasPath)
      dataVales(
        paths[initValid.position - 1],
        typeof aliasPath != "boolean" ? aliasPath : path || path
      );
  } else if (!initValid.type && initValid.position) {
    expect(paths[initValid.position - 1], `${randonItens()}${initValid.path}::`)
      .to.exist;
    if (aliasPath)
      dataVales(
        paths[initValid.position - 1],
        typeof aliasPath != "boolean" ? aliasPath : path || path
      );
  }
}

function checkArrayEquality(paths, initValid, shouldCheckEquality) {
  return paths.some((path) => shouldCheckEquality && path === initValid.eq);
}

function validateTypeAndEquality(paths, initValid, aliasPath, path_and_key) {
  typeAssert(paths, initValid.path, initValid.type);
  if (typeof initValid.eq === "string") {
    const value = initValid.eq
      .split("||")
      .map((eqValue) => eqValue.trim())
      .some((eqValue) => paths === eqValue);
    if (value) {
      expect(
        value,
        `${randonItens()}${initValid.path}:: expected '${initValid.eq
        }' to be found`
      ).to.be.true;
      if (aliasPath)
        dataVales(
          value,
          typeof aliasPath != "boolean"
            ? aliasPath
            : path_and_key || path_and_key
        );
    } else {
      expect(
        false,
        `${randonItens()}${initValid.path}:: expected '${initValid.eq
        }' to be found`
      ).to.be.true;
    }
  } else {
    expect(paths, `${randonItens()}${initValid.path}::`).to.eq(initValid.eq);
    if (aliasPath)
      dataVales(
        paths,
        typeof aliasPath != "boolean" ? aliasPath : path_and_key || path_and_key
      );
  }
}

function validateEquality(paths, initValid, aliasPath, path_and_key) {
  if (typeof initValid.eq === "string") {
    const value = initValid.eq
      .split("||")
      .map((eqValue) => eqValue.trim())
      .some((eqValue) => paths === eqValue);
    if (value) {
      expect(
        value,
        `${randonItens()}${initValid.path}:: expected '${initValid.eq
        }' to be found`
      ).to.be.true;
      if (aliasPath)
        dataVales(
          paths,
          typeof aliasPath != "boolean"
            ? aliasPath
            : path_and_key || path_and_key
        );
    } else {
      expect(
        false,
        `${randonItens()}${initValid.path}:: expected '${initValid.eq
        }' to be found`
      ).to.be.true;
    }
  } else {
    expect(paths, `${randonItens()}${initValid.path}::`).to.eq(initValid.eq);
    if (aliasPath)
      dataVales(
        paths,
        typeof aliasPath != "boolean" ? aliasPath : path_and_key || path_and_key
      );
  }
}

function expectPathToBeFound(valueFound, initValid, aliasPath) {
  expect(
    valueFound,
    `${randonItens()}${initValid.path}:: expected '${initValid.eq}' to be found`
  ).to.be.true;
  if (aliasPath) {
    dataVales(
      valueFound,
      typeof aliasPath != "boolean" ? aliasPath : path || path
    );
  }
}

function expectPathToExist(paths, initValid, aliasPath) {
  if (typeof paths === "object") {
    paths.forEach((item) => {
      expect(JSON.stringify(item), `${randonItens()}${initValid.path}::`).to
        .exist;
    });
  } else {
    expect(JSON.stringify(paths), `${randonItens()}${initValid.path}::`).to
      .exist;
  }
  if (aliasPath) {
    dataVales(paths, typeof aliasPath != "boolean" ? aliasPath : path || path);
  }
}

function reportError(paths, initValid) {
  const log = {
    name: "expect",
    message: `Expected value '${initValid.eq}' not found in any array for path '${initValid.path}'`,
    consoleProps: () => {
      return {
        found: paths,
        expected: initValid.eq,
        framework: "cypress-crud",
      };
    },
  };
  Cypress.log(log);
  expect(
    false,
    `Expected value '${initValid.eq}' not found in any array for path '${initValid.path}'`
  ).to.be.true;
}
function searchEq(obj, searchValue, reserve) {
  let found = false;

  function searchInObject(obj, value) {
    if (found) return;

    if (obj === value) {
      found = true;
      return;
    }

    if (Array.isArray(obj)) {
      obj.forEach((item) => searchInObject(item, value));
    } else if (typeof obj === "object" && obj !== null) {
      Object.values(obj).forEach((val) => searchInObject(val, value));
    }
  }

  searchInObject(obj, searchValue, reserve);
  if (found) {
    expect(searchValue, `${randonItens()}searching::`).to.exist;
    if (reserve) {
      crudStorage.save[reserve] = searchValue;
      Cypress.log({
        name: "save",
        message: `[${reserve || "save"}] = ${typeof searchValue === "object"
          ? JSON.stringify(searchValue)
          : searchValue
          }`,
        consoleProps: () => ({
          alias: reserve || "save",
          value: searchValue,
          framework: "cypress-crud",
        }),
      });
    }
  } else {
    expect(false, `Expected value '${searchValue}' not found'`).to.be.true;
  }
}

function typeAssert(paths, path, type) {
  if (paths && type) {
    if (Array.isArray(paths) && type === "array") {
      expect(paths, `Type check for path '${path}':`).to.be.an(type);
    } else if (typeof paths === type) {
      expect(paths, `Type check for path '${path}':`).to.be.an(type);
    } else {
      throw new Error(
        `Expected type '${type}' but found '${typeof paths}' for path '${path}'`
      );
    }
  }
}

Cypress.Commands.add("runValidation", (validations) => {
  return runValidation(validations);
});

Cypress.Commands.add("bodyResponse", (...args) => {
  ExpectHandle(args);
});

Cypress.Commands.add("response", (...args) => {
  ExpectHandle(args);
});

Cypress.Commands.add("res", (...args) => {
  ExpectHandle(args);
});

Cypress.Commands.add("expects", (...args) => {
  ExpectHandle(args);
});
Cypress.Commands.add("save", (...input) => {
  if (!Array.isArray(input)) input = [input];

  if (Array.isArray(input)) {
    input.forEach((item) => {
      if (item) save(item);
    });
  } else {
    if (input.path) {
      save(input);
    }
  }
});
function save(input) {
  let options;

  if (typeof input === "string") {
    if (input.includes(":::")) {
      const split_ = input.split(":::");
      options = { path: split_[0], as: split_[1] };
    } else {
      options = { path: input };
    }
  } else if (typeof input === "object" && input !== null) {
    options = input;
  } else {
    throw new Error("Input must be either a string or an object.");
  }

  const {
    path = null,
    alias = null,
    log = true,
    eq = null,
    position = null,
    as = null,
    search = null,
  } = options;
  if (!window.save) {
    window.save = {};
  }
  let as_exist = as || alias;

  if (search) {
    searchEq(window.alias.bodyResponse, search, as_exist);
  } else {
    let results;
    if (typeof input === "string") {
      results = findInJson(window.alias.bodyResponse, path);
      if (results.length > 1) results = results[0];
    } else {
      results = findInJson(window.alias.bodyResponse, path);
    }

    let valueToSave;
    if (eq === null || eq === undefined) {
      if (typeof position === "number" && Array.isArray(results)) {
        if (position <= results.length) {
          valueToSave = results[position - 1];
        } else {
          console.warn(`Position ${position} out of bounds for results.`);
        }
      } else {
        valueToSave = results;
      }
    } else {
      if (Array.isArray(results)) {
        results.some((subArray) => {
          if (Array.isArray(subArray)) {
            if (subArray.includes(eq)) {
              valueToSave = eq;

              return true;
            }
          } else {
            if (results.includes(eq)) {
              valueToSave = eq;
              return true;
            }
          }
          return false;
        });
      } else if (results === eq) {
        valueToSave = eq;
      }
    }

    if (valueToSave !== undefined) {
      window.save[as || alias || path] = valueToSave;

      if (log) {
        Cypress.log({
          name: "save",
          message: `[${as || alias || path}] = ${JSON.stringify(valueToSave)}`,
          consoleProps: () => ({
            alias: alias,
            value: valueToSave,
            framework: "cypress-crud",
          }),
        });
      } else {
        Cypress.log({
          name: "save",
          message: `value hidden saved in [${as || alias || path}]`,
          consoleProps: () => ({
            alias: alias,
            value: "No value to save",
            framework: "cypress-crud",
          }),
        });
      }
    } else if (log) {
      Cypress.log({
        name: "save",
        message: `[${path || "error"}] request error, not save value in [${as || alias || path
          }]`,
        consoleProps: () => ({
          alias: alias,
          value: "No value to save",
          framework: "cypress-crud",
        }),
      });
    }
  }
}
let counterResp = 0;
Cypress.Commands.add("write", ({ path = null, log = true } = {}) => {
  counterResp += 1;
  return cy.writeFile(
    `cypress/fixtures/${path ? `${path}` : `response/response_${counterResp}`
    }.json`,
    window.alias.bodyResponse,
    {
      log: log,
    }
  );
});

Cypress.Commands.add("read", ({ path = null, log = true } = {}) => {
  return cy
    .readFile(`cypress/fixtures/${path}.json`, {
      log: log,
    })
    .then((read) => {
      return read;
    });
});

Cypress.Commands.add("validateSchema", ({ schemas = null }) => {
  const json_response =
    window.alias.bodyResponse.body || window.alias.bodyResponse.response.body;
  cy.fixture(`${schemas}.json`)
    .as("dataLoader")
    .then((schema) => {
      const validation = validate(json_response, schema, {
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
      const log = {
        name: "schemas",
        message: `${schemas}.json Successful JSON Schema validation ${validation.valid}`,
        consoleProps: () => {
          return {
            path: `schemas/${schema}`,
            body: window.alias.bodyResponse,
            framework: "cypress-crud",
          };
        },
      };
      Cypress.log(log);
    });
});
Cypress.Commands.add("schema", ({ schemas = null }) => {
  const json_response =
    window.alias.bodyResponse.body || window.alias.bodyResponse.response.body;
  cy.fixture(`${schemas}.json`)
    .as("dataLoader")
    .then((schema) => {
      const validation = validate(json_response, schema, {
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
      const log = {
        name: "schemas",
        message: `${schemas}.json Successful JSON Schema validation ${validation.valid}`,
        consoleProps: () => {
          return {
            path: `schemas/${schema}`,
            body: window.alias.bodyResponse,
            framework: "cypress-crud",
          };
        },
      };
      Cypress.log(log);
    });
});
function findInJson(obj, keyToFind) {
  let results = [];

  function traverse(currentObj) {
    if (Array.isArray(currentObj)) {
      for (let item of currentObj) {
        traverse(item);
      }
    } else if (currentObj !== null && typeof currentObj === "object") {
      for (let key in currentObj) {
        if (currentObj.hasOwnProperty(key)) {
          if (key === keyToFind) {
            results.push(currentObj[key]);
          } else if (typeof currentObj[key] === "object") {
            traverse(currentObj[key]);
          }
        }
      }
    }
  }

  traverse(obj);
  results = [...new Set(results)];
  if (results.length === 0) {
    console.error(`Key '${keyToFind}' not found in the provided object`);
    return undefined;
  } else if (results.length === 1) {
    return results[0];
  } else {
    return results;
  }
}

Cypress.Commands.add("findInJson", (obj, keyToFind) => {
  return findInJson(obj, keyToFind);
});

Cypress.Commands.add("crudScreenshot", (type = "runner") => {
  if (Cypress.env("screenshot") && !Cypress.config("isInteractive")) {
    // createHTML();
    return cy.screenshot({ capture: type });
  }
});
Cypress.Commands.add("crudshot", (type = "runner") => {
  if (!Cypress.config("isInteractive")) {
    // createHTML();
    return cy.screenshot({ capture: type });
  }
});

function replaceAllStrings(obj) {
  function applySubstitutions(currentObj) {
    if (Array.isArray(currentObj)) {
      return currentObj.map((item) => applySubstitutions(item));
    } else if (typeof currentObj === "object" && currentObj !== null) {
      const newObj = {};
      Object.entries(currentObj).forEach(([key, value]) => {
        if (typeof value === "string") {
          const fakers = new FakerUse();

          if (value.startsWith("faker.")) {
            const [prefix, suffix] = value.split("faker.");
            if (suffix === "name" || suffix === "nome") {
              newObj[key] = fakers.name();
            }
            if (suffix === "email") newObj[key] = fakers.emails();

            if (
              suffix === "enterpriseName" ||
              suffix === "empresaNome" ||
              suffix === "enterprise"
            )
              newObj[key] = fakers.enterprise();

            if (suffix === "state" || suffix === "estado")
              newObj[key] = fakers.state();

            if (suffix === "city" || suffix === "cidade")
              newObj[key] = fakers.city();

            if (suffix === "country" || suffix === "pais")
              newObj[key] = fakers.country();

            if (suffix === "street" || suffix === "address" || suffix === "rua")
              newObj[key] = fakers.street();

            if (
              suffix === "phoneNumber" ||
              suffix === "numeroTelefone" ||
              suffix === "phone"
            )
              newObj[key] = fakers.phoneNumber();

            if (suffix === "cep") newObj[key] = fakers.cep();

            if (suffix === "cpf") newObj[key] = fakers.cpf();

            if (suffix === "cnpj") newObj[key] = fakers.cnpj();

            if (suffix === "password" || suffix === "senha")
              newObj[key] = fakers.password();

            if (suffix === "uuid") newObj[key] = simpleFaker.string.uuid();

            if (suffix === "birthdate" || suffix === "aniversario")
              newObj[key] = faker.date.birthdate();

            if (suffix === "avatar") newObj[key] = faker.image.avatar();

            if (suffix === "professional" || suffix === "profissao")
              newObj[key] = fakers.professional();

            if (suffix === "product" || suffix === "produto")
              newObj[key] = fakers.products();

            if (suffix === "image" || suffix === "imagem")
              newObj[key] = faker.image.url();

            if (suffix === "text" || suffix === "texto")
              newObj[key] = faker.lorem.text();

            if (suffix === "title" || suffix === "titulo")
              newObj[key] = faker.person.jobTitle();

            if (suffix === "actualDate" || suffix === "dataAtual")
              newObj[key] = fakers.actualDate();

            if (suffix === "futureDate" || suffix === "dataFutura")
              newObj[key] = fakers.futureDate();
          } else {
            newObj[key] = value.replace(/\{(\w+)\}/g, (match, p1) => {
              return window.save.hasOwnProperty(p1) ? window.save[p1] : p1;
            });
          }
        } else {
          newObj[key] = applySubstitutions(value);
        }
      });
      return newObj;
    } else {
      return currentObj;
    }
  }

  return applySubstitutions(obj);
}

function expectValidations(obj) {
  if (obj.status) {
    let paths = findInJson(window.alias.bodyResponse, "status");
    const status_validation = paths.length ? paths[0] : paths;
    expect(status_validation, `${randonItens()}status::`).to.eq(obj.status);
  }
  const validProperty =
    obj.validations ||
    obj.expects ||
    obj.expect ||
    obj.check ||
    obj.checks ||
    obj.res ||
    obj.response ||
    obj.validate ||
    obj.should ||
    obj.exist;

  if (validProperty) {
    if (Array.isArray(validProperty)) {
      validProperty.forEach((item, index) => {
        runValidation(item);
      });
    } else {
      runValidation(validProperty);
    }
  }
  if (obj.save) {
    if (Array.isArray(obj.save)) {
      obj.save.forEach((item, index) => {
        const { path, alias, eq, position, log, as } = item;
        if (path) save({ path, alias, position, eq, log, as });
      });
    } else {
      if (typeof obj.save === "string") {
        if (obj.save.trim().includes(":::")) {
          const split_ = obj.save.trim().split(":::");
          obj.save = { path: split_[0].trim(), as: split_[1].trim() };
        } else {
          const valueString = obj.save;
          obj.save = {};
          obj.save.path = valueString;
        }
      }
      const { path, alias, eq, position, log, as } = obj.save;

      if (path) save({ path, alias, position, eq, log, as });
    }
  }
}

function randonItens() {
  const computerItemEmojis = [":::"];

  const randomIndex = Math.floor(Math.random() * computerItemEmojis.length);

  return computerItemEmojis[randomIndex];
}
function ExpectHandle(args) {
  args = replaceAllStrings(args);
  let valueDuplicate;
  if (!args[0].path) {
    args.forEach((item) => {
      args = null;
      args = [
        {
          path: item,
        },
      ];
    });
  }

  args.forEach(({ path, eq, type, search, alias, as, property, key }) => {
    const key_property = property || key;
    if (!path && !eq && !type && search) {
      let aliasPath = as || alias;
      searchEq(window.alias.bodyResponse, search, aliasPath);
    } else if (key_property) {
      let aliasPath = as || alias;
      haveProperty(window.alias.bodyResponse, key_property, aliasPath);
    } else {
      let paths = findInJson(window.alias.bodyResponse, path);
      if (!Array.isArray(paths)) {
        paths = [paths];
      }
      let valueFound = false;
      paths.forEach((item) => {
        const checkValue = (value) => {
          if (path && !eq) {
            expect(value, `${randonItens()}${path}::`).to.exist;
          }
          if (String(eq).trim().includes("||")) {
            eq.split("||").map((item) => {
              if (value.trim() === item.trim() && valueDuplicate !== eq) {
                expect(value, `${randonItens()}${path}::`).to.eq(item.trim());
                valueDuplicate = eq;
                valueFound = true;
              }
            });
          } else {
            if (eq && value === eq && valueDuplicate !== eq) {
              expect(value, `${randonItens()}${path}::`).to.eq(eq);
              valueDuplicate = eq;
              valueFound = true;
            }
          }
          if (type && typeof value !== type) {
            throw new Error(
              `Expected type '${type}' but found '${typeof value}' for path '${path}'`
            );
          }
          if (type) {
            expect(value, `Type check for path '${path}':`).to.be.a(type);
          }
        };

        if (Array.isArray(item)) {
          item.forEach(checkValue);
        } else {
          checkValue(item);
        }
      });

      if (eq && !valueFound) {
        const log = {
          name: "expect",
          message: `Expected value '${eq}' not found for path '${path}'`,
          consoleProps: () => {
            return {
              found: paths,
              expected: eq,
              type: type,
              framework: "cypress-crud",
            };
          },
        };
        Cypress.log(log);
        expect(
          valueFound,
          `Expected value '${eq}' not found for path '${path}'`
        ).to.be.true;
      }
    }
  });
}
Cypress.Commands.add("crudSafeData", (token) => {
  applyStyles();
  const base64UrlDecode = (input) => {
    let str = input.replace(/-/g, "+").replace(/_/g, "/");
    while (str.length % 4) {
      str += "=";
    }
    const decoded = atob(str);
    return decodeURIComponent(
      Array.from(new Uint8Array(decoded.split("").map((c) => c.charCodeAt(0))))
        .map((code) => "%" + ("00" + code.toString(16)).slice(-2))
        .join("")
    );
  };

  const parts = token.split(".");
  const header = base64UrlDecode(parts[0]);
  const payload = base64UrlDecode(parts[1]);
  crudStorage.save.crypto = JSON.parse(payload);
  return JSON.parse(payload);
});
Cypress.Commands.add("runFixtures", (path = null) => {
  return cy.task("runFixtures", { folderPath: path || "" }).then((fixtures) => {
    fixtures.forEach((item) => {
      if (path) {
        const replaceItem = `${path}/${item.fileName}`;
        cy.crud(replaceItem);
      } else {
        cy.crud(item.fileName);
      }
    });
  });
});




