const inquirer = require("inquirer");
const chalk = require("chalk");

const static = (() => {
  const quotee = `${chalk.grey("just another tech employee")}`;
  const quotes = [
    `"Go forth and break something..." - ${quotee}`,
    `"Right on." - ${quotee}`,
    `"Go with your heart on the implementation." - ${quotee}`,
    `"God help us all." - ${quotee}`,
    `"Yeet." - ${quotee}`,
    `"*sigh*." - ${quotee}`,
    `"I deal with 5 year olds at home; I deal with five year olds at work." - ${quotee}`,
    `"Who hurt you, Codebase?" - ${quotee}`,
    `"I'm going to show my screen now. *shows screen*" - ${quotee}`
  ];

  const randomQuote = () => quotes[Math.floor(Math.random() * quotes.length)];

  const title = () => {
    let ui = new inquirer.ui.BottomBar();

    ui.log.write(
      `${chalk.whiteBright.dim(
        " ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::"
      )}`
    );
    ui.log.write(
      chalk.greenBright(
        ".%%%%%...%%%%%........%%.......%%%%...%%%%%%...%%%%...%%..%%.\n" +
          ".%%..%%..%%..%%.......%%......%%..%%....%%....%%..%%..%%..%%.\n" +
          ".%%%%%...%%%%%...%%%..%%......%%%%%%....%%....%%......%%%%%%.\n" +
          ".%%......%%..%%.......%%......%%..%%....%%....%%..%%..%%..%%.\n" +
          ".%%......%%..%%.......%%%%%%..%%..%%....%%.....%%%%...%%..%%."
      )
    );
    ui.log.write(
      `${chalk.whiteBright.dim(
        " ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::"
      )}`
    );
  };

  const segue = () => {
    let ui = new inquirer.ui.BottomBar();

    ui.log.write(`\
      ${chalk.grey("==========================")}
    \
    `);
    ui.log.write(`\
      ${chalk.white.bold(randomQuote())}
    `);
    ui.log.write(`\
      ${chalk.grey("==========================")}
    \
    `);
  };

  const list = projects => {
    try {
      Object.keys(projects).forEach(k => console.log(`\ ${k} `));
    } catch (e) {
      console.log(`\
        Looks like you have not created any projects yet.
        Run 'latch new' to set up a new environment. 
      `);
    }
  };

  return { list, segue, title };
})();

module.exports = static;
