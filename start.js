const fs = require("fs");
const path = require("path");
const version = '4.1.3'
const configPath = path.resolve(__dirname, "../../");
const jsconfigFilePath = path.join(
  configPath,
  "node_modules/mochawesome-report-generator/dist"
);
const changeStepPlugin = path.join(
  configPath,
  "node_modules/cypress-plugin-steps/dist/steps"
);
const newSteps = `
 export const step = (message) => {
    const logMessage = \`\${window.logCalls}: \${message}\`;
    Cypress.log({
        name: "description",
        message: logMessage.toUpperCase(),
        consoleProps: () => ({
            framework: "cypress-crud",
          })
    });
    window.testFlow.push(logMessage);
    window.logCalls++;
};
`;

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
      substituirPor: `${version} - | QA | Tester |`,
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

// change steps
fs.writeFile(`${changeStepPlugin}/step.js`, newSteps, "utf8", (err) => {});

const changeCypressLog = path.join(configPath, "node_modules/cypress/lib/exec");

const newText = `
"use strict";

const _ = require('lodash');
const debug = require('debug')('cypress:cli:run');
const util = require('../util');
const spawn = require('./spawn');
const verify = require('../tasks/verify');
const {
  exitWithError,
  errors
} = require('../errors');
const {
  processTestingType,
  throwInvalidOptionError,
  checkConfigFile
} = require('./shared');


const isValidProject = v => {
  if (typeof v === 'boolean') {
    return false;
  }
  if (v === '' || v === 'false' || v === 'true') {
    return false;
  }
  return true;
};

const processRunOptions = (options = {}) => {
  debug('processing run options %o', options);
  if (!isValidProject(options.project)) {
    debug('invalid project option %o', {
      project: options.project
    });
    return throwInvalidOptionError(errors.invalidRunProjectPath);
  }
  const args = ['--run-project', options.project];
  if (options.autoCancelAfterFailures || options.autoCancelAfterFailures === 0 || options.autoCancelAfterFailures === false) {
    args.push('--auto-cancel-after-failures', options.autoCancelAfterFailures);
  }
  if (options.browser) {
    args.push('--browser', options.browser);
  }
  if (options.ciBuildId) {
    args.push('--ci-build-id', options.ciBuildId);
  }
  if (options.config) {
    args.push('--config', options.config);
  }
  if (options.configFile !== undefined) {
    checkConfigFile(options);
    args.push('--config-file', options.configFile);
  }
  if (options.env) {
    args.push('--env', options.env);
  }
  if (options.exit === false) {
    args.push('--no-exit');
  }
  if (options.group) {
    args.push('--group', options.group);
  }
  if (options.headed) {
    args.push('--headed', options.headed);
  }
  if (options.headless) {
    if (options.headed) {
      return throwInvalidOptionError(errors.incompatibleHeadlessFlags);
    }
    args.push('--headed', !options.headless);
  }

  // if key is set use that - else attempt to find it by environment variable
  if (options.key == null) {
    debug('--key is not set, looking up environment variable CYPRESS_RECORD_KEY');
    options.key = util.getEnv('CYPRESS_RECORD_KEY');
  }

  // if we have a key assume we're in record mode
  if (options.key) {
    args.push('--key', options.key);
  }
  if (options.outputPath) {
    args.push('--output-path', options.outputPath);
  }
  if (options.parallel) {
    args.push('--parallel');
  }
  if (options.port) {
    args.push('--port', options.port);
  }
  if (options.quiet) {
    args.push('--quiet');
  }

  // if record is defined and we're not
  // already in ci mode, then send it up
  if (options.record != null) {
    args.push('--record', options.record);
  }

  // if we have a specific reporter push that into the args
  if (options.reporter) {
    args.push('--reporter', options.reporter);
  }

  // if we have a specific reporter push that into the args
  if (options.reporterOptions) {
    args.push('--reporter-options', options.reporterOptions);
  }
  if (options.runnerUi != null) {
    args.push('--runner-ui', options.runnerUi);
  }

  // if we have specific spec(s) push that into the args
  if (options.spec) {
    args.push('--spec', options.spec);
  }
  if (options.tag) {
    args.push('--tag', options.tag);
  }
  if (options.inspect) {
    args.push('--inspect');
  }
  if (options.inspectBrk) {
    args.push('--inspectBrk');
  }
  args.push(...processTestingType(options));
  return args;
};
module.exports = {
  processRunOptions,
  isValidProject,
  // resolves with the number of failed tests
  start(options = {}) {
      console.log("");
    console.log("");
    console.log("");
    console.log("                     🄲 🅈 🄿 🅁 🄴 🅂 🅂  - 🄲 🅁 🅄 🄳  ");
    console.log("");
  
    console.log('                    Welcome cypress-crud ${version}');
    console.log("                  The best framework for API testing");
    console.log("");
    console.log("           ------------------------------------------------------------");
    console.log("           Documentation:");
    console.log("           Visit https://github.com/JamesonBatista/cypress-crud");
    console.log('           Author: Jam Batista');
    console.log("");
    console.log("           LinkedIn: https://www.linkedin.com/in/jam-batista-98101015b/");
    console.log("           ------------------------------------------------------------");
    console.log("");
    console.log("");
    console.log("");  



    _.defaults(options, {
      key: null,
      spec: null,
      reporter: null,
      reporterOptions: null,
      project: process.cwd()
    });
    function run() {
      try {
        const args = processRunOptions(options);
        debug('run to spawn.start args %j', args);
        return spawn.start(args, {
          dev: options.dev
        });
      } catch (err) {
        if (err.details) {
          return exitWithError(err.details)();
        }
        throw err;
      }
    }
    if (options.dev) {
      return run();
    }
    return verify.start().then(run);
  }
};
`;

// change steps
fs.writeFile(`${changeCypressLog}/run.js`, newText, "utf8", (err) => {});


const newOpenCypress = `
"use strict";

const debug = require('debug')('cypress:cli');
const util = require('../util');
const spawn = require('./spawn');
const verify = require('../tasks/verify');
const {
  processTestingType,
  checkConfigFile
} = require('./shared');
const {
  exitWithError
} = require('../errors');

/**
 * Maps options collected by the CLI
 * and forms list of CLI arguments to the server.
 *
 * Note: there is lightweight validation, with errors
 * thrown synchronously.
 *
 * @returns {string[]} list of CLI arguments
 */
const processOpenOptions = (options = {}) => {
  // In addition to setting the project directory, setting the project option
  // here ultimately decides whether cypress is run in global mode or not.
  // It's first based off whether it's installed globally by npm/yarn (-g).
  // A global install can be overridden by the --project flag, putting Cypress
  // in project mode. A non-global install can be overridden by the --global
  // flag, putting it in global mode.
  if (!util.isInstalledGlobally() && !options.global && !options.project) {
    options.project = process.cwd();
  }
  const args = [];
  if (options.config) {
    args.push('--config', options.config);
  }
  if (options.configFile !== undefined) {
    checkConfigFile(options);
    args.push('--config-file', options.configFile);
  }
  if (options.browser) {
    args.push('--browser', options.browser);
  }
  if (options.env) {
    args.push('--env', options.env);
  }
  if (options.port) {
    args.push('--port', options.port);
  }
  if (options.project) {
    args.push('--project', options.project);
  }
  if (options.global) {
    args.push('--global', options.global);
  }
  if (options.inspect) {
    args.push('--inspect');
  }
  if (options.inspectBrk) {
    args.push('--inspectBrk');
  }
  args.push(...processTestingType(options));
  debug('opening from options %j', options);
  debug('command line arguments %j', args);
  return args;
};
module.exports = {
  processOpenOptions,
  start(options = {}) {
         console.log("");
    console.log("");
    console.log("");
    console.log("                     🄲 🅈 🄿 🅁 🄴 🅂 🅂  - 🄲 🅁 🅄 🄳  ");
    console.log("");
  
    console.log('                    Welcome cypress-crud ${version}');
    console.log("                The best framework for API testing");
    console.log("");
    console.log("--------------------------------------------------------");
    console.log("Documentation:");
    console.log("Visit https://github.com/JamesonBatista/cypress-crud");
    console.log('Author: Jam Batista');
    console.log("");
    console.log("LinkedIn: https://www.linkedin.com/in/jam-batista-98101015b/");
    console.log("--------------------------------------------------------");
    console.log("");
    console.log("");
    console.log("");  
    function open() {
      try {
        const args = processOpenOptions(options);
        return spawn.start(args, {
          dev: options.dev,
          detached: Boolean(options.detached)
        });
      } catch (err) {
        if (err.details) {
          return exitWithError(err.details)();
        }
        throw err;
      }
    }
    if (options.dev) {
      return open();
    }
    return verify.start().then(open);
  }
};

`

fs.writeFile(`${changeCypressLog}/open.js`, newOpenCypress, "utf8", (err) => {});