const chalk = require("./chalk");
const inquirer = require("./inquirer");

const userInput = (() => {
  const project = [
    {
      type: "list",
      name: "projectDirectory",
      pageSize: 40,
      message: `  ${chalk.white.bold(
        "Which project would you like to define?"
      )}`,
      choices: projects.value
    },
    {
      type: "input",
      name: "projectAlias",
      pageSize: 40,
      message: `  ${chalk.white.bold(
        "What is a good alias for this project? "
      )}`
    },
    {
      type: "input",
      name: "startCommand",
      message: `  ${chalk.white.bold("Start command: ")}`
    },
    {
      type: "input",
      name: "projectPort",
      message: `  ${chalk.white.bold("What port does this project run on? ")}`
    }
  ];

  const mainDirectory = [
    {
      type: "list",
      name: "mainDirectory",
      message: `  ${chalk.white.bold("Main Projects directory: ")}`,
      choices: ["ui", "edge"]
    }
  ];

  const listProjects = [
    {
      type: "list",
      name: "project",
      pageSize: 40,
      message: `Select a project to view its open PR's...\n`,
      choices: projects.map(normalizeProject)
    }
  ];
})();

module.exports = userInput;
