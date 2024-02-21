const applyStyles = require("../style");

export const crudStorage = window;
if(!crudStorage.save){
  crudStorage.save = {}
  crudStorage.counter = {}
crudStorage.counter.int = 0;

}


function createTestWrapper(testFunction) {
  return function (text, callback, options = {}) {
    const app = window.top;
    const spanElement = app.document.querySelector(
      "#unified-reporter > div > div > div.runnable-header > span"
    );

    const fontLink = app.document.createElement("link");
    fontLink.href =
      "https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap";
    fontLink.rel = "stylesheet";
    app.document.head.appendChild(fontLink);

    if (spanElement && !Cypress.env("subTitle")) {
      // spanElement.innerText = text;

      spanElement.style.color = "white";
      spanElement.style.borderRadius = "5px";

      setTimeout(() => {
        spanElement.style.fontFamily = "Roboto, sans-serif";
      }, 500);
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

  return createTestWrapper(describe)(`ᴅᴇsᴄʀɪʙᴇ - ${text}`, callback, options);
}

export function its(text, callback, { skip = false, only = false } = {}) {
  let options = { skip: skip, only: only };
  return createTestWrapper(it)(`ɪᴛ - ${text}`, callback, options);
}
export function Requests(text, callback, { skip = false, only = false } = {}) {
  let options = { skip: skip, only: only };
  applyStyles();
  crudStorage.counter.int =+ crudStorage.counter.int+1
  let int = crudStorage.counter.int;
  return createTestWrapper(describe)(`Rᥱqᥙᥱ᥉t ${int < 9? `0${int}`: {int} } ⮕ ${text}`, callback, options);
}
export function POST(text, callback, { skip = false, only = false } = {}) {
  let options = { skip: skip, only: only };
  return createTestWrapper(it)(`𝐏𝐎𝐒𝐓 ⮕ ${text}`, callback, options);
}
export function GET(text, callback, { skip = false, only = false } = {}) {
  let options = { skip: skip, only: only };
  return createTestWrapper(it)(`𝐆𝐄𝐓 ⮕ ${text}`, callback, options);
}
export function PUT(text, callback, { skip = false, only = false } = {}) {
  let options = { skip: skip, only: only };
  return createTestWrapper(it)(`𝐏𝐔𝐓 ⮕ ${text}`, callback, options);
}
export function DELETE(text, callback, { skip = false, only = false } = {}) {
  let options = { skip: skip, only: only };
  return createTestWrapper(it)(`𝐃𝐄𝐋𝐄𝐓𝐄 ⮕ ${text}`, callback, options);
}

export function PATH(text, callback, { skip = false, only = false } = {}) {
  let options = { skip: skip, only: only };
  return createTestWrapper(it)(`𝐏𝐀𝐓𝐇 ⮕ ${text}`, callback, options);
}

