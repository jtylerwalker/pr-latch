const { fetchPulls } = require("../lib/git-actions.js.js");
const { prGitFlow } = require("../lib/executor.js.js");
const env = require("../pr-latch.env.json");
const inquirer = require("inquirer");
const LatchEnv = require("../lib/init-env.js.js");
const Spawner = require("../lib/spawner.js.js");
require("dotenv").config();

const init = new LatchEnv();
const { HOME } = process.env;
const uiDir = `${env.projects.ui.projectDirectory}`;
const edgeDir = `${env.projects.edge.projectDirectory}`;

const autoReview = () => {
  return new Promise(async res => {
    const { pull } = await fetchPulls("discover.shared.ebsconext-ui").catch(
      err => console.warn(err)
    );

    await prGitFlow(pull.branch, uiDir);
    res();
  });
};

const pollForServerUp = spawn => {
  return new Promise(async (resolve, reject) => {
    let isUp = false;

    while (!isUp) {
      isUp = await spawn.pingServer();
      isUp === true && resolve(spawn.serverUp(isUp));
    }
  });
};

const generateEnvs = () => {
  const uiFork = new Spawner("Ui done loading", "3030");
  const edgeFork = new Spawner("Edge done loading", "8080");
  const authFork = new Spawner("Goggles done loading", "4040");

  return new Promise(async (resolve, reject) => {
    edgeFork.spawnAndSpin("npm", ["run", "dev"], edgeDir);
    await pollForServerUp(edgeFork);
    uiFork.spawnAndSpin("npm", ["run", "dev"], uiDir);
    await pollForServerUp(uiFork);
    authFork.spawnAndSpin(
      "npx",
      ["@ebsco/auth-goggles", "--config", `${HOME} /.auth - goggles.yaml`],
      `${HOME}`
    );
    await pollForServerUp(authFork);
    resolve();
  });
};

const initialize = async () => {
  console.clear();
  showTitleBar();
  await init.initializeProject();
  console.clear();
  showSegueBar();
  await autoReview();
  console.clear();
  showSegueBar();
};

const startLocalEnv = async () => {
  await generateEnvs();
  console.clear();
  showSegueBar();
};

setTimeoutCurl = count => {
  console.log(count);
  count >= 0 &&
    setTimeout(function() {
      setTimeoutCurl(count - 1);
      return console.log("hello");
    }, 2000);
};

const program = require("commander");
program.version("0.0.1");

program.parse(process.argv);
const [, , ...args] = process.argv;

if (args[0] == "new" && args[1] == "env") init.promptForProjectSettings();
if (program.debug) console.log(program.opts());
