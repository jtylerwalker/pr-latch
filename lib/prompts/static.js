const chalk = require("chalk");
const inquirer = require("inquirer");

const static = (() => {
  const quotes = [
    `"Go forth and break something..." - Cy`,
    `"Right on." - Houston`,
    `"Go with your heart" - Design`,
    `"God help us all" - Danila`,
    `"Yeet" - Owen`,
    `"*sigh*" - Justin`,
    `"I deal with 5 year olds at home; I deal with five year olds at work." - Elliot`
  ];

  const randomQuote = () => Math.floor(Math.random() * quotes.length);

  const title = () => {
    let ui = new inquirer.ui.BottomBar();

    ui.log.write(
      `----------------------------------------` +
        `----------------------------------------`
    );
    ui.log.write(`\
    #        ##   #####  ####  #    # 
    #       #  #    #   #    # #    # 
    #      #    #   #   #      ###### 
    #      ######   #   #      #    # 
    #      #    #   #   #    # #    # 
    ###### #    #   #    ####  #    # 
  `);
    ui.log.write(
      "\
    -----------------------------------------\
    -----------------------------------------\
    "
    );
  };

  const segue = () => {
    let ui = new inquirer.ui.BottomBar();

    ui.log.write(
      "\
    ----------------------------------------\
    ----------------------------------------\
    "
    );
    ui.log.write(`\
      ${randomQuote()}
    `);
    ui.log.write(
      "\
    -----------------------------------------\
    -----------------------------------------\
    "
    );
  };

  const list = arr => {
    try {
      arr.forEach(a => console.log(`\ ${a} `));
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
