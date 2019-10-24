const LatchEnv = require("./latch-env");
const Prompts = require("./prompts/prompts");
const { fetchPulls } = require("./git-actions");
const { getEnvPids, prGitFlow, stopActivePorts } = require("./executor");

const Init = (() => {
  const { env } = LatchEnv;

  /**
   * Commander: Initialize github creds
   */
  const initializeEnv = () => LatchEnv.promptForGithubCreds();

  /**
   * Commander: List env projects
   */
  const listEnvs = () => Prompts.static.list(env.projects);

  /**
   * Commander: PR review flow for stipulated env
   * @param {String} alias
   */
  const startGitFlowFromAlias = alias => {
    return new Promise(async (res, _) => {
      const { pull } = await fetchPulls(env.projects[`${alias}`].name).catch(
        err => Prompts.static.error(err)
      );

      await prGitFlow(pull, env.projects[`${alias}`].directory);
      res();
    });
  };

  /**
   * Internal function: continually pings a server and succeeds when a successful
   * curl request is returned.
   * @param {Ref} spawn
   * @param {Int} port
   * @param {String} alias
   */
  const recursivePollForServerUp = (spawn, port, alias) => {
    return new Promise(async (res, _) => {
      const successMessage = `${alias.toUpperCase()} is up and ready`;
      let isUp = false;

      setTimeout(async () => {
        isUp = await spawn.pingServer(port);
        isUp === true
          ? res(spawn.serverUp(alias, successMessage, port))
          : recursivePollForServerUp(spawn, port, alias);
      }, 3000);
    });
  };

  /**
   * Commander: PR review flow for stipulated env
   * @param {String} alias
   */
  const startEnvironmentServer = alias => {
    const { port, directory, startCommand } = env.projects[`${alias}`];
    const projectSpawn = require("../lib/spawner");

    return new Promise(async (res, _) => {
      projectSpawn.spawnAndSpin(
        `${startCommand[0]}`,
        startCommand.slice(1),
        directory,
        alias
      );

      await recursivePollForServerUp(projectSpawn, port, alias);
      res({ hasLoaded: true });
    });
  };

  /**
   * Commander: Generate new env project
   */
  const envNew = () => {
    const {
      promptForMainProjectDirectory,
      promptForProjectSettings
    } = require("../lib/latch-env");

    env.mainDirectory
      ? promptForProjectSettings(env.mainDirectory)
      : promptForMainProjectDirectory();
  };

  /**
   * start envs
   * @param {[String]} aliases
   */
  const envsUp = aliases => {
    const { aggregateEnvPids } = require("../lib/latch-env");
    Promise.all(aliases.map(async a => await startEnvironmentServer(a))).then(
      () => process.exit(1)
    );

    aggregateEnvPids(aliases.map(a => env.projects[`${a}`].port));
  };

  /**
   * stop processes associated with running envs
   */
  const envsDown = async () => {
    const { clearEnvPids } = require("../lib/latch-env");

    return Promise.all(env.activePorts.map(async p => await getEnvPids(p, env)))
      .then(std => {
        const pids = std.reduce(
          (acc, { stdout }) => acc.concat(stdout.split("\n")).filter(Boolean),
          []
        );

        stopActivePorts(pids, env.mainDirectory);
        clearEnvPids();
      })
      .catch(err => {
        Prompts.static.error(err);
      });
  };

  return {
    initializeEnv,
    listEnvs,
    envNew,
    envsUp,
    envsDown,
    startGitFlowFromAlias
  };
})();

module.exports = Init;
