const inquirer = require("inquirer");
const chalk = require("chalk");

const static = (() => {
  const quotee = `${chalk.grey("Everyman Engineer")}`;

  const quotes = [
    "Go forth and break something...",
    "God help us all.",
    "Yeet.",
    "*sigh*.",
    "I deal with 5 year olds at home; I deal with five year olds at work.",
    "Who hurt you, Code Base?",
    "I'm going to show my screen now. *shows screen*",
    "This implementation is so dirty I'll need a shower afterwards.",
    "Yeh, I wrote the tests... first?"
  ];

  const formattedPull = pull => `\
 ${chalk.bold.underline(pull.title)}
 ${chalk.gray("| Owner")}: ${chalk.white.bold(pull.user.login)}
 ${chalk.gray("| State")}: ${chalk.white(pull.state)}
 ${chalk.gray("|")} ${pull.labels &&
    pull.labels.map(label => chalk.red.bold(label.name))}
	`;

  const randomQuote = () =>
    `${quotes[Math.floor(Math.random() * quotes.length)]} - ${quotee}`;

  const lineBreak = () => console.log(`\n`);

  const separator = () =>
    console.log(
      chalk.grey.bold("{ :   :   :   :   :   :   :   :   :   :   : }")
    );

  const title = () => {
    let ui = new inquirer.ui.BottomBar();
    separator();
    ui.log.write(
      chalk.redBright(`
                m          o         8      
                m          8         8      
 .oPYo. oPYo.   m .oPYo.  o8P .oPYo. 8oPYo. 
 8    8 8  ''   m .oooo8   8  8      8    8 
 8    8 8       m 8    8   8  8.     8    8
 8YooP' 8       m 'YooP8   8  'YooP' 8    8 
 8 ....:..::::::..: .....:::..:: .....:..:::
 8 :::::::::::::::::::::::::::::::::::::::::
 ..:::::::::::::::::::::::::::::::::::::::::\
      `)
    );
    separator();
  };

  const segue = () => {
    let ui = new inquirer.ui.BottomBar();

    separator();
    ui.log.write(`\n${chalk.white.bold(randomQuote())}`);
    separator();
  };

  const list = projects => {
    try {
      separator();
      Object.keys(projects).forEach(k => console.log(`\ ${k} `));
      separator();
    } catch (e) {
      console.log(`\
        Looks like you have not created any projects yet.
        Run 'latch new' to set up a new environment. 
      `);
    }
  };

  const error = errorText => {
    lineBreak();
    console.log(`\n${chalk.redBright(errorText)}`);
    lineBreak();
  };

  const gitCheckoutError = () => {
    console.log(chalk.white.bold(`Whoa there, Leeroy Jenkins!`));
    console.log(
      chalk.white(
        "Looks like you have some changes that will be overwritten by git checkout.\n" +
          "Reviewing others code is exciting, but charity starts at home."
      )
    );
  };

  return {
    error,
    formattedPull,
    gitCheckoutError,
    lineBreak,
    list,
    segue,
    title,
    separator
  };
})();

module.exports = static;
