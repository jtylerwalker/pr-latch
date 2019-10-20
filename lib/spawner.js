const { spawn } = require("child_process");
const Notify = require("./notify");
const Spinnies = require("spinnies");
const util = require("util");
const exec = util.promisify(require("child_process").exec);

require("dotenv").config();

const Spawner = (() => {
  // const spinnieStyle = { interval: 80, frames: ["🍇", "🍈", "🍉", "🍋"] };
  const spinner = new Spinnies();
  // const spinner = ora({
  //   prefixText: chalk.cyan.bold("	PRs are like a box of chocolates..."),
  //   spinner: "arrow3"
  // });

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
      spinner.succeed(`spinner-${port}`, {
        text: "Success!",
        color: "greenBright",
        successColor: "greenBright"
      });
      osNotify(port);

      return { serverUp: true };
    }
  };

  const pingServer = port => {
    return exec(`curl -c1 --max-time 1 http://localhost:${port}`)
      .then(_ => true)
      .catch(_ => false);
  };

  const spawnAndSpin = (action, opts, workingDir, port) => {
    const spawnAction = spawn(action, opts, {
      cwd: `${workingDir}`,
      detached: true
    });

    spawnAction.stderr.on("data", data => data.toString());

    spawnAction.unref();

    spinner.add(`spinner-${port}`, {
      text: "Hello! I am the initial text",
      color: "white"
    });
  };

  return { pingServer, serverUp, spawnAndSpin };
})();

module.exports = Spawner;
