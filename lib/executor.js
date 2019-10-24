const chalk = require("chalk");
const ora = require("ora");
const Prompts = require("./prompts/prompts");
const util = require("util");
const exec = util.promisify(require("child_process").exec);

const Executor = (() => {
  const startSpinner = loadingText =>
    ora(` ${chalk.white.bold(loadingText)}`).start();

  const stopSpinnerAndShowCheck = (spinner, loadingText, err) =>
    err ? spinner.fail() : spinner.succeed(` ${chalk.white.bold(loadingText)}`);

  const executor = (action, workingDir, loadingText) =>
    exec(action, { cwd: `${workingDir}` })
      .then(({ stdout }) => ({ loadingText, stdout }))
      // .catch(stderr => Prompts.static.error(stderr.stderr));
      .catch(stderr => {
        Prompts.static.error(stderr.stderr);
        return stderr;
      });

  const getEnvPids = async (port, { mainDirectory }) =>
    executor(`lsof -ti :${port}`, mainDirectory, "");

  const stopActivePorts = async (ports, mainDirectory) => {
    const spinner = startSpinner("Stopping active ports...");
    const res = await executor(
      `kill ${ports.join(" ")}`,
      mainDirectory,
      "All ports are stopped"
    );

    stopSpinnerAndShowCheck(spinner, res.loadingText || res.stderr, res.stderr);
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
    const res = await executor(
      `cd ${codeDir}`,
      codeDir,
      `Changing working directory`
    );

    stopSpinnerAndShowCheck(spinner, res.loadingText || res.stderr, res.stderr);
  };

  const fetchAll = async codeDir => {
    const spinner = startSpinner("Fetching remote changes");
    const res = await executor(
      "git fetch --all",
      codeDir,
      `Checking current branch`
    );

    stopSpinnerAndShowCheck(spinner, res.loadingText || res.stderr, res.stderr);
  };

  const checkoutBranch = async (branch, codeDir) => {
    const spinner = startSpinner(`Checking ${branch}`);
    const res = await executor(
      `git checkout ${branch}`,
      codeDir,
      `Checking out ${branch}`
    );

    stopSpinnerAndShowCheck(spinner, res.loadingText || res.stderr, res.stderr);
  };

  const pullingBranchChanges = async (branch, codeDir) => {
    const spinner = startSpinner(`Pulling changes for ${branch}`);
    const res = await executor(
      `git pull`,
      codeDir,
      `Pulling changes for ${branch}`
    );

    stopSpinnerAndShowCheck(spinner, res.loadingText || res.stderr, res.stderr);
  };

  const openBrowser = async htmlUrl =>
    await executor(`open ${htmlUrl}`, "/", `Opening browser for ${htmlUrl}`);

  const openEditor = async codeDir =>
    await executor(`code ${codeDir}`, "/", `Opening Editor`);

  const prGitFlow = async ({ branch, htmlUrl }, codeDir) => {
    await switchToWorkingDir(codeDir);
    await fetchAll(codeDir);
    await checkoutBranch(branch, codeDir);
    await pullingBranchChanges(branch, codeDir);
    await openBrowser(htmlUrl);
    await openEditor(codeDir);

    process.exit(1);
  };

  return { getEnvPids, prGitFlow, showAllLocalRepos, stopActivePorts };
})();

module.exports = Executor;
