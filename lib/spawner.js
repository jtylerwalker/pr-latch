const { spawn } = require("child_process");
const Notify = require("./notify");
const Spinnies = require("spinnies");
const util = require("util");
const exec = util.promisify(require("child_process").exec);

require("dotenv").config();

const Spawner = (() => {
  // TODO: get new animations from ora
  const spinner = new Spinnies();

  const osNotify = (alias, port) => {
    const notify = new Notify(
      `${alias} env has started`,
      `${alias} is up and running on localhost:${port}`,
      true
    );

    notify.init();
  };

  const serverUp = (connected, alias, successMessage, port) => {
    if (connected) {
      //TODO: change to alias instead of port
      spinner.succeed(`spinner-${alias}`, {
        text: `Hot diggity. ${successMessage}`,
        color: "greenBright",
        successColor: "greenBright"
      });
      osNotify(alias, port);

      return { serverUp: true };
    }
  };

  const pingServer = port => {
    return exec(`curl -c1 --max-time 1 http://localhost:${port}`)
      .then(_ => true)
      .catch(_ => false);
  };

  const spawnAndSpin = (action, opts, workingDir, alias) => {
    const spawnAction = spawn(action, opts, {
      cwd: `${workingDir}`,
      detached: true
    });

    spawnAction.stderr.on("data", data => data.toString());

    spawnAction.unref();

    spinner.add(`spinner-${alias}`, {
      text: `Firing up env for ${alias.toUpperCase()}`,
      color: "white"
    });
  };

  return { pingServer, serverUp, spawnAndSpin };
})();

module.exports = Spawner;
