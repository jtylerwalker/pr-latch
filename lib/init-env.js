const inquirer = require("inquirer");
const chalk = require("chalk");
const path = require("path");
const env = require("../pr-latch.env.json");
const { showAllLocalRepos } = require("./executor");
const fs = require("fs");

class InitEnv {
  constructor() {
    this.prompt = inquirer.createPromptModule();
    this._writeToEnvFile = this._writeToEnvFile.bind(this);

    this.configSettings = {
      mainDirectory: null,
      projects: {}
    };
  }

  _isDuplicateEnvVariable(varName) {
    require("dotenv").config();
    return process.env[`${varName}`] !== "undefined";
  }

  _writeToEnvFile() {
    const envPath = path.join(__dirname, "../pr-latch.env.json");
    fs.existsSync(envPath)
      ? fs.writeFile(
          envPath,
          JSON.stringify(this.configSettings),
          err => err && console.log(err)
        )
      : fs.appendFile(
          envPath,
          JSON.stringify(this.configSettings),
          err => err && console.log(err)
        );
  }

  handleAnswers(answers) {
    const {
      projectDirectory,
      projectPort,
      projectAlias,
      startCommand
    } = answers;
    const projects = {};
    projects[`${projectAlias}`] = {
      projectDirectory: `${this.configSettings.mainDirectory}/${projectDirectory}`,
      startCommand: startCommand.split(" "),
      projectPort: projectPort
    };

    this.configSettings.projects = Object.assign(
      {},
      this.configSettings.projects,
      projects
    );
    projects[`${projectAlias}`].concurrentProjects
      ? this.promptForProjectSettings(true, `${projectAlias}`)
      : this._writeToEnvFile();
  }

  _normalizeProjectValues(project) {
    return {
      name: `\
      ${chalk.bold("| " + project)}
      `,
      value: project
    };
  }

  async promptForProjectSettings(
    isConcurrentProject = false,
    parentProjectAlias
  ) {
    require("dotenv").config();
    const { CODE_DIRECTORY } = process.env;
    console.warn(process.env);
    const projectsRaw = await showAllLocalRepos(CODE_DIRECTORY);

    const projects = this._normalizeProjectValues(projectsRaw);

    // directory, alias, project dir, start command, port
    this.prompt([])
      .then(answers => {
        isConcurrentProject &&
          this.configSettings.projects[
            parentProjectAlias
          ].concurrentProjectsAliases.push(answers["projectAlias"]);
        this.handleAnswers(answers);
      })
      .catch(err => err && console.warn(err));
  }

  promptForMainProjectDirectory() {
    this.prompt([
      {
        type: "input",
        name: "mainDirectory",
        message: `  ${chalk.white.bold("Main Projects directory: ")}`
      }
    ]).then(async answer => {
      this.configSettings.mainDirectory = answer["mainDirectory"];
      await this.promptForProjectSettings();
    });
  }

  initializeProject() {
    const envPath = path.join(__dirname, "../pr-latch.env.json");
  }
}

module.exports = InitEnv;

const init = new InitEnv();
init.initializeProject();
