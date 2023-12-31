const applyStyles = require("./style.js");
import { validate } from "jsonschema";
Cypress.Commands.add("crud", ({ payload = null, alias = "response" }) => {
  if (Cypress.env("screenshot") && !Cypress.config("isInteractive"))
    cy.visit("src/index.html");
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
            if (Cypress.env("screenshot")) {
              shots();
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

            if (Cypress.env("screenshot")) {
              shots();
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

Cypress.Commands.add("crudScreenshot", (type = "viewport") => {
  if (!Cypress.config("isInteractive") && Cypress.env("screenshot")) {
  }
  return cy.screenshot({ capture: type });
});

function shots(
  requestObj = window.alias.payloadReport,
  responseObj = window.alias.bodyResponse.body
) {
  const app = window.top;

  // Seleciona ou cria o elemento de destino no DOM
  let targetElement = app.document.querySelector(".bg-gray-100");
  if (!targetElement) {
    targetElement = app.document.createElement("div");
    targetElement.className = "bg-gray-100";
    app.document.body.appendChild(targetElement);
  }

  const headerElement = app.document.getElementById("spec-runner-header");
  if (headerElement) headerElement.style.display = "none";

  // Cria a div principal (overlayDiv)
  const overlayDiv = app.document.createElement("div");
  overlayDiv.style.cssText = `
    position: absolute;
    z-index: 10;
    background-color: #1b1e2e;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column; // Alinha os cards verticalmente
    align-items: center;
    justify-content: start;
    padding: 20px;
    overflow-y: auto; // Permite rolagem vertical se necessário
  `;

  // Função para aplicar estilo comum às divs
  const aplicarEstiloDivComum = (div) => {
    div.style.cssText = `
    background-color: #282a36;
    padding: 20px;
    margin-bottom: 20px; // Espaço entre os cards
    border-radius: 8px;
    width: 80%; // Largura dos cards
    box-shadow: 3px 3px 10px rgba(0, 0, 0, 0.5);
    color: #f8f8f2;
    overflow-x: hidden; // Esconde a barra de rolagem horizontal
    word-wrap: break-word; // Quebra palavras longas para evitar overflow horizontal
  `;
  };

  // Função para adicionar título ao card
  const adicionarTitulo = (div, titulo) => {
    const header = app.document.createElement("div");
    header.textContent = titulo;
    header.style.cssText = `
      background-color: #50fa7b;
      color: #1b1e2e;
      padding: 10px;
      border-radius: 8px;
      font-weight: bold;
      text-align: center;
      width: 100%;
      margin-bottom: 10px;
    `;
    div.appendChild(header);
  };

  // Cria as divs para Request e Response
  const requestDiv = app.document.createElement("div");
  requestDiv.className = "requestdiv";
  const responseDiv = app.document.createElement("div");
  responseDiv.className = "responsediv";
  aplicarEstiloDivComum(requestDiv);
  aplicarEstiloDivComum(responseDiv);

  // Adiciona títulos
  adicionarTitulo(requestDiv, "Request");
  adicionarTitulo(responseDiv, "Response");

  // Função para formatar o conteúdo da div
  const formatarDadosRequisicao = (dados) => {
    // Transforma o objeto JSON em uma string formatada
    const stringDados = JSON.stringify(dados);

    // Retorna a string em um elemento <pre> com estilos para quebra de linha automática
    // e removendo as aspas e a formatação JSON padrão
    return `<pre><code style="white-space: pre-wrap; word-wrap: break-word;">${stringDados}</code></pre>`;
  };
  // Inserir Conteúdo formatado
  requestDiv.innerHTML = formatarDadosRequisicao(requestObj);
  responseDiv.innerHTML = formatarDadosRequisicao(responseObj);

  // Adicionar as divs à overlayDiv
  overlayDiv.appendChild(requestDiv);
  overlayDiv.appendChild(responseDiv);

  // Adicionar overlayDiv ao targetElement
  targetElement.appendChild(overlayDiv);

  if (!app.document.head.querySelector("[data-hover-style-jsons]")) {
    // Criar e inserir o elemento de estilo

    const style = app.document.createElement("style");

    style.innerHTML = `
  code, kbd, samp, pre{
   color: white;
  // font-size: 12px !important;
  }

  .requestdiv, .responsediv {
    border-radius: 10px;
     box-shadow: 3px 3px 10px rgba(0, 0, 0, 0.5);
  }
  .p-\\[16px\\] {
    display: none;
  }
    `;

    style.setAttribute("data-hover-styles-jsons", "");
    app.document.head.appendChild(style);
  }
}
