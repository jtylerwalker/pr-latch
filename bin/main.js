#!/usr/bin/env node
const Prompts = require("../lib/prompts/prompts");
const program = require("commander");
const LatchEnv = require("../lib/init-env");
const { fetchPulls } = require("../lib/git-actions");
const { getEnvPids, prGitFlow, stopActivePorts } = require("../lib/executor");
const env = require("../.latchrc.json");
const Spawner = require("../lib/spawner");

require("dotenv").config();

program.version("0.0.1");

/**
 * Commander: List env projects
 */
const listEnvs = () => Prompts.static.list(env.projects);

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

/**
 * Commander: Generate new env project
 */
const envNew = () => {
  const init = new LatchEnv();

  env.mainDirectory
    ? init.promptForProjectSettings(env.mainDirectory)
    : init.promptForMainProjectDirectory();
};

/**
 * start envs
 * @param {[String]} aliases
 */
const envsUp = aliases => {
  console.warn(aliases);
  const init = new LatchEnv();
  Promise.all(aliases.map(async a => await startEnvironment(a))).then(() =>
    process.exit(1)
  );
  init.aggregateEnvPids(aliases.map(a => env.projects[`${a}`].port));
};

/**
 * stop processes associated with running envs
 */
const envsDown = async () => {
  const init = new LatchEnv();
  return Promise.all(
    env.activePorts.map(async p => await getEnvPids(p, env))
  ).then(std => {
    const pids = std.reduce(
      (acc, { stdout }) => acc.concat(stdout.split("\n")).filter(Boolean),
      []
    );
    stopActivePorts(pids, env.mainDirectory);
    init.clearEnvPids();
  });
};

program.command("env-up [aliases...]").action(envsUp);
program.command("env-down").action(envsDown);
program.command("env-new").action(envNew);
program.command("list").action(listEnvs);
program.command("review <alias>").action(parseAlias);

program.parse(process.argv);
