const inquirer = require("inquirer");
const chalk = require("chalk");
const path = require("path");
const env = require('../prussia.env.json');
const { showAllLocalRepos } = require("./executor");
const fs = require('fs');

class InitEnv {
  constructor() {
    this.prompt = inquirer.createPromptModule();
    this._writeToEnvFile = this._writeToEnvFile.bind(this);

    this.configSettings = {
      mainDirectory: null,
      projects: {},
    }
  }

  _isDuplicateEnvVariable(varName) {
    require('dotenv').config();
    return process.env[`${varName}`] !== 'undefined';
  }

  _writeToEnvFile() {
    const envPath = path.join(__dirname, '../prussia.env.json');
    fs.existsSync(envPath) ?
      fs.writeFile(envPath, JSON.stringify(this.configSettings), (err) => err && console.log(err)) :
      fs.appendFile(envPath, JSON.stringify(this.configSettings), (err) => err && console.log(err));
  }

  handleAnswers(answers) {
    const { projectDirectory, projectPort, projectAlias, additionalCommands, startCommand, concurrentProjects } = answers;
    const projects = {};
    projects[`${projectAlias}`] = {
      "projectDirectory": `${this.configSettings.mainDirectory}/${projectDirectory}`,
      startCommand: startCommand.split(" "),
      additionalCommands: additionalCommands.split(" "),
      projectPort: projectPort,
      concurrentProjects: concurrentProjects,
      concurrentProjectsAliases: []
    }

    this.configSettings.projects = Object.assign({}, this.configSettings.projects, projects);
    projects[`${projectAlias}`].concurrentProjects ? this.promptForProjectSettings(true, `${projectAlias}`) : this._writeToEnvFile();
  }

  _normalizeProjectValues(project) {
    return {
      name: `\
      ${chalk.bold("| " + project)}
      `,
      value: project
    }
  }

  async promptForProjectSettings(isConcurrentProject = false, parentProjectAlias) {
    require('dotenv').config();
    const { PROJECTS_DIRECTORY } = process.env
    const projectsRaw = await showAllLocalRepos(PROJECTS_DIRECTORY);

    const projects = this._normalizeProjectValues(projectsRaw);

    this.prompt([
      {
        type: 'list',
        name: 'projectDirectory',
        pageSize: 40,
        message: `  ${chalk.white.bold("Which project would you like to define?")}`,
        choices: projects.value
      },
      {
        type: 'input',
        name: 'projectAlias',
        pageSize: 40,
        message: `  ${chalk.white.bold("What is a good alias for this project? ")}`,
      },
      {
        type: 'input',
        name: 'startCommand',
        message: `  ${chalk.white.bold("Start command: ")}`,
      },
      {
        type: 'input',
        name: 'additionalCommands',
        message: `  ${chalk.white.bold("Additional commands to run: ")}`,
      },
      {
        type: 'input',
        name: 'projectPort',
        message: `  ${chalk.white.bold("What port does this project run on? ")}`,
      },
      {
        type: 'list',
        name: 'concurrentProjects',
        message: `  ${chalk.white.bold("Do you need to run a concurrent project? ")}`,
        message: !isConcurrentProject ?
          `  ${chalk.white.bold("Do you need to run a concurrent project: ")}` :
          `  ${chalk.white.bold("Are there other concurrent projects you'd like to run: ")}`,
        choices: [{ name: "Yes", value: true }, { name: "Nope", value: false }]
      },
    ])
      .then(answers => {
        isConcurrentProject && this.configSettings.projects[parentProjectAlias].concurrentProjectsAliases.push(answers["projectAlias"]);
        this.handleAnswers(answers);
      })
      .catch(err => err && console.warn(err));
  }

  promptForMainProjectDirectory() {
    this.prompt([
      {
        type: 'input',
        name: 'mainDirectory',
        message: `  ${chalk.white.bold("Main Projects directory: ")}`,
      }])
      .then(async (answer) => {
        this.configSettings.mainDirectory = answer["mainDirectory"]
        await this.promptForProjectSettings();
      });
  }

  initializeProject() {
    const envPath = path.join(__dirname, '../prussia.env.json');
    return fs.existsSync(envPath) ?
      this.prompt([
        {
          type: 'list',
          name: 'mainDirectory',
          message: `  ${chalk.white.bold("Main Projects directory: ")}`,
          choices: ["ui", "edge"]
        }]
      ) :
      this.promptForMainProjectDirectory();
  }
}

module.exports = InitEnv;
