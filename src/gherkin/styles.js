module.exports = function gherkinStyles() {
  const app = window.top;
  let colorBDD = Cypress.env("styles") ? Cypress.env("styles") : "#7fff0065";
  if (!app.document.head.querySelector("[data-hover-black-cucumber]")) {
    // Criar e inserir o elemento de estilo

    const style = app.document.createElement("style");
    let scenarioSelector = `#unified-reporter > div > div > div.wrap > ul > li > div > div > div > div.collapsible-header-inner`;
    let bdd = `#unified-reporter > div > div > div.wrap > ul > li > div > div.collapsible-content.runnables-region > ul > li > div > div > div > div.collapsible-header-inner`;
    let bddFailed = `#unified-reporter > div > div > div.wrap > ul > li > div > div.collapsible-content.runnables-region > ul > li.test.runnable.runnable-failed `;
    //

    style.innerHTML = `
     ${scenarioSelector} {
      background-color:${
        colorBDD.background ? colorBDD.background : "#7fff0065"
      };
      border-radius: 10px;
      margin: 10px;
      }
 
      ${bdd}{
        background-color:  ${
          colorBDD.background ? colorBDD.background : "#7fff0065"
        };
        border-radius: 10px;
        margin: 5px;
      }

      ${bdd} > span > span > span{
        color:${colorBDD.text ? colorBDD.text : "white"};
        font-weight: bold;
        letter-spacing: 1px;
      }
${scenarioSelector}:hover, ${bdd}:hover {
  background: linear-gradient(to right, white, ${
    colorBDD.background ? colorBDD.background : "#000"
  } );
  box-shadow: 0px 4px 8px rgba(128, 128, 128, 0.2);
  animation: gradientAnimation 2s ease-in-out infinite;
  background-size: 200% 200%;
}

@keyframes gradientAnimation {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
      ${scenarioSelector} span > span.runnable-title{
        color: ${colorBDD.text ? colorBDD.text : "white"};
        font-weight: bold;
        letter-spacing: 1px;
      }

    ${scenarioSelector}:hover span > span.runnable-title, 
${bdd}:hover > span > span > span {
  letter-spacing: 2px;
}

      ${bddFailed} > div > div > div > div.collapsible-header-inner{
        background-color: #ff000029;
      }

    `;

    style.setAttribute("data-hover-black-cucumber", "");
    app.document.head.appendChild(style);
  }
};
