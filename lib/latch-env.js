const { showAllLocalRepos } = require("./executor");
const chalk = require("chalk");
const fs = require("fs");
const inquirer = require("inquirer");
const path = require("path");
const Prompts = require("./prompts/prompts");

const LatchEnv = (() => {
  let env;
  const envPath = path.join(__dirname, "../.latchrc.json");

  if (fs.existsSync(envPath)) {
    env = require("../.latchrc.json");
  } else {
    env = {
      githubToken: null,
      githubApi: "https://github.api.com",
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

  const writeRc = async content =>
    await fs.writeFileSync(envPath, content, err => err && console.log(err));

  const writePids = activePortsVal => {
    env &&
      writeRc(
        JSON.stringify(Object.assign({}, env, { activePorts: activePortsVal }))
      );
  };

  const writeConfig = () => writeRc(JSON.stringify(configSettings));

  const aggregateEnvPids = port =>
    writePids([].concat(env.activePorts || [], port));

  const clearEnvPids = () => writePids([]);

  const handleGithubCreds = ({ userName, token, orgName }) => {
    configSettings = Object.assign(
      {},
      {
        githubToken: token,
        githubApi: `https://api.github.com/repos/${orgName}`,
        githubUserName: userName
      },
      configSettings
    );

    return writeConfig();
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

    writeConfig();
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
