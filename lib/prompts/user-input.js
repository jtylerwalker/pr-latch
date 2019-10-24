const chalk = require("chalk");

const userInput = (() => {
  const githubCreds = [
    {
      type: "input",
      name: "userName",
      pageSize: 40,
      message: `${chalk.white.bold("Github Username: ")}`
    },
    {
      type: "input",
      name: "token",
      pageSize: 40,
      message: `${chalk.white.bold("Personal Access Token: ")}`
    },
    {
      type: "input",
      name: "orgName",
      pageSize: 40,
      message: `${chalk.white.bold("Organization name: ")}`
    }
  ];

  const mainDirectory = [
    {
      type: "input",
      name: "mainDirectory",
      message: `${chalk.white.bold("Main Projects directory: ")}`
    }
  ];

  const newProject = projects => [
    {
      type: "list",
      name: "isProxy",
      message: `${chalk.white.bold("Is this a proxy or a project?")}`,
      choices: [
        { name: "project", value: false },
        { name: "proxy", value: true }
      ]
    },
    {
      type: "list",
      name: "directory",
      pageSize: 40,
      message: `${chalk.white.bold("Which project would you like to define?")}`,
      when: answers => !answers.isProxy,
      choices: projects.value
    },
    {
      type: "input",
      name: "alias",
      pageSize: 40,
      message: `${chalk.white.bold(
        "Alias for this project: "
      )} ${chalk.dim.white("e.g. latch env-up [ALIAS] ")}`
    },
    {
      type: "input",
      name: "startCommand",
      message: `${chalk.white.bold("Start command: ")}`
    },
    {
      type: "input",
      name: "port",
      message: `${chalk.white.bold("What port does this project run on? ")}`
    },
    {
      type: "input",
      name: "targetPort",
      pageSize: 40,
      message: `${chalk.white.bold("What is the target port? ")}`,
      when: answers => answers.isProxy
    },
    {
      type: "confirm",
      name: "anotherProject",
      message: "Would you like to add another project?",
      default: true
    }
  ];

  const listProjects = projects => [
    {
      type: "list",
      name: "project",
      pageSize: 40,
      message: `Select a project to view its open PR's...\n`,
      choices: projects
    }
  ];

  const selectPr = pulls => [
    {
      type: "list",
      name: "pull",
      pageSize: 40,
      message: `Select a PR to review... please, for the love of god. There are too many.\n`,
      choices: pulls
    }
  ];

  return { githubCreds, listProjects, mainDirectory, newProject, selectPr };
})();

module.exports = userInput;
