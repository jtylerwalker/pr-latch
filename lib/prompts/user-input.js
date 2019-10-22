const chalk = require("chalk");

const userInput = (() => {
  const newProject = projects => [
    {
      type: "list",
      name: "directory",
      pageSize: 40,
      message: `${chalk.white.bold("Which project would you like to define?")}`,
      choices: projects.value
    },
    {
      type: "input",
      name: "alias",
      pageSize: 40,
      message: `${chalk.white.bold("What is a good alias for this project? ")}`
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
    }
  ];

  const mainDirectory = [
    {
      type: "input",
      name: "mainDirectory",
      message: `${chalk.white.bold("Main Projects directory: ")}`
    }
  ];

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

  const listProjects = projects => [
    {
      type: "list",
      name: "project",
      pageSize: 40,
      message: `Select a project to view its open PR's...\n`,
      choices: projects
    }
  ];

  return { githubCreds, listProjects, mainDirectory, newProject };
})();

module.exports = userInput;
