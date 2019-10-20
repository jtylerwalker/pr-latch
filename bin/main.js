#!/usr/bin/env node
const Prompts = require("../lib/prompts/prompts");
const program = require("commander");
const LatchEnv = require("../lib/init-env");
const { fetchPulls } = require("../lib/git-actions");
const { prGitFlow } = require("../lib/executor");
const env = require("../.latchrc.json");
const Spawner = require("../lib/spawner");

require("dotenv").config();

program.version("0.0.1");

/**
 * Commander: List env projects
 */
const listEnvs = () => Prompts.static.list(env.projects);
program
  .option("env, list", "list envs", listEnvs)
  .description("List current environments");

// TODO: delete envs
//const { ui, ...projects } = env.projects;
//console.warn(projects);

/**
 * Commander: Generate new env project
 */
const newEnv = () => {
  const init = new LatchEnv();

  env.mainDirectory
    ? init.promptForProjectSettings(env.mainDirectory)
    : init.promptForMainProjectDirectory();
};
program
  .option("env, new", "create new environment", newEnv)
  .description("Create a new environment");

/**
 * @param {String} alias
 * Commander: PR review flow for stipulated env
 */
const parseAlias = alias => {
  return new Promise(async (res, _) => {
    const { pull } = await fetchPulls(env.projects[`${alias}`].name).catch(
      err => console.warn(err)
    );

    await prGitFlow(pull.branch, env.projects[`${alias}`].directory);
    res();
  });
};
program
  .option("review, <string>", "project alias", parseAlias)
  .description("View PR's for project");

const pollForServerUp = spawn => {
  return new Promise(async (res, _) => {
    let isUp = false;

    while (!isUp) {
      isUp = await spawn.pingServer();
      isUp === true && res(spawn.serverUp(isUp));
    }
  });
};

/**
 * @param {String} alias
 * Commander: PR review flow for stipulated env
 */
const startEnvironment = alias => {
  const { port, directory, startCommand } = env.projects[`${alias}`];
  const projectFork = new Spawner(`${alias.toUpperCase()} up and ready`, port);

  return new Promise(async (res, _) => {
    projectFork.spawnAndSpin(
      `${startCommand[0]}`,
      startCommand.slice(1),
      directory
    );

    await pollForServerUp(projectFork);

    res({ hasLoaded: true });
  });
};

const envsUp = async aliases => {
  return Promise.all(aliases.map(async a => await startEnvironment(a))).then(
    () => process.exit(1)
  );
};

program
  .command("envup [aliases...]")
  .description("View PR's for project")
  .action(envsUp);

// TODO:
// env kill with aliases
// ex: latch env-kill [pids?]

program.parse(process.argv);
