const { spawn } = require("child_process");
const chalk = require("chalk");
const Notify = require("./notify");
const ora = require("ora");
const util = require("util");
const exec = util.promisify(require("child_process").exec);

require("dotenv").config();

const Spawner = (() => {
  const spinner = ora({
    prefixText: chalk.cyan.bold("	PRs are like a box of chocolates..."),
    spinner: "grenade"
  });

  const osNotify = port => {
    const notify = new Notify(
      "Local endpoint is ready",
      `Port ${port} is up and ready`,
      true
    );

    notify.init();
  };

  const serverUp = (connected, port, loadedText) => {
    if (connected) {
      spinner.succeed(loadedText);
      spinner.clear();
      osNotify(port);

      return { serverUp: true };
    }
  };

  const pingServer = port => {
    return exec(`curl -c1 --max-time 1 http://localhost:${port}`)
      .then(_ => true)
      .catch(_ => false);
  };

  const spawnAndSpin = (action, opts, workingDir) => {
    const spawnAction = spawn(action, opts, {
      cwd: `${workingDir}`,
      detached: true
    });

    spawnAction.stderr.on("data", data => console.log(data.toString()));

    spawnAction.unref();

    spinner.start();
  };

  return { pingServer, serverUp, spawnAndSpin };
})();

module.exports = Spawner;
