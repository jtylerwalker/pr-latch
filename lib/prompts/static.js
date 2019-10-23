const inquirer = require("inquirer");
const chalk = require("chalk");

const static = (() => {
  const quotee = `${chalk.grey("Everyman Engineer")}`;

  const quotes = [
    "Yeet.",
    "Go forth and break something...",
    "God help us all.",
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
    lineBreak();
    console.log(
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
    lineBreak();
  };

  const segue = () => {
    lineBreak();
    console.log(`\n${chalk.white.bold(randomQuote())}`);
    lineBreak();
  };

  const list = projects => {
    if (projects && Object.keys(projects).length) {
      Object.keys(projects).forEach(k => {
        const project = projects[k];
        console.log(
          "\n" +
            chalk.bold.greenBright.underline(k.toUpperCase()) +
            "\n" +
            chalk.gray("  | Directory: ") +
            chalk.white(project.directory) +
            "\n" +
            chalk.gray("  | Start Command: ") +
            chalk.white(project.startCommand.join(" ")) +
            "\n" +
            chalk.gray("  | Port: ") +
            project.port +
            "\n"
        );
      });

      process.exit(1);
    } else {
      Prompts.static.segue();
      console.log(
        chalk.cyan.bold(
          "Looks like you have not created any projects yet." +
            "\n" +
            "Run 'latch new' to set up a new environment."
        )
      );

      process.exit(1);
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
    quotee,
    quotes,
    segue,
    title,
    separator
  };
})();

module.exports = static;
