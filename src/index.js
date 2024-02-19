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
Cypress.Commands.add("crud", ({ payload = null, alias = "response", log = false }) => {
  // chai.config.truncateThreshold = 300
  if (!Cypress.env("styles") && Cypress.env('crudStyles')) applyStyles();

  if (!window.save) {
    window.save = {};
  }

  if (!crudStorage.save) {
    crudStorage.save = {}
  }

  if (!crudStorage.request || !crudStorage.response) {
    crudStorage.request = {};
    crudStorage.response = {};
  }

  if (typeof payload === `object`) {
    // if (payload && payload.request.mock) {
    //   delete payload.request.path;
    // }
    if ((payload.request && payload.request.url.endsWith("/")) || (payload.req && payload.req.url.endsWith("/"))) {
      const req = payload.request || payload.req;

      req.url = req.url.slice(0, -1);
    }

    const reqPath = payload.request || payload.req


    if (reqPath.url && !reqPath.url.startsWith('http')) {
      let environment = Cypress.env(Cypress.env("environment")) && Cypress.env(Cypress.env("environment"))[reqPath.url] || Cypress.env(reqPath.url)
      if (environment) reqPath.url = environment



      if (Cypress.env("environment"))
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
        })


    }

    //replace
    if (reqPath && reqPath.replace || payload.req && payload.req.replace) {
      let path = null;
      if ((reqPath && reqPath.path) || (payload.req && payload.req.path)) {
        path = reqPath.path || payload.req.path
        delete reqPath.path && payload.req.path
      }
      if ((payload.request && !payload.request.path) || (payload.req && !payload.req.path)) {
        payload = replaceAllStrings(payload);
      }
      if (path && payload.request) {
        payload.request.path = path
      } else if (path && payload.req) {
        payload.req.path = path
      }
    }
    //replace
    let separate = null;
    let env = null;

    if (payload && payload.endpoint) {
      if (Cypress.env("environment")) {
        env = Cypress.env(Cypress.env("environment"))[payload.endpoint];
      }

      if ((payload.request && payload.request.path) || (payload.req && payload.req.path)) {
        if ((payload.request && payload.request.path.startsWith("/")) || ((payload.req && payload.req.path.startsWith("/")))) {
          const req = payload.request || payload.req
          req.url = `${env || req.url}${req.path}`;
        } else {
          if ((payload.request && payload.request.path.includes("/")) || (payload.req && payload.req.path.includes("/"))) {
            const req = payload.request || payload.req
            separate = req.path.split("/");
            req.url = `${env || req.url}/${window.save[separate[0]]
              }/${separate[1]}`;
          } else {
            req.url = `${req.url}/${window.save[req.path]
              }`;
          }
        }
      } else {
        const req = payload.request || payload.req
        req.url = `${env || req.url}`;
      }
      const envCy = Cypress.env(Cypress.env("environment"));
      const req = payload.request || payload.req
      let cyEnv =
        envCy && envCy[payload.endpoint]
          ? envCy[payload.endpoint]
          : `${req.url}${req.path || ""}`;
      const log = {
        name: "env",
        message: `${Cypress.env("environment") || "environment not found"}`,
        consoleProps: () => {
          return {
            env: Cypress.env("environment") || "environment not found",
            path: payload.endpoint,
            endpoint: cyEnv,
            framework: "cypress-payload",
          };
        },
      };
      Cypress.log(log);
    } else if (payload && !payload.endpoint) {
      const req = payload.request || payload.req

      if (req.path) {
        if (req.path.startsWith("/")) {
          req.url = `${req.url}${req.path}`;
        } else {
          if (req.path.includes("/")) {
            separate = req.path.split("/");
            req.url = `${req.url}/${window.save[separate[0]]
              }/${separate[1]}`;
          } else {
            req.url = `${req.url}/${window.save[req.path]
              }`;
          }
        }
      }
    }
    const req = payload.request || payload.req

    let data = { ...req };
    if (!window.save) window.save = {};

    if (!Cypress.config("isInteractive"))
      cy.task(
        "crudLog",
        textNpxRunCypress({ type: "request", payload: data })
      );
    data["failOnStatusCode"] = Cypress.env("failOnStatusCode") || false;

    counter += 1;
    crudStorage.request[`payload${counter}`] = data;
    if (!window.alias) {
      window.alias = {};
      delete req.path
      window.alias.payloadReport = payload;
    } else {
      delete req.path
      window.alias.payloadReport = payload;
    }

    if (data && data.mock) {
      window.mock = {};

      return cy.fixture(data.mock).then((mocks) => {

        Cypress.log({
          name: "mock",
          message: ` Intercept ** ${data.mock} ** `,
          consoleProps: () => {
            return {
              mock: payload.request.mock,
              body: mocks,
              framework: "cypress-crud",
            };
          },
        }
        );

        if (typeof mocks.response.body === 'string') {
          cy.fixture(`${mocks.response.body}`).then(json => {
            mocks.response.body = json
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


              });
          })
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


            });
        }


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
            expectValidations(payload);

            return response;
          });
      } else {
        expectValidations(payload);

        return response;
      }

    });

  }

  return cy.fixture(payload).then((crud) => {
    // if (crud && crud.request.mock) {
    //   delete crud.request.path;
    // }
    if ((crud.request && crud.request.url.endsWith("/")) || (crud.req && crud.req.url.endsWith("/"))) {
      const req = crud.request || crud.req;

      req.url = req.url.slice(0, -1);
    }
    const reqPath = crud.request || crud.req


    if (reqPath.url && !reqPath.url.startsWith('http')) {
      let environment = Cypress.env(Cypress.env("environment")) && Cypress.env(Cypress.env("environment"))[reqPath.url] || Cypress.env(reqPath.url)
      if (environment) reqPath.url = environment



      if (Cypress.env("environment"))
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
        })


    }


    //replace
    if (reqPath && reqPath.replace || reqPath && reqPath.replace) {
      let path = null;
      if ((reqPath && reqPath.path) || (reqPath && reqPath.path)) {
        path = reqPath.path || reqPath.path
        delete reqPath.path && reqPath.path
      }
      if ((crud.request && !crud.request.path) || (crud.req && !crud.req.path)) {
        crud = replaceAllStrings(crud);
      }
      if (path && crud.request) {
        crud.request.path = path
      } else if (path && crud.req) {
        crud.req.path = path
      }
    }
    //replace


    let separate = null;
    let env = null;
    if (crud && crud.endpoint) {
      if (Cypress.env("environment")) {
        env = Cypress.env(Cypress.env("environment"))[crud.endpoint];
      }
      if ((crud.request && crud.request.path) || (crud.req && crud.req.path)) {
        if ((crud.request && crud.request.path.startsWith("/")) || ((crud.req && crud.req.path.startsWith("/")))) {
          const req = crud.request || crud.req
          req.url = `${env || req.url}${req.path}`;
        } else {
          if ((crud.request && crud.request.path.includes("/")) || (crud.req && crud.req.path.includes("/"))) {
            const req = crud.request || crud.req
            separate = req.path.split("/");
            req.url = `${env || req.url}/${window.save[separate[0]]
              }/${separate[1]}`;
          } else {
            req.url = `${req.url}/${window.save[req.path]
              }`;
          }
        }
      } else {
        const req = crud.request || crud.req
        req.url = `${env || req.url}`;
      }
      const envCy = Cypress.env(Cypress.env("environment"));
      const req = crud.request || crud.req
      let cyEnv =
        envCy && envCy[crud.endpoint]
          ? envCy[crud.endpoint]
          : `${req.url}${req.path || ""}`;
      const log = {
        name: "env",
        message: `${Cypress.env("environment") || "environment not found"}`,
        consoleProps: () => {
          return {
            env: Cypress.env("environment") || "environment not found",
            path: crud.endpoint,
            endpoint: cyEnv,
            framework: "cypress-crud",
          };
        },
      };
      Cypress.log(log);
    } else if (crud && !crud.endpoint) {
      const req = crud.request || crud.req

      if (req.path) {
        if (req.path.startsWith("/")) {
          req.url = `${req.url}${req.path}`;
        } else {
          if (req.path.includes("/")) {
            separate = req.path.split("/");
            req.url = `${req.url}/${window.save[separate[0]]
              }/${separate[1]}`;
          } else {
            req.url = `${req.url}/${window.save[req.path]
              }`;
          }
        }
      }
    }
    const req = crud.request || crud.req

    let data = { ...req };
    data["failOnStatusCode"] = Cypress.env("failOnStatusCode") || false;
    if (!Cypress.config("isInteractive")) {
      cy.task("crudLog", textNpxRunCypress({ type: "request", payload: data }));
    }

    counter += 1;
    crudStorage.request[`payload${counter}`] = data;

    if (!window.alias) {
      window.alias = {};
      delete req.path
      window.alias.payloadReport = crud;
    } else {
      delete req.path
      window.alias.payloadReport = crud;
    }
    //mock
    if (data && data.mock) {
      window.mock = {};
      return cy.fixture(data.mock).then((mocks) => {

        Cypress.log(
          {
            name: "mock",
            message: ` Intercept ** ${data.mock} ** `,
            consoleProps: () => {
              return {
                mock: data.mock,
                body: mocks,
                framework: "cypress-crud",
              };
            },
          }
        );

        if (typeof mocks.response.body === 'string') {
          cy.fixture(`${mocks.response.body}`).then(json => {
            mocks.response.body = json
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


              });
          })
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
                    expectValidations(crud);
                    return mocks;
                  });
              } else {
                expectValidations(crud);
                return mocks;
              }


            });
        }
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
            expectValidations(crud);
            return response;
          });
      } else {
        expectValidations(crud);
        return response;
      }
    });
  });
});
function runValidation(initValid) {
  if (window.alias && window.alias.bodyResponse && window.alias.bodyResponse.allRequestResponses) {
    delete window.alias.bodyResponse.allRequestResponses
  }
  const { path, eq, position, type, search, alias = null, as = null } = initValid;
  if (!path && !eq && !position && !type && search) {
    let aliasPath = alias || as;
    searchEq(window.alias.bodyResponse, search, aliasPath)
  }


  if (initValid && !initValid.search) {
    // for (let initValid of validations) {

    let paths = findInJson(window.alias.bodyResponse, initValid.path);
    let shouldCheckEquality = initValid.hasOwnProperty("eq");
    let validateType = initValid.hasOwnProperty("type");

    if (Array.isArray(paths) && paths.every(path => Array.isArray(path))) {

      let valueFoundInAnyArray = paths.some(path => {
        if (!Array.isArray(path)) return false;

        if (!initValid.eq) {
          if (initValid.position && typeof initValid.position === 'number') {
            if (initValid.position <= paths.length) {
              return paths[initValid.position - 1] !== undefined
            }
          } else { return paths; }
        } else {

          if (String(initValid.eq).trim().includes("||")) {
            return initValid.eq.split("||").map(eqValue => eqValue.trim()).some(eqValue => path.includes(eqValue));
          }
          return shouldCheckEquality ? path.includes(initValid.eq) : false
        }

      });

      if (shouldCheckEquality && !valueFoundInAnyArray) {

        reportError(paths, initValid);
      } else if (shouldCheckEquality && valueFoundInAnyArray) {
        expect(
          valueFoundInAnyArray,
          `${randonItens()}${initValid.path}:: expected '${initValid.eq}' to be found`
        ).to.be.true;
        if (validateType) typeAssert(valueFoundInAnyArray, initValid.path, initValid.type)

      } else if (valueFoundInAnyArray && !shouldCheckEquality) {
        expect(JSON.stringify(paths), `${randonItens()}${initValid.path}::`).to.exist;

        if (validateType) typeAssert(paths, initValid.path, initValid.type)
      }
    } else if (Array.isArray(paths)) {

      if (initValid.position && typeof initValid.position === 'number') {
        if (initValid.position <= paths.length) {
          if (initValid.type && !shouldCheckEquality) {
            expect(paths[initValid.position - 1], `Type check for path '${initValid.path}':`).to.be.an(initValid.type);
          } else if (shouldCheckEquality && initValid.type) {
            expect(paths[initValid.position - 1], `Type check for path '${initValid.path}':`).to.be.an(initValid.type);
            expect(paths[initValid.position - 1], `${randonItens()}${initValid.path}::`).to.eql(initValid.eq);
          } else if (!initValid.type && initValid.position) {
            expect(paths[initValid.position - 1], `${randonItens()}${initValid.path}::`).to.exist;
          }
        }
      }
      let valueFound = null;
      paths.some(path => {

        if (shouldCheckEquality && path === initValid.eq) {
          valueFound = path;
          return true;
        }
        return false;
      });
      if (paths && !valueFound) {
        if (!initValid.position) {

          expect(JSON.stringify(paths), `${randonItens()}${initValid.path}::`).to.exist;

          if (validateType) typeAssert(paths, initValid.path, initValid.type)
        }
      }

      if (shouldCheckEquality && !valueFound) {
        reportError(paths, initValid);
      }
      else if (shouldCheckEquality && valueFound) {

        expect(valueFound, `${randonItens()}${initValid.path}::`).to.eql(initValid.eq);

        if (validateType) typeAssert(valueFound, initValid.path, initValid.type)

      }
    } else {

      if (shouldCheckEquality && validateType) {
        typeAssert(paths, initValid.path, initValid.type)

        if (String(initValid.eq).trim().includes("||")) {
          let value = initValid.eq.split("||").map(eqValue => eqValue.trim()).some(eqValue => { return paths === eqValue });
          if (value) {
            expect(
              value,
              `${randonItens()}${initValid.path}:: expected '${initValid.eq}' to be found`
            ).to.be.true;
          } else {
            expect(
              false,
              `${randonItens()}${initValid.path}:: expected '${initValid.eq}' to be found`
            ).to.be.true;
          }

        } else {
          expect(
            paths,
            `${randonItens()}${initValid.path}::`
          ).to.eql(initValid.eq);
        }
      } else {

        expect(JSON.stringify(paths), `${randonItens()}${initValid.path}::`).to.exist;
        if (shouldCheckEquality) {
          if (String(initValid.eq).trim().includes("||")) {
            let value = initValid.eq.split("||").map(eqValue => eqValue.trim()).some(eqValue => { return paths === eqValue });
            if (value) {
              expect(
                value,
                `${randonItens()}${initValid.path}:: expected '${initValid.eq}' to be found`
              ).to.be.true;
            } else {
              expect(
                false,
                `${randonItens()}${initValid.path}:: expected '${initValid.eq}' to be found`
              ).to.be.true;
            }

          } else {

            expect(
              paths,
              `${randonItens()}${initValid.path}::`
            ).to.eql(initValid.eq);
          }

        }
        if (validateType) {

          typeAssert(paths, initValid.path, initValid.type)
        }
      }
    }
    // }
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
      obj.forEach(item => searchInObject(item, value));
    } else if (typeof obj === 'object' && obj !== null) {
      Object.values(obj).forEach(val => searchInObject(val, value));
    }
  }

  searchInObject(obj, searchValue, reserve);
  if (found) {
    expect(searchValue, `${randonItens()}searching::`).to.exist;
    if (reserve) {
      crudStorage.save[reserve] = searchValue
      Cypress.log({
        name: 'save',
        message: `[${reserve || 'save'}] = ${typeof searchValue === 'object' ? JSON.stringify(searchValue) : searchValue}`,
        consoleProps: () => ({
          alias: reserve || 'save',
          value: searchValue,
          framework: "cypress-crud",
        }),
      });
    }
  } else {
    expect(
      false,
      `Expected value '${searchValue}' not found'`
    ).to.be.true;
  }
}


function typeAssert(paths, path, type) {
  if (paths && type) {
    if (Array.isArray(paths) && type === 'array') {
      expect(paths, `Type check for path '${path}':`).to.be.an(type);
    }
    else if (typeof paths === type) {
      expect(paths, `Type check for path '${path}':`).to.be.an(type);
    } else {
      throw new Error(`Expected type '${type}' but found '${typeof paths}' for path '${path}'`);
    }
  }
}

Cypress.Commands.add("runValidation", (validations) => {
  return runValidation(validations);
});

Cypress.Commands.add("bodyResponse", (...args) => {

  args.forEach(({ path, eq, type, search, alias, as }) => {

    if (!path && !eq && !type && search) {
      let aliasPath = as || alias;
      searchEq(window.alias.bodyResponse, search, aliasPath)
    } else {
      let paths = findInJson(window.alias.bodyResponse, path);

      if (!Array.isArray(paths)) {
        paths = [paths];
      }

      let valueFound = false;
      paths.forEach((item) => {
        const checkValue = (value) => {
          if (path && !eq) {
            expect(`${typeof value === 'object' || typeof value === 'array' ? JSON.stringify(value) : value}`, `${randonItens()}${path}::`).to.exist;
          }
          if (eq && value === eq) {
            expect(value, `${randonItens()}${path}::`).to.eql(eq);
            valueFound = true;
          }

          if (type && typeof value !== type) {

            throw new Error(`Expected type '${type}' but found '${typeof value}' for path '${path}'`);
          } if (type) {
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
        expect(valueFound, `Expected value '${eq}' not found for path '${path}'`).to.be.true;
      }
    }


  });
});

Cypress.Commands.add("response", (...args) => {
  args.forEach(({ path, eq, type, search, alias, as }) => {

    if (!path && !eq && !type && search) {
      let aliasPath = as || alias;
      searchEq(window.alias.bodyResponse, search, aliasPath)
    } else {
      let paths = findInJson(window.alias.bodyResponse, path);

      if (!Array.isArray(paths)) {
        paths = [paths];
      }

      let valueFound = false;
      paths.forEach((item) => {
        const checkValue = (value) => {
          if (path && !eq) {
            expect(`${typeof value === 'object' || typeof value === 'array' ? JSON.stringify(value) : value}`, `${randonItens()}${path}::`).to.exist;
          }
          if (eq && value === eq) {
            expect(value, `${randonItens()}${path}::`).to.eql(eq);
            valueFound = true;
          }

          if (type && typeof value !== type) {

            throw new Error(`Expected type '${type}' but found '${typeof value}' for path '${path}'`);
          } if (type) {
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
        expect(valueFound, `Expected value '${eq}' not found for path '${path}'`).to.be.true;
      }
    }


  });
});

Cypress.Commands.add("res", (...args) => {
  args.forEach(({ path, eq, type, search, alias, as }) => {

    if (!path && !eq && !type && search) {
      let aliasPath = as || alias;
      searchEq(window.alias.bodyResponse, search, aliasPath)
    } else {
      let paths = findInJson(window.alias.bodyResponse, path);

      if (!Array.isArray(paths)) {
        paths = [paths];
      }

      let valueFound = false;
      paths.forEach((item) => {
        const checkValue = (value) => {
          if (path && !eq) {
            expect(`${typeof value === 'object' || typeof value === 'array' ? JSON.stringify(value) : value}`, `${randonItens()}${path}::`).to.exist;
          }
          if (eq && value === eq) {
            expect(value, `${randonItens()}${path}::`).to.eql(eq);
            valueFound = true;
          }

          if (type && typeof value !== type) {

            throw new Error(`Expected type '${type}' but found '${typeof value}' for path '${path}'`);
          } if (type) {
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
        expect(valueFound, `Expected value '${eq}' not found for path '${path}'`).to.be.true;
      }
    }


  });
});

Cypress.Commands.add("expects", (...args) => {
  args.forEach(({ path, eq, type, search, alias, as }) => {

    if (!path && !eq && !type && search) {
      let aliasPath = as || alias;
      searchEq(window.alias.bodyResponse, search, aliasPath)
    } else {
      let paths = findInJson(window.alias.bodyResponse, path);

      if (!Array.isArray(paths)) {
        paths = [paths];
      }

      let valueFound = false;
      paths.forEach((item) => {
        const checkValue = (value) => {
          if (path && !eq) {
            expect(`${typeof value === 'object' || typeof value === 'array' ? JSON.stringify(value) : value}`, `${randonItens()}${path}::`).to.exist;
          }
          if (eq && value === eq) {
            expect(value, `${randonItens()}${path}::`).to.eql(eq);
            valueFound = true;
          }

          if (type && typeof value !== type) {

            throw new Error(`Expected type '${type}' but found '${typeof value}' for path '${path}'`);
          } if (type) {
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
        expect(valueFound, `Expected value '${eq}' not found for path '${path}'`).to.be.true;
      }
    }


  });
});
Cypress.Commands.add("save", (input) => {
  if (Array.isArray(input)) {
    input.forEach(item => { if (input.path) save(item) });
  } else {
    if (input.path) {
      save(input);
    }
  }
});
function save({ path = null, alias = null, log = true, eq = null, position = null, as = null } = {}) {
  if (!window.save) {
    window.save = {};
  }
  let results = findInJson(window.alias.bodyResponse, path);
  let valueToSave;

  if (eq === null || eq === undefined) {
    if (typeof position === 'number' && Array.isArray(results)) {
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
      results.some(subArray => {
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
    window.save[as ||alias || path] = valueToSave;

    if (log) {
      Cypress.log({
        name: 'save',
        message: `[${as||alias || path}] = ${JSON.stringify(valueToSave)}`,
        consoleProps: () => ({
          alias: alias,
          value: valueToSave,
          framework: "cypress-crud",
        }),
      });
    } else {
      Cypress.log({
        name: 'save',
        message: `value hidden saved in [${as||alias || path}]`,
        consoleProps: () => ({
          alias: alias,
          value: "No value to save",
          framework: "cypress-crud",
        }),
      });
    }
  } else if (log) {
    Cypress.log({
      name: 'save',
      message: `[${eq || path || 'error'}] has not been found and will not be saved for [${as||alias || path}]`,
      consoleProps: () => ({
        alias: alias,
        value: "No value to save",
        framework: "cypress-crud",
      }),
    });
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
Cypress.Commands.add("schema", ({ schema = null }) => {
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
  if (Cypress.env("visualPayloads")) createHTML();
  if (Cypress.env("screenshot") && !Cypress.config("isInteractive")) {
    createHTML();
    return cy.screenshot({ capture: type });
  } else {
    if (window.mock && window.mock.active && Cypress.env("screenshot")) {
      createHTML();
    }
  }
});
Cypress.Commands.add("crudshot", (type = "runner") => {
  if (Cypress.env("visualPayloads")) createHTML();
  if (Cypress.env("screenshot") && !Cypress.config("isInteractive")) {
    createHTML();
    return cy.screenshot({ capture: type });
  } else {
    if (window.mock && window.mock.active && Cypress.env("screenshot")) {
      createHTML();
    }
  }
});
function createHTML() {
  const payload = window.alias.payloadReport.request || window.alias.payloadReport.req
  const app = window.top;
  const requestJson = JSON.stringify(
    payload,
    null,
    1
  );


  const responseJson = JSON.stringify(
    window.alias.bodyResponse.body || window.alias.bodyResponse,
    null,
    1
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
      background-color: black;
    }
    .container { 
      display: flex; 
      justify-content: space-around; 
      align-items: flex-start; 
      padding-top: 5px; /* Espaço no topo */
      height: calc(100vh - 10px); /* Altura total menos o espaço no topo */
       overflow: auto;
    }
    .card { 
      background-color: #33333357;
      width: 48%; /* Ajuste para margem entre os cartões */
      box-sizing: border-box;
      border-radius: 8px;
      box-shadow: 0 6px 10px rgba(0,0,0,0.25);
      overflow: hidden; 
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
              border-radius: 8px;
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
              border-radius: 8px;
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
    border-radius: 8px;
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
  const req = obj.request || obj.req
  if (!req || !req.replace || typeof req.replace !== 'string') {
    return obj;
  }

  const replaceParams = req.replace.split(', ');
  const subs = replaceParams.map(param => {
    const subsForValue = window.save.hasOwnProperty(param) ? window.save[param] : param;
    try {
      const parsedValue = typeof subsForValue === 'string' ? JSON.parse(subsForValue) : subsForValue;
      return { search: new RegExp(`\\b${param}\\b`, 'g'), subsFor: parsedValue, isJSON: true };
    } catch (e) {
      return { search: new RegExp(`\\b${param}\\b`, 'g'), subsFor: subsForValue, isJSON: false };
    }
  });

  function applySubstitutions(currentObj) {
    if (Array.isArray(currentObj)) {
      return currentObj.map(item => applySubstitutions(item));
    } else if (typeof currentObj === 'object' && currentObj !== null) {
      const newObj = {};
      Object.entries(currentObj).forEach(([key, value]) => {
        if (key === 'url') {
          newObj[key] = value;
        } else {
          let substitutionApplied = false;
          for (const { search, subsFor, isJSON } of subs) {
            if (search.test(value)) {
              substitutionApplied = true;
              if (isJSON) {
                newObj[key] = subsFor;
              } else if (typeof value === 'string') {
                newObj[key] = value.replace(search, subsFor);
              }
            }
          }
          if (!substitutionApplied) {
            newObj[key] = applySubstitutions(value);
          }
        }
      });
      return newObj;
    } else {
      return currentObj;
    }
  }

  const updatedObj = applySubstitutions(obj);

  if (updatedObj.request) {
    delete updatedObj.request.replace;
  }

  return updatedObj;
}

function expectValidations(obj) {
  const validProperty =
    obj.validations || obj.expects || obj.expect || obj.check || obj.checks || obj.res || obj.response || obj.validate;
  if (validProperty) {
    if (Array.isArray(validProperty)) {
      validProperty.forEach((item, index) => {
        runValidation(item)
      })
    } else {
      runValidation(validProperty);
    }
  }
  if (obj.save) {
    if (Array.isArray(obj.save)) {
      obj.save.forEach((item, index) => {
        const { path, alias, eq, position, log, as } = item
        if (path)
          save({ path, alias, position, eq, log, as })

      });
    } else {
      const { path, alias, eq, position, log, as } = obj.save
      if (path)
        save({ path, alias, position, eq, log, as })
    }
  }
}

function randonItens() {
  const computerItemEmojis = [":::"];

  const randomIndex = Math.floor(Math.random() * computerItemEmojis.length);

  return computerItemEmojis[randomIndex];
}
