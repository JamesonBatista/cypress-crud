import { crudStorage } from "./functions/storage";
import { faker, simpleFaker } from "@faker-js/faker";
import FakerUse from "./faker";
import { validate } from "jsonschema";
import "../src/style";

const app = window.top;

let counter = 0;
let count = 0;

let counterResponse = 0;
let colorNum;
let numberRequest = 0;
crudStorage.num = {};
crudStorage.num.counter = 1;
crudStorage.counter = {};
crudStorage.counter.int = 1;
crudStorage.save.url = null;

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
Cypress.Commands.add('crud', (input) => {

  const processJson = (jsons) => {
    if (Array.isArray(jsons)) {
      jsons.forEach(cy.crudRuuner);
    } else {
      cy.crudRuuner(jsons);
    }
  };

  if (typeof input === "string") {
    cy.fixture(input).then(processJson);
  } else if (Array.isArray(input)) {
    input.forEach(cy.crudRuuner);
  } else if (input.payload) {
    if (typeof input.payload === "string") {
      cy.fixture(input.payload).then(processJson);
    } else {
      cy.crudRuuner(input.payload);
    }
  } else {
    cy.crudRuuner(input);
  }
})


Cypress.Commands.add("crudRuuner", (input) => {
  const metodosHttp = ["get", "post", "delete", "patch", "put", "g", "p", "d", "pa", "pu"];

  if (metodosHttp.some(metodo => input.hasOwnProperty(metodo))) {
    var _package = require('../../../package.json')
    if (_package.tag && _package.tag !== "") {
      if (_package.tag.includes(",")) {
        const separate = _package.tag.split(",")
        for (let sep of separate) {
          if (input.tag && input.tag === sep.trim()) cy.supportCrud(input)
        }
      } else if (input.tag && input.tag === _package.tag.trim()) cy.supportCrud(input)

    } else {
      cy.supportCrud(input)
    }
  }
});

Cypress.Commands.add("supportCrud", (input) => {
  cy.clearAllCookies({ log: false });
  cy.clearAllLocalStorage({ log: false });

  const organizeJSON = (payload, payloadCreate = {}) => {

    const cp = (payloadCreate.req = {});
    if (!crudStorage.organize) crudStorage.organize = {};
    if (payload.method) cp.method = payload.method;

    const methodMap = {
      post: "POST",
      put: "PUT",
      delete: "DELETE",
      get: "GET",
      patch: "PATCH",
      g: "GET",
      p: "POST",
      d: "DELETE",
      pa: "PATCH",
      pu: "PUT"
    };

    Object.keys(methodMap).forEach((key) => {
      if (payload[key] && typeof payload[key] === "string") {
        cp.method = methodMap[key];
        cp.url = payload[key];
      }
    });

    if (!payload.status) {
      if (cp.method === "GET") {
        payload.status = 200;
      } else if (cp.method === "POST") {
        payload.status = 201;
      }
    }

    const mapPayloadToCp = {
      form: "form", //f
      f: "form",
      auth: "auth", //au
      au: "auth",
      status: "status", //st
      statusCode: "status",//stc
      st: "status",
      stc: "status",
      stc: "status",
      headers: "headers", //hs
      header: "headers",//h
      hs: "headers",
      h: "header",
      schema: "schema",//sc
      schemas: "schema",//scs
      sc: "schema",
      contract: "schema",//ct
      body: "body",//b
      payload: "body",//pl
      b: "body",
      pl: "body",
      qs: "qs",
      param: "qs",
      params: "qs",
      mock: "mock",//m
      m: "mock",
      failOnStatusCode: "failOnStatusCode",
      fs: "failOnStatusCode",
      env: "env",
      timeout: "timeout",
      tt: "timeout",
      encoding: "encoding",
      en: "encoding",
      gzip: "gzip",
      retryOnStatusCodeFailure: "retryOnStatusCodeFailure",
      rsc: "retryOnStatusCodeFailure",
      retryOnNetworkFailure: "retryOnNetworkFailure",
      rnf: "retryOnNetworkFailure",
      followRedirect: "followRedirect",
      fd: "followRedirect",
    };

    Object.keys(mapPayloadToCp).forEach((key) => {

      if (payload['form']) {

        cp['form'] = true
        cp['body'] = payload['form']
      }
      else if (payload[key]) cp[mapPayloadToCp[key]] = payload[key];
    });

    cp.failOnStatusCode =
      payload.failOnStatusCode !== undefined ? payload.failOnStatusCode : false;
    cp.timeout = payload.timeout || 180000;

    const additionalKeys = {
      text: "text", //t
      t: "text",
      search: "search",
      sh: "search",
      condition: "condition",//c
      c: "condition",
      save: "save",//s
      s: "save",
      saveRequest: "saveRequest",//sr
      sr: "saveRequest",
      request: "request",//r
    };

    Object.keys(additionalKeys).forEach((key) => {

      if (payload[key]) payloadCreate[additionalKeys[key]] = payload[key];
    });

    if (payload.text || payload.t) {
      payloadCreate.text = formatText(payload.text || payload.t);
    }

    // Validação e expectativas
    const validateKeys = [
      "expect",
      "expects",
      "check",
      "checks",
      "assert",
      "validations",
      "res",
      "response",
      "validate",
      "should",
      "exist",
      "ex",
      "e"
    ];
    const validate = validateKeys.find((key) => payload[key]);
    if (validate) payloadCreate.expect = payload[validate];

    if (payloadCreate.req && payloadCreate.req.url && payloadCreate.req.url.startsWith("/")) {
      const urlbase = ["base", "baseUrl"]
      for (const u of urlbase) {
        const base = findInJson(Cypress.env(Cypress.env('environment')), u)
        if (base) payloadCreate.req.url = `${base[0]}${payloadCreate.req.url}`
      }
    }

    if (payloadCreate.req && payloadCreate.req.url) {
      let pc = payloadCreate.req
      let finalUrl;
      if (pc.url.includes("/")) {
        const s_url = pc.url.split("/");
        for (const url_ of s_url) {
          let get_ = findInJson(Cypress.env(Cypress.env('environment')), url_)
          finalUrl ? finalUrl += get_ ? `${get_[0]}/` : `${url_}/` : finalUrl = get_ ? `${get_[0]}/` : `${url_}/`

        }

        if (finalUrl && String(finalUrl).endsWith("/")) finalUrl = finalUrl.slice(0, -1)

      } else {
        finalUrl = findInJson(Cypress.env(Cypress.env('environment')), pc.url) ? findInJson(Cypress.env(Cypress.env('environment')), pc.url)[0] : pc.url
      }

      payloadCreate.req.url = finalUrl


    }

    return payloadCreate;
  };

  function formatText(text) {
    const regex = /\{([^}]+)\}/g;
    const formattedText = text.replace(regex, "*{$1}*");
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

  let payloadCreate;

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
  const logEnv = (env) => {
    Cypress.log({
      name: "env",
      message: env,
      consoleProps: () => {
        return {
          env: env,
          framework: "cypress-crud",
        };
      },
    });
  };
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

            if (typeof url_ != "string")
              throw `Endpoint ${url} not found in cypress.env.json`;

            if (url_) {
              environment = url_.endsWith("/") ? url_.slice(0, -1) : url_;
            } else {
              environment = environment ? `${environment}/${item}` : `/${item}`;
            }
          });
          return environment;
        };

        let url = null;
        let environment = "";

        if (reqPath.url.includes("/")) {
          let split_url = reqPath.url.split("/");
          split_url.forEach((endpoint) => {
            if (envCheck) {
              url = findValueByKey(envCheck, endpoint);
            } else {
              url = findValueByKey(Cypress.env(), endpoint);
            }

            if (url) {
              environment = url.endsWith("/") ? url.slice(0, -1) : url;
            } else {
              environment = environment
                ? `${environment}/${endpoint}`
                : `/${endpoint}`;
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
          }
        }

        if (environment && !environment.startsWith("http")) {
          reqPath.url = handleEnv(environment);
        }
        const envLog = reqPath.env ? reqPath.env : Cypress.env("environment");
        if (envLog) logEnv(envLog);

        resolve(environment);
      } catch (error) {
        reject(error);
      }
    });
  };

  const handleMocks = (data, payload) => {
    const mockUrlandMethod = (mock, payload) => {
      mock.intercept = {};
      delete mock.body;
      if (payload.req && payload.req.status && !mock.response.status) {
        mock.response.status = payload.req.status || 200;
      }

      if (payload.req.headers && !mock.response.headers) {
        mock.response.headers;
        mock.response.headers = payload.req.headers || {};
      }
      if (payload.req.status) {
        payload.status = payload.req.status;
        delete payload.req.status;
      }
      if (payload.req.body) delete payload.req.body;
      delete payload.req.mock;
      delete payload.req.failOnStatusCode;
      delete payload.req.qs;
      delete payload.req.form;
      delete payload.req.auth;
      delete payload.auth;
      delete payload.req.timeout;
      if (payload.req.schema) payload.schema = payload.req.schema;
      delete payload.req.schema;
      mock.intercept = payload.req;
      delete mock.intercept.body;
      return mock;
    };
    if (typeof data.mock === "object") {
      var mocks = data.mock
      mockUrlandMethod(mocks, payload);
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
            console.log(payload, mocks);

            expectValidations(payload);
            return mocks;
          }
        })
        .then(() => {
          // if (payload.req.schema) payload.req.schema = payload.schema;

          delete payload.schema;

          const verifySchema =
            payload.req.schema ||
            payload.req.schemas ||
            payload.req.contract;

          if (verifySchema)
            validateSchema(verifySchema);

          if (payload.search) {
            searchEq(
              window.alias.bodyResponse,
              payload.search.search,
              payload.search.as
            );
          }
          removeBeforePseudoElement();
        });
    } else
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
                // if (payload.req.schema) payload.req.schema = payload.schema;

                delete payload.schema;

                const verifySchema =
                  payload.req.schema ||
                  payload.req.schemas ||
                  payload.req.contract;

                if (verifySchema)
                  validateSchema(verifySchema);

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
                console.log(payload, mocks);

                expectValidations(payload);
                return mocks;
              }
            })
            .then(() => {
              // if (payload.req.schema) payload.req.schema = payload.schema;

              delete payload.schema;

              const verifySchema =
                payload.req.schema ||
                payload.req.schemas ||
                payload.req.contract;

              if (verifySchema)
                validateSchema(verifySchema);

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
      const selectorForm = (method) => {
        return `#unified-reporter > div > div > div.wrap > ul > li > div > div.collapsible-content.runnables-region > ul > li > div > div.collapsible-content.runnable-instruments > div > ul > li > div > div.collapsible-content.attempt-content > div > div.runnable-commands-region > ul > li > div > div.collapsible-content > ul > li.command.command-name-${method}`;
      };
      const style = app.document.createElement("style");
      let post = selectorForm("POST");
      let get = selectorForm("GET");
      let delete_ = selectorForm("DELETE");
      let put = selectorForm("PUT");
      let path = selectorForm("PATCH");

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
  const validateSchema = (schemas) => {
    let json_response =
      window.alias.bodyResponse.body || window.alias.bodyResponse.response.body;
    if (typeof json_response === "string") {
      try {
        json_response = JSON.parse(json_response);
      } catch (error) {
        console.error("Error converter to object:", error);
      }
    }


    if (typeof schemas === 'object') {
      const validation = validate(json_response, schemas, {
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
        message: `Successful JSON Schema validation ${validation.valid}`,
        consoleProps: () => {
          return {
            path: `${schemas}.json`,
            body: window.alias.bodyResponse,
            framework: "cypress-crud",
          };
        },
      };
      Cypress.log(log);
    }


    if (typeof schemas === 'string')
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
  function removeBeforeSecondHttps(str) {
    let firstHttpsIndex = str.indexOf("https");

    if (firstHttpsIndex === -1) {
      return str;
    }

    let secondHttpsIndex = str.indexOf("https", firstHttpsIndex + 1);

    if (secondHttpsIndex === -1) {
      return str;
    }

    return str.substring(secondHttpsIndex);
  }

  const handleRequest = (data, payload) => {
    if (
      payload.req.url.startsWith("undefined") ||
      payload.req.url.startsWith("nullundefined")
    ) {
      let result = removeBeforeSecondHttps(payload.req.url);
      payload.req.url = result;
    }
    if (payload.text) {
      cy.step(payload.text);
    }
    return cy
      .api(payload.req)
      .then((response) => {
        if (!window.alias) {
          window.alias = {};
        }
        if (payload.req.status) {
          expect(response.status, `${randonItens()}status::`).to.eq(
            payload.req.status
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
        // if (payload.req.schema) payload.req.schema = payload.schema;

        delete payload.schema;

        const verifySchema =
          payload.req.schema ||
          payload.req.schemas ||
          payload.req.contract;

        if (verifySchema)
          validateSchema(verifySchema);

        if (payload.search) {
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
        count += 1;
        crudStorage.save.url = payload.req.url;
        crudStorage.save.beforeUrl = payload.req.url;
        crudStorage.save[`url${count}`] = payload.req.url;
      });
  };

  const reqExist = payload.req || payload.request;
  if (!reqExist) payload = organizeJSON(payload, payloadCreate);
  window.test = {};

  payload = replaceAllStrings(payload);

  if (!payload.req.url.startsWith("http")) {
    handleEndWithEndpoint(payload.req).then((url) => {
      payload.req.url = url;
      payload = replaceAllStrings(payload);
    });
  }

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
      let verify = conditionContinueTest(payload);
      if (verify) handleRequest(data, payload);
    } else {
      handleRequest(data, payload);
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
      if (window.save[path]) {
        result = window.save[path];
      } else {
        result = findInJson(window.alias.bodyResponse, path);
      }

      if (Array.isArray(result))
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
      else if (result === eq) logCondition = true;
    } else {
      result = findInJson(window.alias.bodyResponse, path);

      if (result) {
        logCondition = true;
      }
    }
  };

  if (typeof json.condition === "string") {
    if (window.save[json.condition]) {
      result = window.save[json.condition];
    } else result = findInJson(window.alias.bodyResponse, json.condition);

    if (result) {
      logCondition = true;
    } else {
      logCondition = false;
    }
    condicionAccept = json.condition;
  } else if (typeof json.condition === "number") {
    result = findInJson(window.alias.bodyResponse, "status");

    if (result.includes(json.condition)) {
      logCondition = true;
    } else {
      logCondition = false;
    }
    condicionAccept = json.condition;
  } else if (typeof json.condition === "object") {
    if (!Array.isArray(json.condition)) {
      handleCondition(json);
    }
  }

  if (logCondition) {
    const refactoryResult =
      typeof result !== "string" && result.length && result.length > 3
        ? `results contain ${result.length}`
        : result;
    const refactoryJsonCondition =
      typeof json.condition === "string"
        ? json.condition
        : JSON.stringify(json.condition);
    Cypress.log({
      name: `condition-accpet`,
      message: `previus test: [*${refactoryJsonCondition}*] return: [*${refactoryResult}*]`,
      consoleProps: () => ({
        json: formattedJson,
        condition: refactoryJsonCondition,
        value: result,
        framework: "cypress-crud",
      }),
    });
  } else {
    const refactoryJsonCondition =
      typeof json.condition === "string"
        ? json.condition
        : JSON.stringify(json.condition);
    Cypress.log({
      name: `condition-error`,
      message: `previus test: [*${refactoryJsonCondition}*] return: [*${result ? result : "not found"
        }*]`,
      consoleProps: () => ({
        json: formattedJson,
        condition: refactoryJsonCondition,
        value: result,
        framework: "cypress-crud",
      }),
    });
  }
  return logCondition;
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
  if (
    window.alias &&
    window.alias.bodyResponse &&
    window.alias.bodyResponse.allRequestResponses
  ) {
    delete window.alias.bodyResponse.allRequestResponses;
  }

  let responseAlias = window.alias.bodyResponse.body
    ? window.alias.bodyResponse.body
    : window.alias.bodyResponse.response;
  if (typeof responseAlias === "string") {
    try {
      responseAlias = JSON.parse(responseAlias);
    } catch (error) {
      console.error("Error converter to object:", error);
    }
  }

  let useEq;
  const saveLog = (saveName, eq) => {
    crudStorage.save[saveName] = eq;

    return Cypress.log({
      name: "save",
      message: `[${saveName}] = ${JSON.stringify(eq)}`,
      consoleProps: () => ({
        alias: saveName,
        value: eq,
        framework: "cypress-crud",
      }),
    });
  };
  const stringValidation = (stringValue) => {
    if (
      stringValue.trim().includes("===") &&
      !stringValue.trim().includes(":::") &&
      !stringValue.trim().includes(">")
    ) {
      let validation = false;
      const splitEq = stringValue.trim().split("===");
      const splitSave = splitEq[1].trim();
      useEq = splitSave;
      const paths = findInJson(responseAlias, splitEq[0].trim());

      if (!paths || paths === undefined)
        throw new Error(
          `${splitEq[0].trim()} not found results in JSON. ${JSON.stringify(
            responseAlias,
            null,
            2
          )}`
        );

      for (let path of paths) {
        let pathResolve = typeof path === "string" ? path.trim() : path;
        let eqResolve =
          typeof splitSave === "string" ? splitSave.trim() : splitSave;
        eqResolve =
          typeof pathResolve === "number" ? parseInt(eqResolve) : eqResolve;

        if (pathResolve === eqResolve) {
          validation = true;
          expect(pathResolve).to.eql(eqResolve);
          return false;
        }
      }
      if (!validation) {
        expect(`error validation eqls not found ${useEq} in ${paths}`, true).to
          .be.false;
      }
      return;
    } else if (
      stringValue.trim().includes("===") &&
      stringValue.trim().includes(":::") &&
      !stringValue.trim().includes(">")
    ) {
      let validation = false;
      const splitEq = stringValue.trim().split("===");
      const splitSave = splitEq[1].trim().split(":::");
      useEq = splitSave[0];
      const paths = findInJson(responseAlias, splitEq[0].trim());

      if (!paths || paths === undefined)
        throw new Error(
          `${splitEq[0].trim()} not found results in JSON. ${JSON.stringify(
            responseAlias,
            null,
            2
          )}`
        );

      for (let path of paths) {
        let pathResolve = typeof path === "string" ? path.trim() : path;
        let eqResolve =
          typeof splitSave[0] === "string" ? splitSave[0].trim() : splitSave[0];
        eqResolve =
          typeof pathResolve === "number" ? parseInt(eqResolve) : eqResolve;

        if (pathResolve === eqResolve) {
          validation = true;
          expect(eqResolve).to.be.eq(eqResolve);
          // save
          const saveName = splitSave[1].trim()
            ? splitSave[1].trim()
            : splitEq[0].trim();
          saveLog(saveName, eqResolve);
          return false;
        }
      }
      if (!validation) {
        expect(`error validation eqls not found ${useEq}`, true).to.be.false;
      }
    } else if (
      stringValue.trim().includes(":::") &&
      !stringValue.trim().includes("===") &&
      !stringValue.trim().includes(">")
    ) {
      const sliptSave = stringValue.trim().split(":::");
      const paths = findInJson(responseAlias, sliptSave[0].trim());

      if (!paths || paths === undefined)
        throw new Error(
          `${sliptSave[0].trim()} not found results in JSON. ${JSON.stringify(
            responseAlias,
            null,
            2
          )}`
        );

      const saveName = sliptSave[1].trim()
        ? sliptSave[1].trim()
        : sliptSave[0].trim();
      saveLog(saveName, paths.length === 1 ? paths[0] : paths);
    } else if (
      stringValue.trim().includes(":::") &&
      stringValue.trim().includes(">") &&
      !stringValue.trim().includes("===")
    ) {
      const sliptSave = stringValue.trim().split(":::");
      const splitPostition = sliptSave[1].trim().split(">");

      const paths = findInJson(responseAlias, sliptSave[0].trim());

      if (!paths || paths === undefined)
        throw new Error(
          `${sliptSave[0].trim()} not found results in JSON. ${JSON.stringify(
            responseAlias,
            null,
            2
          )}`
        );

      const saveName =
        splitPostition[1].trim() && splitPostition[0].trim() !== ""
          ? splitPostition[0].trim()
          : sliptSave[0].trim();

      saveLog(
        saveName,
        splitPostition[1] ? paths[splitPostition[1] - 1] : paths
      );
    } else {
      const paths = findInJson(responseAlias, stringValue);

      if (paths && paths.length === 1) {
        for (let pathExist of paths) {
          expect(pathExist, stringValue).to.be.exist;
        }
      } else {
        if (stringValue.includes(">")) {
          const splitPostition = stringValue.trim().split(">");
          const pathsPosition = findInJson(
            responseAlias,
            splitPostition[0].trim()
          );
          if (pathsPosition) {
            expect(pathsPosition[splitPostition[1] - 1], splitPostition[0].trim()).to.be.exist;
          }
          saveLog(
            splitPostition[0].trim(),
            pathsPosition[splitPostition[1] - 1]
          );
        } else {
          if (!paths || paths === undefined)
            throw new Error(
              `${stringValue} not found results in JSON. ${JSON.stringify(
                responseAlias,
                null,
                2
              )}`
            );

          if (paths.length > 50) {
            expect(paths, `[${stringValue}]`).to.be.exist;
          } else {
            paths.forEach((value, index) => {
              expect(value, `[${stringValue}] position: ${index + 1}`).to.be
                .exist;
            });
          }
        }
      }
      return false;
    }
  }
  if (typeof initValid === "string") {

    if (initValid.includes(",")) {
      const separate = initValid.split(",")
      for (const s of separate) stringValidation(s.trim())
    } else stringValidation(initValid)
  } else {
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

    let aliasPath = alias || as || path;
    let useAlias = alias || as;
    const key_property = property || key;
    function filterObject(obj) {
      const filteredObj = {};
      for (const [key, value] of Object.entries(obj)) {
        if (value !== null && value !== undefined) {
          filteredObj[key] = value;
        }
      }
      return filteredObj;
    }

    const filteredInitValid = filterObject({
      path,
      eq,
      position,
      type,
      search,
      alias,
      as,
      property,
      key,
    });

    const simbol = "->";

    if (!path && !eq && !position && !type && search) {
      searchEq(window.alias.bodyResponse, search, aliasPath);
      return;
    }
    let paths = findInJson(responseAlias, path);


    if (!paths || paths === undefined)
      throw new Error(
        `${path} not found results in JSON. ${JSON.stringify(
          responseAlias,
          null,
          2
        )}`
      );

    if (!eq) {
      if (position) {
        expect(paths[position - 1], `${JSON.stringify(filteredInitValid)}`).to
          .be.exist;
        if (type)
          expect(
            paths[position - 1],
            `${JSON.stringify(filteredInitValid)}`
          ).to.be.an(type);

        if (useAlias) saveLog(aliasPath, paths[position - 1]);
      } else {
        if (paths.length > 50) {
          expect(paths, `${JSON.stringify(filteredInitValid)}`).to.be.exist;
        } else if (paths.length === 1) {
          paths = paths[0];
          expect(paths, `${JSON.stringify(filteredInitValid)}`).to.be.exist;
          if (type)
            expect(paths, `${JSON.stringify(filteredInitValid)}`).to.be.an(
              type
            );
        } else {

          paths.forEach((value, index) => {
            expect(value, `${JSON.stringify(filteredInitValid)} position: ${index + 1}`).to.be
              .exist;
          });
        }

        if (useAlias) saveLog(aliasPath, paths);
      }
    } else if (eq) {
      let equals = null;

      if (position && type) {
        expect(eq, `${JSON.stringify(filteredInitValid)}`).to.eq(
          paths[position - 1]
        );
        expect(
          paths[position - 1],
          `${JSON.stringify(filteredInitValid)}`
        ).to.be.an(type);
        if (useAlias) saveLog(aliasPath, paths[position - 1]);
      } else if (position && !type) {
        expect(eq, `${JSON.stringify(filteredInitValid)}`).to.be.eq(
          paths[position - 1]
        );
        if (useAlias) saveLog(aliasPath, paths[position - 1]);
      } else if (!position) {
        if (eq.includes("||")) {
          equals = true;
          const separate = eq
            .trim()
            .split("||")
            .map((str) => str.trim());

          expect(
            `${JSON.stringify(separate)}`,
          ).to.be.includes(paths[0]);
        }
        for (let pathEq of paths) {
          if (pathEq === eq) {
            equals = true;
            expect(eq, `${JSON.stringify(filteredInitValid)}`).to.be.eq(pathEq);
            if (type)
              expect(pathEq, `${JSON.stringify(filteredInitValid)}`).to.be.an(
                type
              );
            if (useAlias) saveLog(aliasPath, pathEq);
            return false;
          }
        }
        if (!equals) throw `${eq} not exist in response.`
      }
    }
  }
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
  if (typeof input === "string") {
    save(input);
  } else if (!Array.isArray(input)) input = [input];

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
function save(initValid) {


  if (
    window.alias &&
    window.alias.bodyResponse &&
    window.alias.bodyResponse.allRequestResponses
  ) {
    delete window.alias.bodyResponse.allRequestResponses;
  }

  let responseAlias = window.alias.bodyResponse.body
    ? window.alias.bodyResponse.body
    : window.alias.bodyResponse.response;

  let usePath;
  let useEq;
  let usePosition;
  const saveLog = (saveName, eq) => {
    crudStorage.save[saveName] = eq;

    return Cypress.log({
      name: "save",
      message: `[${saveName}] = ${JSON.stringify(eq)}`,
      consoleProps: () => ({
        alias: saveName,
        value: eq,
        framework: "cypress-crud",
      }),
    });
  };
  const stringValidation = (stringValue) => {
    if (
      stringValue.trim().includes("===") &&
      !stringValue.trim().includes(":::") &&
      !stringValue.trim().includes(">")
    ) {
      let validation = false;
      const splitEq = stringValue.trim().split("===");
      const splitSave = splitEq[1].trim();
      useEq = splitSave;
      const paths = findInJson(responseAlias, splitEq[0].trim());

      if (!paths || paths === undefined)
        throw new Error(
          `${splitEq[0].trim()} not found results in JSON. ${JSON.stringify(
            responseAlias,
            null,
            2
          )}`
        );

      for (let path of paths) {
        let pathResolve = typeof path === "string" ? path.trim() : path;
        let eqResolve =
          typeof splitSave === "string" ? splitSave.trim() : splitSave;
        eqResolve =
          typeof pathResolve === "number" ? parseInt(eqResolve) : eqResolve;

        if (pathResolve === eqResolve) {
          validation = true;
          saveLog(splitEq[0].trim(), eqResolve);
          return false;
        }
      }
      if (!validation) {
        Cypress.log({
          name: "save",
          message: `Not found, data not save`,
          consoleProps: () => ({
            framework: "cypress-crud",
          }),
        });
      }
      return;
    } else if (
      stringValue.trim().includes("===") &&
      stringValue.trim().includes(":::") &&
      !stringValue.trim().includes(">")
    ) {
      let validation = false;
      const splitEq = stringValue.trim().split("===");
      const splitSave = splitEq[1].trim().split(":::");
      useEq = splitSave[0];
      const paths = findInJson(responseAlias, splitEq[0].trim());

      if (!paths || paths === undefined)
        throw new Error(
          `${splitEq[0].trim()} not found results in JSON. ${JSON.stringify(
            responseAlias,
            null,
            2
          )}`
        );

      for (let path of paths) {
        let pathResolve = typeof path === "string" ? path.trim() : path;
        let eqResolve =
          typeof splitSave[0] === "string" ? splitSave[0].trim() : splitSave[0];
        eqResolve =
          typeof pathResolve === "number" ? parseInt(eqResolve) : eqResolve;

        if (pathResolve === eqResolve) {
          validation = true;
          // save
          const saveName = splitSave[1].trim()
            ? splitSave[1].trim()
            : splitEq[0].trim();
          saveLog(saveName, eqResolve);
          return false;
        }
      }
      if (!validation) {
        Cypress.log({
          name: "save",
          message: `Not found, data not save`,
          consoleProps: () => ({
            framework: "cypress-crud",
          }),
        });
      }
    } else if (
      stringValue.trim().includes(":::") &&
      !stringValue.trim().includes("===") &&
      !stringValue.trim().includes(">")
    ) {
      const sliptSave = stringValue.trim().split(":::");
      const paths = findInJson(responseAlias, sliptSave[0].trim());

      if (!paths || paths === undefined)
        throw new Error(
          `${sliptSave[0].trim()} not found results in JSON. ${JSON.stringify(
            responseAlias,
            null,
            2
          )}`
        );

      const saveName = sliptSave[1].trim()
        ? sliptSave[1].trim()
        : sliptSave[0].trim();
      saveLog(saveName, paths.length === 1 ? paths[0] : paths);
    } else if (
      stringValue.trim().includes(":::") &&
      stringValue.trim().includes(">") &&
      !stringValue.trim().includes("===")

    ) {

      const sliptSave = stringValue.trim().split(":::");
      const splitPostition = sliptSave[1].trim().split(">");

      const paths = findInJson(responseAlias, sliptSave[0].trim());

      if (!paths || paths === undefined)
        throw new Error(
          `${sliptSave[0].trim()} not found results in JSON. ${JSON.stringify(
            responseAlias,
            null,
            2
          )}`
        );

      const saveName =
        splitPostition[1].trim() && !splitPostition[0].trim() === ""
          ? splitPostition[0].trim()
          : sliptSave[0].trim();

      saveLog(
        saveName,
        splitPostition[1] ? paths[splitPostition[1] - 1] : paths
      );
    } else {
      const paths = findInJson(responseAlias, stringValue);

      if (!paths || paths === undefined)
        throw new Error(
          `${stringValue} not found results in JSON. ${JSON.stringify(
            responseAlias,
            null,
            2
          )}`
        );

      saveLog(stringValue, paths.length === 1 ? paths[0] : paths);

      return false;
    }
  }
  //  const paths = findInJson(window.alias.bodyResponse, path_and_key);
  if (typeof initValid === "string") {

    if (initValid.includes(",")) {
      const separate = initValid.split(",")
      for (const s of separate) stringValidation(s.trim())
    } else stringValidation(initValid)
  }

  if (typeof initValid === "object") {
    if (!Array.isArray(initValid)) initValid = [initValid];

    for (let object of initValid) {
      const { alias, as, eq, log, path, position } = object;
      const useAlias = alias || as || path;

      if (!path)
        throw new Error(
          `{path: ""} not found in save, ex: {path: "id"} ${JSON.stringify(
            object,
            null,
            2
          )}`
        );

      const paths = findInJson(responseAlias, path);

      if (!paths || paths === undefined)
        throw new Error(
          `${path} not found results in JSON. ${JSON.stringify(
            responseAlias,
            null,
            2
          )}`
        );

      if (!eq && !position)
        saveLog(useAlias, paths.length === 1 ? paths[0] : paths);

      if (eq && !position) {
        let validationEq = false;
        for (let eqUse of paths) {
          if (Array.isArray(eqUse)) {
            for (let seconArray of eqUse) {
              if (seconArray === eq) {
                saveLog(useAlias, seconArray);
                validationEq = true;
                return false;
              }
            }
          }
          if (eqUse === eq) {
            saveLog(useAlias, eqUse);
            validationEq = true;
            return false;
          }
        }
        if (!validationEq)
          throw new Error(
            `${eq} not found results in JSON. ${JSON.stringify(
              responseAlias,
              null,
              2
            )}`
          );
      }

      if (position && !eq) saveLog(useAlias, paths[position - 1]);
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
  let json_response =
    window.alias.bodyResponse.body || window.alias.bodyResponse.response.body;
  if (typeof json_response === "string") {
    try {
      json_response = JSON.parse(json_response);
    } catch (error) {
      console.error("Error converter to object:", error);
    }
  }
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
  let json_response =
    window.alias.bodyResponse.body || window.alias.bodyResponse.response.body;
  if (typeof json_response === "string") {
    try {
      json_response = JSON.parse(json_response);
    } catch (error) {
      console.error("Error converter to object:", error);
    }
  }
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
  if (results.length === 0) {
    return undefined;
  } else {
    return results;
  }
}

Cypress.Commands.add(
  "findInJson",
  (
    keyToFind,
    obj = window.alias.bodyResponse.body
      ? window.alias.bodyResponse.body
      : window.alias.bodyResponse
  ) => {
    return cy.wrap(findInJson(obj, keyToFind), { log: false });
  }
);

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

            if (suffix === "frutas") newObj[key] = fakers.frutasBR();

            if (suffix === "fruit") newObj[key] = fakers.frutasEN();

            if (suffix === "objeto") newObj[key] = fakers.objetoBR();

            if (suffix === "object") newObj[key] = fakers.objetoEN();
            if (suffix.includes("number")) {
              const splitNum = suffix.split("number");
              newObj[key] = fakers.genNum(splitNum[1]);
            }
          } else {
            newObj[key] = value.replace(/\{(\w+)\}/g, (match, p1) => {
              return window.save.hasOwnProperty(p1)
                ? window.save[p1]
                : `not found ${p1}`;
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
    } else if (typeof obj.save === "string") {
      save(obj.save);
    } else {
      const { path, alias, eq, position, log, as } = obj.save;

      if (path) save({ path, alias, position, eq, log, as });
    }
  }

  if (obj.saveRequest || obj.request) {
    const saveLog = (saveName, value) => {
      crudStorage.save[saveName] = value;

      return Cypress.log({
        name: "save",
        message: `[${saveName}] = ${JSON.stringify(value)}`,
        consoleProps: () => ({
          alias: saveName,
          value: value,
          framework: "cypress-crud",
        }),
      });
    };
    const save_req = obj.saveRequest || obj.request;
    if (Array.isArray(save_req)) {
      save_req.forEach((item, i) => {
        const valRequest = findInJson(window.alias.payloadReport, item);
        if (valRequest)
          saveLog(
            `request_${item}`,
            valRequest.length == 1 ? valRequest[0] : valRequest
          );
      });
    } else {
      const valRequest = findInJson(window.alias.payloadReport, save_req);
      if (valRequest)
        saveLog(
          `request_${save_req}`,
          valRequest.length == 1 ? valRequest[0] : valRequest
        );
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
// function OK
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
