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
    // Criar e inserir o elemento de estilo

    const style = app.document.createElement("style");
    let alias = `#unified-reporter > div > div > div.wrap > ul > li > div > div.collapsible-content.runnables-region > ul > li > div > div.collapsible-content.runnable-instruments > div > ul > li > div > div.collapsible-content.attempt-content > div > div > ul > li > div > div.collapsible-content > ul > li.command.command-name-save > div > span > div > span.command-info`;
    let aliasWrite = `#unified-reporter > div > div > div.wrap > ul > li > div > div.collapsible-content.runnables-region > ul > li > div > div.collapsible-content.runnable-instruments > div > ul > li > div > div.collapsible-content.attempt-content > div > div > ul > li > div > div.collapsible-content > ul > li.command.command-name-writeFile > div > span > div > span.command-info`;
    let aliasRead = `#unified-reporter > div > div > div.wrap > ul > li > div > div.collapsible-content.runnables-region > ul > li > div > div.collapsible-content.runnable-instruments > div > ul > li > div > div.collapsible-content.attempt-content > div > div > ul > li > div > div.collapsible-content > ul > li.command.command-name-readFile > div > span > div > span.command-info`;
    let valid = `#unified-reporter > div > div > div.wrap > ul > li > div > div.collapsible-content.runnables-region > ul > li > div > div.collapsible-content.runnable-instruments > div > ul > li > div > div.collapsible-content.attempt-content > div > div > ul > li > div > div.collapsible-content > ul > li.command.command-name-runValidation > div > span > div > span.command-info`;
    let env = `#unified-reporter > div > div > div.wrap > ul > li > div > div.collapsible-content.runnables-region > ul > li > div > div.collapsible-content.runnable-instruments > div > ul > li > div > div.collapsible-content.attempt-content > div > div > ul > li > div > div.collapsible-content > ul > li.command.command-name-env > div > span > div > span.command-info`;

    style.innerHTML = `
    ${alias} span.command-method > span, ${aliasWrite} span.command-method > span, ${aliasRead} span.command-method > span, ${env} span.command-method > span{
        background-color: #ff6700eb;
        border-radius: 2px;
        padding: 0px 4px 1px 4px;
    }
 ${alias} span.command-method{
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
    `;

    style.setAttribute("data-hover-black-crud", "");
    app.document.head.appendChild(style);
  }

  if (!app.document.head.querySelector("[data-hover-black-descit]")) {
    // Criar e inserir o elemento de estilo

    const style = app.document.createElement("style");
    let alias = `#unified-reporter > div > div > div.wrap > ul > li > div > div.collapsible-content.runnables-region > ul > li > div > div > div > div > span > span`;
    let title = `#unified-reporter > div > div > div.wrap > ul > li > div > div.collapsible-header-wrapper.runnable-wrapper > div > div`;
    let bar = `#unified-reporter > div > div > div.wrap > ul > li > div > div.collapsible-content.runnables-region > ul > li > div > div`;
    style.innerHTML = `
    ${alias} {
      border-bottom: 0.5px solid gray;
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

    `;

    style.setAttribute("data-hover-black-desit", "");
    app.document.head.appendChild(style);
  }

  if (!app.document.head.querySelector("[data-hover-black-spec]")) {
    // Criar e inserir o elemento de estilo

    const style = app.document.createElement("style");
    let alias = `#resizable-panels-root > div.grow.h-full.bg-gray-100.relative`;
    let subTitle = `#unified-reporter > div > div > div.runnable-header`;
    let colapse = `#unified-reporter > div > div > div.wrap > ul > li > div`;
    let colapseOPen = `#unified-reporter > div > div > div.wrap > ul > li > div > div.collapsible-content.runnables-region > ul.runnables > li`;
    let header = `#unified-reporter > div > header`;
    let container = `#unified-reporter > div > div`;
    let barReport = `#unified-reporter > div`;
    let top = `#spec-runner-header > div`;

    style.innerHTML = `
    ${alias}{
        background-color: rgb(27 30 46 / 1);
    }

    ${subTitle}, ${colapse}, ${colapseOPen}, ${header}, ${container}, ${top} {
         background-color: rgb(27 30 46 / 1);
    }

    ${barReport}{
        border-right: 1px solid seagreen;
    }
     ${barReport}:hover{
        border-right: 1px solid white;
    }
    `;

    style.setAttribute("data-hover-black-spec", "");
    app.document.head.appendChild(style);
  }
};
