const chalk = require("chalk");
const logSymbols = require("log-symbols");
const ora = require("ora");
const Prompts = require("./prompts/prompts");
const util = require("util");
const exec = util.promisify(require("child_process").exec);

require("dotenv").config();

const Executor = (() => {
  const stopSpinnerAndShowCheck = (spinner, loadingText, err) => {
    err ? spinner.fail() : spinner.succeed(` ${chalk.white.bold(loadingText)}`);
  };

  const startSpinner = loadingText =>
    ora(` ${chalk.white.bold(loadingText)}`).start();

  const executor = (action, workingDir, loadingText) => {
    return exec(action, { cwd: `${workingDir}` })
      .then(({ stdout }) => ({ loadingText, stdout }))
      .catch(stderr => Prompts.static.error(stderr.stderr));
  };

  const getEnvPids = async (port, { mainDirectory }) =>
    executor(`lsof -ti :${port}`, mainDirectory, "");

  const stopActivePorts = async (ports, mainDirectory) => {
    const spinner = startSpinner("Stopping active ports...");
    let { loadingText } = await executor(
      `kill ${ports.join(" ")}`,
      mainDirectory,
      "All ports are stopped"
    );

    stopSpinnerAndShowCheck(spinner, loadingText);
  };

  const showAllLocalRepos = async mainProjectDirectory => {
    let { stdout } = await executor(
      `ls ${mainProjectDirectory}`,
      mainProjectDirectory,
      "Which project would you like to check out?"
    );

    return stdout.split("\n");
  };

  const switchToWorkingDir = async codeDir => {
    const spinner = startSpinner("Changing working directory");
    let { loadingText } = await executor(
      `cd ${codeDir}`,
      codeDir,
      `Changing working directory`
    );

    stopSpinnerAndShowCheck(spinner, loadingText);
  };

  const fetchAll = async codeDir => {
    const spinner = startSpinner("Fetching remote changes");
    let { loadingText } = await executor(
      "git fetch --all",
      codeDir,
      `Checking current branch`
    );

    stopSpinnerAndShowCheck(spinner, loadingText);
  };

  const checkoutBranch = async (branch, codeDir) => {
    const spinner = startSpinner(`Checking ${branch}`);
    try {
      ({ loadingText } = await executor(
        `git checkout ${branch}`,
        codeDir,
        `Checking out ${branch}`
      ));
    } catch (err) {
      Prompts.static.gitCheckoutError();
      stopSpinnerAndShowCheck(spinner, "Could not checkout branch", true);
      process.exit(1);
    }

    stopSpinnerAndShowCheck(spinner, loadingText);
  };

  const pullingBranchChanges = async (branch, codeDir) => {
    const spinner = startSpinner(`Pulling changes for ${branch}`);
    ({ loadingText } = await executor(
      `git pull`,
      codeDir,
      `Pulling changes for ${branch}`
    ));

    stopSpinnerAndShowCheck(spinner, loadingText);
  };

  const openBrowser = async htmlUrl => {
    await executor(`open ${htmlUrl}`, "/", `Opening browser for ${htmlUrl}`);
  };

  const prGitFlow = async ({ branch, htmlUrl }, codeDir) => {
    await switchToWorkingDir(codeDir);
    await fetchAll(codeDir);
    await checkoutBranch(branch, codeDir);
    await pullingBranchChanges(branch, codeDir);
    await openBrowser(htmlUrl);

    process.exit(1);
  };
  return { getEnvPids, prGitFlow, showAllLocalRepos, stopActivePorts };
})();

module.exports = Executor;
