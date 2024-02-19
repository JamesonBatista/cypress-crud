const fs = require("fs");
const path = require("path");

const configPath = path.resolve(__dirname, "../../");
const jsconfigFilePath = path.join(
  configPath,
  "node_modules/mochawesome-report-generator/dist"
);
const pathPackage = path.join(
  configPath,
  "node_modules/cypress-crud/package.json"
);
let packageJson = require(pathPackage);

function colorizeEachLetter(text) {
  const colors = [
    "\x1b[31m", // vermelho
    "\x1b[32m", // verde
    "\x1b[33m", // amarelo
    "\x1b[34m", // azul
    "\x1b[35m", // magenta
    "\x1b[36m", // ciano
  ];
  const reset = "\x1b[0m";

  let coloredText = "";
  for (let i = 0; i < text.length; i++) {
    coloredText += colors[i % colors.length] + text[i];
  }
  return coloredText + reset;
}

function borderedText(text, originalLength) {
  const topBottomBorder = "-".repeat(originalLength + 8);
  return `${topBottomBorder}\n|    ${text}   |\n${topBottomBorder}`;
}

const originalText =
  "Starting config cypress-mochawesome-report cypress-crud...";

const message = borderedText(
  colorizeEachLetter(originalText),
  originalText.length
);

console.log("\n\n" + message + "\n\n");

fs.readFile(`${jsconfigFilePath}/app.js`, "utf8", (err, data) => {
  if (err) {
    console.error("Erro ao ler o arquivo:", err);
    return;
  }

  const substituicoes = [
    { procurar: "Adam Gruber", substituirPor: "Jam Batista | Gabriel Lopes" },
    {
      procurar: "http://adamgruber.github.io/mochawesome",
      substituirPor: "https://github.com/JamesonBatista/cypress-crud",
    },
    {
      procurar: "https://github.com/adamgruber",
      substituirPor: "https://github.com/JamesonBatista",
    },
    {
      procurar: "6.2.0",
      substituirPor: `${packageJson.version} - | QA | Tester |`,
    },
    {
      procurar: "Mochawesome",
      substituirPor: "🅲🆈🅿🆁🅴🆂🆂-🅲🆁🆄🅳",
    },
  ];

  let newData = data;
  substituicoes.forEach((subst) => {
    newData = newData.replace(
      new RegExp(subst.procurar, "g"),
      subst.substituirPor
    );
  });

  fs.writeFile(`${jsconfigFilePath}/app.js`, newData, "utf8", (err) => {});
  let css = `html, main, .test--code-snippet---3H5Xj.hljs, .test--context-item---R1NNU, .test--context---1YYgX {
    background: black;
  }
.navbar--component---2UCEi{
    background: black;
}
.suite--title---3T6OR{
    letter-spacing: 2px;
}
.test--header-btn---mI0Oy:hover{
       background: #80808038;
    border-left-color: white !important;
    border: 1px solid #ffffff29;
    border-radius: 4px;
    border-left: 5px solid;
h4{
    letter-spacing: 1px;
}
}
.footer--component---1WcTR a {
  color: greenyellow;
  }
.footer--component---1WcTR p {
    color: white;
    }
  `;

  fs.appendFile(`${jsconfigFilePath}/app.css`, css, "utf8", (err) => {});
  fs.appendFile(`${jsconfigFilePath}/app.inline.css`, css, "utf8", (err) => {});
});
