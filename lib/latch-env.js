const { showAllLocalRepos } = require("./executor");
const chalk = require("chalk");
const fs = require("fs");
const inquirer = require("inquirer");
const path = require("path");
const Prompts = require("./prompts/prompts");

const LatchEnv = (() => {
  let env;
  const envPath = path.join(__dirname, "../.latchrc.json");

  /**
   *
   * On intial project load, there will be no latchrc
   * this asserts whether the file exists,
   * if it does, store the latchrc in the env var
   * else, populate the env variable with intial values
   *
   */
  if (fs.existsSync(envPath)) {
    env = require("../.latchrc.json");
  } else {
    env = {
      githubToken: null,
      githubApi: "https://github.api.com/repos/",
      githubUserName: null,
      mainDirectory: null,
      projects: {},
      activePorts: []
    };
  }

  const prompt = inquirer.createPromptModule();

  let configSettings = {
    githubToken: env.githubToken,
    githubApi: env.githubApi,
    githubUserName: env.githubUserName,
    mainDirectory: env.mainDirectory,
    projects: env.projects,
    activePorts: env.activePorts
  };

  const writeConfig = async content =>
    await fs.writeFileSync(
      envPath,
      JSON.stringify(content),
      err => err && console.log(err)
    );

  const writePids = activePortsVal =>
    env &&
    writeConfig(
      Object.assign({}, configSettings, { activePorts: activePortsVal })
    );

  const aggregateEnvPids = port =>
    !env.activePorts.includes(...port) &&
    writePids([].concat(env.activePorts || [], port));

  const clearEnvPids = () => writePids([]);

  const handleGithubCreds = ({ userName, token, orgName }) => {
    configSettings = Object.assign({}, configSettings, {
      githubToken: token,
      githubApi: `https://api.github.com/repos/${orgName}`,
      githubUserName: userName
    });

    return writeConfig(configSettings);
  };

  const handleProjects = ({ directory, port, alias, startCommand }) => {
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

    writeConfig(configSettings);
  };

  const _normalizeProjectValues = project => ({
    name: `\
    ${chalk.bold("| " + project)}
    `,
    value: project
  });

  const promptForProjectSettings = async mainDirectory => {
    const projectsRaw = await showAllLocalRepos(mainDirectory);
    const projects = _normalizeProjectValues(projectsRaw);

    prompt(Prompts.userInput.newProject(projects))
      .then(answers => handleProjects(answers))
      .catch(err => err && console.warn(err));
  };

  const promptForMainProjectDirectory = () => {
    prompt(Prompts.userInput.mainDirectory).then(async answer => {
      configSettings.mainDirectory = answer["mainDirectory"];
      await promptForProjectSettings(answer["mainDirectory"]);
    });
  };

  const promptForGithubCreds = () =>
    prompt(Prompts.userInput.githubCreds)
      .then(answers => handleGithubCreds(answers))
      .catch(err => err && console.warn(err));

  return {
    aggregateEnvPids,
    clearEnvPids,
    env,
    promptForMainProjectDirectory,
    promptForProjectSettings,
    promptForGithubCreds,
    writeConfig
  };
})();

module.exports = LatchEnv;
