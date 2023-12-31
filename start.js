const fs = require("fs");
const path = require("path");

const configPath = path.resolve(__dirname, "../../");
const jsconfigFilePath = path.join(
  configPath,
  "node_modules/mochawesome-report-generator/dist"
);

function colorize(text, color) {
  const colors = {
    red: "\x1b[31m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
    magenta: "\x1b[35m",
    cyan: "\x1b[36m",
    reset: "\x1b[0m",
  };
  return `${colors[color]}${text}${colors.reset}`;
}

// Função para criar uma borda
function borderedText(text) {
  const topBottomBorder = "-".repeat(text.length);
  return `${topBottomBorder}\n|    ${text}   |\n${topBottomBorder}`;
}

// Mensagem para o console
const message = borderedText(
  colorize("Starting  config report cypress-crud...", "blue")
);

console.log(message);

fs.readFile(`${jsconfigFilePath}/app.js`, "utf8", (err, data) => {
  if (err) {
    console.error("Erro ao ler o arquivo:", err);
    return;
  }

  // Definir substituições como um array de objetos
  const substituicoes = [
    { procurar: "Adam Gruber", substituirPor: "Jam Batista" },
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
      substituirPor: ` | QA | Tester |`,
    },
    {
      procurar: '"v"',
      substituirPor: "",
    },
    {
      procurar: "Mochawesome",
      substituirPor: "cypress-crud",
    },
    // Adicione mais substituições conforme necessário
  ];

  // Aplicar todas as substituições
  let newData = data;
  substituicoes.forEach((subst) => {
    newData = newData.replace(
      new RegExp(subst.procurar, "g"),
      subst.substituirPor
    );
  });

  // Escrever o novo conteúdo no arquivo
  fs.writeFile(`${jsconfigFilePath}/app.js`, newData, "utf8", (err) => {
    if (err) {
      console.error("Erro ao escrever no arquivo:", err);
    }
  });
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
  `;

  fs.appendFile(`${jsconfigFilePath}/app.css`, css, "utf8", (err) => {
    if (err) {
      console.error("Erro ao adicionar texto no arquivo:", err);
    }
  });
});
