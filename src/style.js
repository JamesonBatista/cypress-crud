const app = window.top;
const dataDefaultStyle = `#unified-reporter > div > div > div.wrap > ul > li > div > div.collapsible-content.runnables-region > ul > li > div > div.collapsible-content.runnable-instruments > div > ul > li > div > div.collapsible-content.attempt-content > div > div > ul > li > div > div.collapsible-content > ul`
const spanElement = app.document.querySelector(
  "#unified-reporter > div > div > div.runnable-header > span"
);
const spanElement2 = app.document.querySelector(
  "#unified-reporter > div > header > span > button > span"
);

if (spanElement) {
  spanElement.style.letterSpacing = "2px";
  spanElement.innerText = Cypress.env("subTitle")
    ? Cypress.env("subTitle")
    : "🆃🅴🆂🆃🆂 🅸🅽 🅲🆈🅿🆁🅴🆂🆂";
}

if (spanElement2) {
  spanElement2.style.letterSpacing = "2px";

  spanElement2.innerText = Cypress.env("title")
    ? Cypress.env("title")
    : "🅲 🆈 🅿 🆁 🅴 🆂 🆂 - 🅲 🆁 🆄 🅳";
}

if (!app.document.head.querySelector("[data-hover-black-crud]")) {
  const style = app.document.createElement("style");
  let alias = `${dataDefaultStyle} li.command.command-name-save > div > span > div > span.command-info`;
  let log = `${dataDefaultStyle} li.command.command-name-log > div > span > div > span.command-info`;
  let aliasWrite = `${dataDefaultStyle} li.command.command-name-writeFile > div > span > div > span.command-info`;
  let aliasRead = `${dataDefaultStyle} li.command.command-name-readFile > div > span > div > span.command-info`;
  let valid = `${dataDefaultStyle} li.command.command-name-runValidation > div > span > div > span.command-info`;
  let env = `${dataDefaultStyle} li.command.command-name-env > div > span > div > span.command-info`;
  let schemas = `${dataDefaultStyle} li.command.command-name-schemas > div > span > div > span.command-info`;
  let mock = `${dataDefaultStyle} li.command.command-name-mock > div > span > div > span.command-info`;
  let valueColor = `span.command-message > span > strong {color: white;}`;
  let put = `${dataDefaultStyle} li.command.command-name-PUT > div > span > div > span.command-info > span.command-method`;

  let wrap = `${dataDefaultStyle} li.command.command-name-wrap > div > span > div > span.command-info > span.command-method`;

  let post = `${dataDefaultStyle} li.command.command-name-POST > div > span > div > span.command-info > span.command-method`;
  let deletes = `${dataDefaultStyle} li.command.command-name-DELETE > div > span > div > span.command-info > span.command-method`;
  let patch = `${dataDefaultStyle} li.command.command-name-PATCH > div > span > div > span.command-info > span.command-method`;
  let description = `${dataDefaultStyle} li.command.command-name-description > div > span > div > span.command-info`;
  let controls = `${dataDefaultStyle} li > div > span > div > span.command-controls`;
  let condition = `${dataDefaultStyle} li.command.command-name-condition-accpet > div > span > div > span.command-info`;
  let condition_error = `${dataDefaultStyle} li.command.command-name-condition-error > div > span > div > span.command-info`;


  style.innerHTML = `
  ${log} span.command-method > span {
    background-color: #675f5aeb;
    border-radius: 2px;
    padding: 0px 4px 1px 4px;
  }
${controls}{
  display: none;
  }
${description} span.command-method {
    background-color: #675f5aeb;
    border-radius: 2px;
    padding: 0px 4px 1px 4px;
  }
${condition} span.command-method > span {
    background-color: #1fa971;
    border-radius: 2px;
    padding: 0px 4px 1px 4px;
  }
${condition} span.command-method span {
    color: white;

  }
${condition_error} span.command-method > span {
    background-color: red;
    border-radius: 2px;
    padding: 0px 4px 1px 4px;
  }
${condition_error} span.command-method span {
    color: white;

  }
${description} span.command-message > span.command-message-text {
    color: gray;
    font-family: system-ui;
    font-size: 12px;
    }
${description} span.command-message > span.command-message-text em {
    color: #ffff00bd;

    }     
${env} {
      border-top: 1px solid #8080803b;
  }

${description}:hover span.command-message > span.command-message-text {
    color: white;
}
${condition}:hover span.command-message > span.command-message-text {
    color: white;
  }

// ${description}:hover span.command-message > span.command-message-text em {
//   color: yellow;
//   // font-weight: bold;
//   // font-size: 1.2em;
//   }



  ${alias} span.command-method > span,
  ${aliasWrite} span.command-method > span,
  ${aliasRead} span.command-method > span,
  ${env} span.command-method > span,
  ${schemas} span.command-method > span,
  ${mock} span.command-method > span{
      background-color: #ff6700eb;
      border-radius: 2px;
      padding: 0px 4px 1px 4px;
  }
  
  ${schemas} span.command-method > span {
      background-color: #9f00ffeb;
      border-radius: 2px;
      padding: 0px 4px 1px 4px;
  }
  ${env}:hover {
      border-top: 1px solid white;
  }
  ${alias} span.command-method > span{
      color: white;
  }
  ${log} span.command-method > span{
    color: white;
  }
  ${valid} span.command-method{
          background-color: red;
          border-radius: 2px;
          padding: 0px 4px 1px 4px;
  }

  ${valid} span.command-method > span{
    color: white;
  }

  .reporter .command-name-assert .command-state-passed .command-message strong {
  color: #fb8d04;
  }


  #unified-reporter > div > div > div.wrap > ul > li > div > div.collapsible-content.runnables-region > ul > li > div > div.collapsible-content.runnable-instruments > div > ul > li > div > div.collapsible-content.attempt-content > div > div > ul > li > div > div.collapsible-content > ul > li > div > span > div > span.command-info:hover ${valueColor}
  .reporter .command-name-assert .command-state-passed .command-method span {
      background-color: #1fa971;
      color: white;
  }   

  ${put}, ${post}, ${deletes}, ${patch}, ${wrap} {
    background-color: rgb(100 112 243 / 1);
  } 
  ${deletes} {
    background-color: rgb(100 112 243 / 1);
  } 
  ${wrap}{
      border-radius: 3px;
      padding: 1px 4px;
      color: white;
      }

  `;

  style.setAttribute("data-hover-black-crud", "");
  app.document.head.appendChild(style);
}

if (!app.document.head.querySelector("[data-hover-black-descit]")) {
  const style = app.document.createElement("style");
  let alias = `#unified-reporter > div > div > div.wrap > ul > li > div > div.collapsible-content.runnables-region > ul > li > div > div > div > div > span > span`;
  let title = `#unified-reporter > div > div > div.wrap > ul > li > div > div.collapsible-header-wrapper.runnable-wrapper > div > div`;
  let bar = `#unified-reporter > div > div > div.wrap > ul > li > div > div.collapsible-content.runnables-region > ul > li > div > div`;
  let backgroundStep = `#unified-reporter > div > div > div.wrap > ul > li > div > div.collapsible-content.runnables-region > ul > li > div > div.collapsible-content.runnable-instruments > div > ul > li > div > div.collapsible-content.attempt-content > div > div > ul > li > div > div.collapsible-content > ul > li > div`;
  style.innerHTML = `
  ${alias} {
    border-bottom: 0.5px solid #80808036;
  border-radius: 5px;
  margin: 2px;
  padding: 5px; 
  }
    ${alias}:hover {
    border-top: 1px solid white;
    border-bottom: 1px solid white;

  }

   ${alias} {
    color: white;
    font-size: 14px;
  letter-spacing: 1px;

   }

   ${title} span > span.runnable-title{
        color: white;
  font-size: 16px;
  letter-spacing: 2px;
   }
  ${title}:hover {
        border-bottom: 1px solid white;
        border-top: 2px solid white;

  border-radius: 5px;
  padding-bottom: 2px;
  }

   ${bar}:hover{
    border-left: 4px solid #2500ff;
   }
   ${backgroundStep} { background-color: #000000}
   ${backgroundStep}:hover {background-color: #140baa00}
  `;

  style.setAttribute("data-hover-black-desit", "");
  app.document.head.appendChild(style);
}

if (!app.document.head.querySelector("[data-hover-black-spec]")) {
  const style = app.document.createElement("style");
  let alias = `#resizable-panels-root > div.grow.h-full.bg-gray-100.relative`;
  let subTitle = `#unified-reporter > div > div > div.runnable-header`;
  let colapse = `#unified-reporter > div > div > div.wrap > ul > li > div`;
  let colapseOPen = `#unified-reporter > div > div > div.wrap > ul > li > div > div.collapsible-content.runnables-region > ul.runnables > li`;
  let headers = `#unified-reporter > div > header`;
  let container = `#unified-reporter > div > div`;
  let barReport = `#unified-reporter > div`;
  let top = `#spec-runner-header > div`;
  let header = `#spec-runner-header > div > div.border`;
  let overflow = `body > div.inner-container > div#api-plugin-root > div#api-view`;
  style.innerHTML = `
  ${alias}{
      background-color: black;
  }

  ${subTitle}, ${colapse}, ${colapseOPen}, ${headers}, ${container}, ${top} {
       background-color: black;
  }

  ${barReport}{
      border-right: 1px solid seagreen;
  }
   ${barReport}:hover{
      border-right: 1px solid white;
  }

   ${header}{display: none;}
   ${overflow} {
      overflow: hidden !important;
  }
  .bg-gray-1000 {
      background-color: black;
  }
 
  `;

  style.setAttribute("data-hover-black-spec", "");
  app.document.head.appendChild(style);
}

if (!app.document.head.querySelector("[data-hover-black-methods-info]")) {
  const style = app.document.createElement("style");
  const dataStyle = `#unified-reporter > div > div > div.wrap > ul > li > div > div.collapsible-content.runnables-region > ul > li > div > div.collapsible-content.runnable-instruments > div > ul > li > div > div.collapsible-content.attempt-content > div > div > ul > li > div > div.collapsible-content > ul`
  let get = `${dataStyle} li.command.command-name-GET`;
  let post = `${dataStyle} li.command.command-name-POST`;
  let put = `${dataStyle} li.command.command-name-PUT`;
  let wrap = `${dataStyle} li.command.command-name-wrap > div > span > div > span.command-info > span.command-method`;

  let deletes = `${dataStyle} li.command.command-name-DELETE`;
  let save = `${dataStyle} li.command.command-name-save`;
  let env = `${dataStyle} li.command.command-name-env`;
  let schemas = `${dataStyle} li.command.command-name-schemas`;
  let mock = `${dataStyle} li.command.command-name-mock`;

  let header = `#spec-runner-header > div > div.border`;
  let color = `div > span > div > span.command-info {background-color: rgb(100 112 243 / 1)}`;

  let change = `div > span > div > span.command-info > span.command-message > span.command-message-text { color: white;}`;
  style.innerHTML = `
  ${get}:hover ${change}
  ${post}:hover ${change}
  ${put}:hover ${change}
  ${deletes}:hover ${change}
   ${save}:hover ${change}
   ${env}:hover ${change}
   ${schemas}:hover ${change}
   ${mock}:hover ${change}
   ${wrap}:hover ${change}

   ${header}{display: none;}


   ${save}


   ${put} ${color}

  `;

  style.setAttribute("data-hover-black-methods-info", "");
  app.document.head.appendChild(style);
}

if (!app.document.head.querySelector("[data-hover-black-delete-before]")) {
  const style = app.document.createElement("style");
  let expectBefore = `${dataDefaultStyle} li.command.command-name-assert`;
  let envBefore = `${dataDefaultStyle} li.command.command-name-env`;
  let schemasBefore = `${dataDefaultStyle} li.command.command-name-schemas`;
  let mockBefore = `${dataDefaultStyle} li.command.command-name-mock`;
  let save = `${dataDefaultStyle} li.command.command-name-save`;

  let space = `#unified-runner`;
  let div = `div > span > div > span.command-info > span.command-method::before {content: '';}`;
  style.innerHTML = `
 ${expectBefore} ${div}
 ${envBefore} ${div}
 ${schemasBefore} ${div}
  ${mockBefore} ${div}
  ${save} ${div}
 ${space}{height: 100vh !important;}
  `;

  style.setAttribute("data-hover-black-delete-before", "");
  app.document.head.appendChild(style);
}

