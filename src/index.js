const applyStyles = require("./style.js");

Cypress.Commands.add("crud", ({ payload = null, alias = "response" }) => {
  applyStyles();

  if (typeof payload === `object`) {
    if (payload && payload.endpoint && Cypress.env("environment")) {
      let env = Cypress.env(Cypress.env("environment"))[payload.endpoint];
      payload.request.url = env;
    }

    let data = { ...payload.request };
    if (data.path) {
      if (!window.save) window.save = {};
      data.url = `${data.url}/${window.save[data.path]}`;
    }
    return cy.api(data).then((response) => {
      if (!window.alias) {
        window.alias = {};
      }
      window.alias[alias] = response;
      window.alias["bodyResponse"] = response;
      if (payload.validations) {
        runValidation(payload.validations);
      }
      return response;
    });
  }
  return cy.fixture(payload).then((crud) => {
    if (crud && crud.endpoint && Cypress.env("environment")) {
      let env = Cypress.env(Cypress.env("environment"))[crud.endpoint];
      crud.request.url = env;
    }
    let data = { ...crud.request };
    if (data.path) {
      data.url = `${data.url}/${window.save[data.path]}`;
    }
    return cy.api(data).then((response) => {
      if (!window.alias) {
        window.alias = {};
      }
      window.alias[alias] = response;
      window.alias["bodyResponse"] = response;
      if (crud.validations) {
        runValidation(crud.validations);
      }
      return response;
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
          message: `${value}`,
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
        message: `${window.save[alias]}`,
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
