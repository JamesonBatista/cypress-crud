module.exports = function applyStyles() {
  const app = window.top;
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
      : "🅲🆈🅿🆁🅴🆂🆂";
  }

  if (!app.document.head.querySelector("[data-hover-black-crud]")) {
    const style = app.document.createElement("style");
    let alias = `#unified-reporter > div > div > div.wrap > ul > li > div > div.collapsible-content.runnables-region > ul > li > div > div.collapsible-content.runnable-instruments > div > ul > li > div > div.collapsible-content.attempt-content > div > div > ul > li > div > div.collapsible-content > ul > li.command.command-name-save > div > span > div > span.command-info`;
    let log = `#unified-reporter > div > div > div.wrap > ul > li > div > div.collapsible-content.runnables-region > ul > li > div > div.collapsible-content.runnable-instruments > div > ul > li > div > div.collapsible-content.attempt-content > div > div > ul > li > div > div.collapsible-content > ul > li.command.command-name-log > div > span > div > span.command-info`;
    let aliasWrite = `#unified-reporter > div > div > div.wrap > ul > li > div > div.collapsible-content.runnables-region > ul > li > div > div.collapsible-content.runnable-instruments > div > ul > li > div > div.collapsible-content.attempt-content > div > div > ul > li > div > div.collapsible-content > ul > li.command.command-name-writeFile > div > span > div > span.command-info`;
    let aliasRead = `#unified-reporter > div > div > div.wrap > ul > li > div > div.collapsible-content.runnables-region > ul > li > div > div.collapsible-content.runnable-instruments > div > ul > li > div > div.collapsible-content.attempt-content > div > div > ul > li > div > div.collapsible-content > ul > li.command.command-name-readFile > div > span > div > span.command-info`;
    let valid = `#unified-reporter > div > div > div.wrap > ul > li > div > div.collapsible-content.runnables-region > ul > li > div > div.collapsible-content.runnable-instruments > div > ul > li > div > div.collapsible-content.attempt-content > div > div > ul > li > div > div.collapsible-content > ul > li.command.command-name-runValidation > div > span > div > span.command-info`;
    let env = `#unified-reporter > div > div > div.wrap > ul > li > div > div.collapsible-content.runnables-region > ul > li > div > div.collapsible-content.runnable-instruments > div > ul > li > div > div.collapsible-content.attempt-content > div > div > ul > li > div > div.collapsible-content > ul > li.command.command-name-env > div > span > div > span.command-info`;
    let schemas = `#unified-reporter > div > div > div.wrap > ul > li > div > div.collapsible-content.runnables-region > ul > li > div > div.collapsible-content.runnable-instruments > div > ul > li > div > div.collapsible-content.attempt-content > div > div > ul > li > div > div.collapsible-content > ul > li.command.command-name-schemas > div > span > div > span.command-info`;
    let mock = `#unified-reporter > div > div > div.wrap > ul > li > div > div.collapsible-content.runnables-region > ul > li > div > div.collapsible-content.runnable-instruments > div > ul > li > div > div.collapsible-content.attempt-content > div > div > ul > li > div > div.collapsible-content > ul > li.command.command-name-mock > div > span > div > span.command-info`;
    let valueColor = `span.command-message > span > strong {color: white;}`;
    let put = `#unified-reporter > div > div > div.wrap > ul > li > div > div.collapsible-content.runnables-region > ul > li > div > div.collapsible-content.runnable-instruments > div > ul > li > div > div.collapsible-content.attempt-content > div > div > ul > li > div > div.collapsible-content > ul > li.command.command-name-PUT > div > span > div > span.command-info > span.command-method`;
    let post = `#unified-reporter > div > div > div.wrap > ul > li > div > div.collapsible-content.runnables-region > ul > li > div > div.collapsible-content.runnable-instruments > div > ul > li > div > div.collapsible-content.attempt-content > div > div > ul > li > div > div.collapsible-content > ul > li.command.command-name-POST > div > span > div > span.command-info > span.command-method`;
    let deletes = `#unified-reporter > div > div > div.wrap > ul > li > div > div.collapsible-content.runnables-region > ul > li > div > div.collapsible-content.runnable-instruments > div > ul > li > div > div.collapsible-content.attempt-content > div > div > ul > li > div > div.collapsible-content > ul > li.command.command-name-DELETE > div > span > div > span.command-info > span.command-method`;
    let patch = `#unified-reporter > div > div > div.wrap > ul > li > div > div.collapsible-content.runnables-region > ul > li > div > div.collapsible-content.runnable-instruments > div > ul > li > div > div.collapsible-content.attempt-content > div > div > ul > li > div > div.collapsible-content > ul > li.command.command-name-PATCH > div > span > div > span.command-info > span.command-method`;

    style.innerHTML = `
    ${log} span.command-method > span {
      background-color: #675f5aeb;
      border-radius: 2px;
      padding: 0px 4px 1px 4px;
    }

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

    ${put}, ${post}, ${deletes}, ${patch} {
      background-color: rgb(100 112 243 / 1);
    } 
    ${deletes} {
      background-color: rgb(100 112 243 / 1);
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
    let backgroundStep = `#unified-reporter > div > div > div.wrap > ul > li > div > div.collapsible-content.runnables-region > ul > li > div > div.collapsible-content.runnable-instruments > div > ul > li > div > div.collapsible-content.attempt-content > div > div > ul > li > div > div.collapsible-content > ul > li > div`
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
    let get = `#unified-reporter > div > div > div.wrap > ul > li > div > div.collapsible-content.runnables-region > ul > li > div > div.collapsible-content.runnable-instruments > div > ul > li > div > div.collapsible-content.attempt-content > div > div > ul > li > div > div.collapsible-content > ul > li.command.command-name-GET`;
    let post = `#unified-reporter > div > div > div.wrap > ul > li > div > div.collapsible-content.runnables-region > ul > li > div > div.collapsible-content.runnable-instruments > div > ul > li > div > div.collapsible-content.attempt-content > div > div > ul > li > div > div.collapsible-content > ul > li.command.command-name-POST`;
    let put = `#unified-reporter > div > div > div.wrap > ul > li > div > div.collapsible-content.runnables-region > ul > li > div > div.collapsible-content.runnable-instruments > div > ul > li > div > div.collapsible-content.attempt-content > div > div > ul > li > div > div.collapsible-content > ul > li.command.command-name-PUT`;
    let deletes = `#unified-reporter > div > div > div.wrap > ul > li > div > div.collapsible-content.runnables-region > ul > li > div > div.collapsible-content.runnable-instruments > div > ul > li > div > div.collapsible-content.attempt-content > div > div > ul > li > div > div.collapsible-content > ul > li.command.command-name-DELETE`;
    let save = `#unified-reporter > div > div > div.wrap > ul > li > div > div.collapsible-content.runnables-region > ul > li > div > div.collapsible-content.runnable-instruments > div > ul > li > div > div.collapsible-content.attempt-content > div > div > ul > li > div > div.collapsible-content > ul > li.command.command-name-save`;
    let env = `#unified-reporter > div > div > div.wrap > ul > li > div > div.collapsible-content.runnables-region > ul > li > div > div.collapsible-content.runnable-instruments > div > ul > li > div > div.collapsible-content.attempt-content > div > div > ul > li > div > div.collapsible-content > ul > li.command.command-name-env`;
    let schemas = `#unified-reporter > div > div > div.wrap > ul > li > div > div.collapsible-content.runnables-region > ul > li > div > div.collapsible-content.runnable-instruments > div > ul > li > div > div.collapsible-content.attempt-content > div > div > ul > li > div > div.collapsible-content > ul > li.command.command-name-schemas`;
    let mock = `#unified-reporter > div > div > div.wrap > ul > li > div > div.collapsible-content.runnables-region > ul > li > div > div.collapsible-content.runnable-instruments > div > ul > li > div > div.collapsible-content.attempt-content > div > div > ul > li > div > div.collapsible-content > ul > li.command.command-name-mock`;

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

     ${header}{display: none;}


     ${save}


     ${put} ${color}

    `;

    style.setAttribute("data-hover-black-methods-info", "");
    app.document.head.appendChild(style);
  }

  if (!app.document.head.querySelector("[data-hover-black-delete-before]")) {
    const style = app.document.createElement("style");
    let expectBefore = `#unified-reporter > div > div > div.wrap > ul > li > div > div.collapsible-content.runnables-region > ul > li > div > div.collapsible-content.runnable-instruments > div > ul > li > div > div.collapsible-content.attempt-content > div > div > ul > li > div > div.collapsible-content > ul > li.command.command-name-assert`;
    let envBefore = `#unified-reporter > div > div > div.wrap > ul > li > div > div.collapsible-content.runnables-region > ul > li > div > div.collapsible-content.runnable-instruments > div > ul > li > div > div.collapsible-content.attempt-content > div > div > ul > li > div > div.collapsible-content > ul > li.command.command-name-env`;
    let schemasBefore = `#unified-reporter > div > div > div.wrap > ul > li > div > div.collapsible-content.runnables-region > ul > li > div > div.collapsible-content.runnable-instruments > div > ul > li > div > div.collapsible-content.attempt-content > div > div > ul > li > div > div.collapsible-content > ul > li.command.command-name-schemas`;
    let mockBefore = `#unified-reporter > div > div > div.wrap > ul > li > div > div.collapsible-content.runnables-region > ul > li > div > div.collapsible-content.runnable-instruments > div > ul > li > div > div.collapsible-content.attempt-content > div > div > ul > li > div > div.collapsible-content > ul > li.command.command-name-mock`;
    let save = `#unified-reporter > div > div > div.wrap > ul > li > div > div.collapsible-content.runnables-region > ul > li > div > div.collapsible-content.runnable-instruments > div > ul > li > div > div.collapsible-content.attempt-content > div > div > ul > li > div > div.collapsible-content > ul > li.command.command-name-save`;


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
};
