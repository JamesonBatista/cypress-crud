const styles = require("./styles");
const applyStyles = require("../style");

function createTestWrapper(testFunction) {
  return function (text, callback, options = {}) {
    const app = window.top;
    const spanElement = app.document.querySelector(
      "#unified-reporter > div > div > div.runnable-header > span"
    );

    // Injetar a fonte do Google Fonts
    const fontLink = app.document.createElement("link");
    fontLink.href =
      "https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap";
    fontLink.rel = "stylesheet";
    app.document.head.appendChild(fontLink);

    // Verifique se o elemento existe e se a variável de ambiente não está definida
    if (spanElement && !Cypress.env("subTitle")) {
      spanElement.innerText = text;

      // Aplicar estilos ao elemento

      spanElement.style.color = "white";
      spanElement.style.borderRadius = "5px";

      // Definir um atraso para garantir que a fonte seja carregada antes de aplicá-la
      setTimeout(() => {
        spanElement.style.fontFamily = "Roboto, sans-serif";
      }, 500); // Ajuste o tempo conforme necessário
    }
    const { skip, only } = options;
    if (only) {
      return testFunction.only(text, callback);
    } else if (skip) {
      return testFunction.skip(text, callback);
    } else {
      return testFunction(text, callback);
    }
  };
}

export function Scenario(text, callback, { skip = false, only = false } = {}) {
  let options = { skip: skip, only: only };

  applyStyles();
  return createTestWrapper(describe)(`sᴄᴇɴᴀʀɪᴏ - ${text}`, callback, options);
}

export function Given(text, callback, { skip = false, only = false } = {}) {
  let options = { skip: skip, only: only };
  return createTestWrapper(it)(`ɢɪᴠᴇɴ - ${text}`, callback, options);
}

// Repita para When, Then, etc.
export function When(text, callback, { skip = false, only = false } = {}) {
  let options = { skip: skip, only: only };
  return createTestWrapper(it)(`ᴡʜᴇɴ - ${text}`, callback, options);
}
export function And(text, callback, { skip = false, only = false } = {}) {
  let options = { skip: skip, only: only };
  return createTestWrapper(it)(`ᴀɴᴅ - ${text}`, callback, options);
}
export function Then(text, callback, { skip = false, only = false } = {}) {
  let options = { skip: skip, only: only };
  return createTestWrapper(it)(`ᴛʜᴇɴ - ${text}`, callback, options);
}

// Variantes em Português
export function Cenario(text, callback, { skip = false, only = false } = {}) {
  let options = { skip: skip, only: only };
  applyStyles();

  return createTestWrapper(describe)(`ᴄᴇɴᴀʀɪᴏ - ${text}`, callback, options);
}

export function Dado(text, callback, { skip = false, only = false } = {}) {
  let options = { skip: skip, only: only };
  return createTestWrapper(it)(`ᴅᴀᴅᴏ - ${text}`, callback, options);
}

export function Quando(text, callback, { skip = false, only = false } = {}) {
  let options = { skip: skip, only: only };
  return createTestWrapper(it)(`ǫᴜᴀɴᴅᴏ - ${text}`, callback, options);
}

export function E(text, callback, { skip = false, only = false } = {}) {
  let options = { skip: skip, only: only };
  return createTestWrapper(it)(`ᴇ - ${text}`, callback, options);
}

export function Entao(text, callback, { skip = false, only = false } = {}) {
  let options = { skip: skip, only: only };
  return createTestWrapper(it)(`ᴇɴᴛᴀᴏ - ${text}`, callback, options);
}

// describes and its

export function describes(text, callback, { skip = false, only = false } = {}) {
  let options = { skip: skip, only: only };
  applyStyles();

  return createTestWrapper(describe)(`ᴅᴇsᴄʀɪʙᴇs - ${text}`, callback, options);
}

export function its(text, callback, { skip = false, only = false } = {}) {
  let options = { skip: skip, only: only };
  return createTestWrapper(it)(`ɪᴛs - ${text}`, callback, options);
}

export const crudStorage = window;
