const inquirer = require("inquirer");
const chalk = require("chalk");
const path = require("path");
const Prompts = require("./prompts/prompts");
const { showAllLocalRepos } = require("./executor");
const fs = require("fs");

class LatchEnv {
  constructor() {
    this.prompt = inquirer.createPromptModule();
    this._writeToEnvFile = this._writeToEnvFile.bind(this);
    this.env = require("../.latchrc.json");

    this.configSettings = {
      mainDirectory: this.env.mainDirectory || null,
      projects: this.env.projects || {}
    };
  }

  _writeToEnvFile() {
    const envPath = path.join(__dirname, "../.latchrc.json");

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
    const { directory, port, alias, startCommand } = answers;
    const projects = {};

    projects[`${alias}`] = {
      directory: `${this.configSettings.mainDirectory}/${directory}`,
      name: `${directory}`,
      startCommand: startCommand.split(" "),
      port: port
    };

    this.configSettings.projects = Object.assign(
      {},
      this.configSettings.projects,
      projects
    );

    projects[`${alias}`].concurrentProjects
      ? this.promptForProjectSettings(true, `${alias}`)
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

  async promptForProjectSettings(mainDirectory) {
    const projectsRaw = await showAllLocalRepos(mainDirectory);
    const projects = this._normalizeProjectValues(projectsRaw);

    this.prompt(Prompts.userInput.newProject(projects))
      .then(answers => this.handleAnswers(answers))
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
      await this.promptForProjectSettings(answer["mainDirectory"]);
    });
  }
}

module.exports = LatchEnv;
