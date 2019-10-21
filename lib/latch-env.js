const { showAllLocalRepos } = require("./executor");
const chalk = require("chalk");
const fs = require("fs");
const inquirer = require("inquirer");
const path = require("path");
const Prompts = require("./prompts/prompts");

const LatchEnv = (() => {
  const env = require("../.latchrc.json");
  const prompt = inquirer.createPromptModule();

  let configSettings = {
    mainDirectory: env.mainDirectory || null,
    projects: env.projects || {},
    activePorts: env.activePorts || []
  };

  const _writePids = activePortsVal => {
    const envPath = path.join(__dirname, "../.latchrc.json");

    env &&
      fs.existsSync(envPath) &&
      fs.writeFile(
        envPath,
        JSON.stringify(Object.assign({}, env, { activePorts: activePortsVal })),
        err => err && console.log(err)
      );
  };

  const aggregateEnvPids = port => {
    return _writePids([].concat(env.activePorts || [], port));
  };

  const clearEnvPids = () => {
    return _writePids([]);
  };

  const _writeToEnvFile = () => {
    const envPath = path.join(__dirname, "../.latchrc.json");

    fs.existsSync(envPath)
      ? fs.writeFile(
          envPath,
          JSON.stringify(configSettings),
          err => err && console.log(err)
        )
      : fs.appendFile(
          envPath,
          JSON.stringify(configSettings),
          err => err && console.log(err)
        );
  };

  const handleAnswers = answers => {
    const { directory, port, alias, startCommand } = answers;
    const projects = {};

    projects[`${alias}`] = {
      directory: `${configSettings.mainDirectory}/${directory}`,
      name: `${directory}`,
      startCommand: startCommand.split(" "),
      port: port
    };

    configSettings.projects = Object.assign(
      {},
      configSettings.projects,
      projects
    );

    projects[`${alias}`].concurrentProjects
      ? promptForProjectSettings(true, `${alias}`)
      : _writeToEnvFile();
  };

  const _normalizeProjectValues = project => {
    return {
      name: `\
    ${chalk.bold("| " + project)}
    `,
      value: project
    };
  };

  const promptForProjectSettings = async mainDirectory => {
    const projectsRaw = await showAllLocalRepos(mainDirectory);
    const projects = _normalizeProjectValues(projectsRaw);

    prompt(Prompts.userInput.newProject(projects))
      .then(answers => handleAnswers(answers))
      .catch(err => err && console.warn(err));
  };

  const promptForMainProjectDirectory = () => {
    prompt([
      {
        type: "input",
        name: "mainDirectory",
        message: `  ${chalk.white.bold("Main Projects directory: ")}`
      }
    ]).then(async answer => {
      configSettings.mainDirectory = answer["mainDirectory"];
      await promptForProjectSettings(answer["mainDirectory"]);
    });
  };

  return {
    aggregateEnvPids,
    clearEnvPids,
    promptForMainProjectDirectory,
    promptForProjectSettings
  };
})();

module.exports = LatchEnv;
