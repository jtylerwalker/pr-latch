const inquirer = require("inquirer");
const { prGitFlow } = require("./executor.js");
const { fetchPulls } = require("./git-actions.js");
const Spawner = require("./spawner.js");
const InitEnv = require("./init-env.js");
const env = require("../pr-latch.env.json");

require("dotenv").config();

const showTitleBar = () => {
  var ui = new inquirer.ui.BottomBar();

  ui.log.write(
    `----------------------------------------` +
    `----------------------------------------`
  );
  ui.log.write(`\
		___                          _
	| _ \  _ _   _  _   ___  ___(_)  __ _
	| _ / | '_| | || | (_-< (_-< | | / _| |
	| _ |   | _ |    \\_, _ | /__/ / __ / | _ | \\__, _ |
`);
  ui.log.write(
    "\
	-----------------------------------------\
	-----------------------------------------\
	"
  );

  ui.updateBottomBar("new bottom bar content");
};

const showSegueBar = () => {
  var ui = new inquirer.ui.BottomBar();

  ui.log.write(
    "\
	----------------------------------------\
	----------------------------------------\
	"
  );
  ui.log.write(`\
		"Go forth and break something... " - Cy
			`);
  ui.log.write(
    "\
	-----------------------------------------\
	-----------------------------------------\
	"
  );

  ui.updateBottomBar("new bottom bar content");
};

const init = new InitEnv();
const { HOME } = process.env;
const uiDir = `${env.projects.ui.projectDirectory}`;
const edgeDir = `${env.projects.edge.projectDirectory}`;

const autoReview = () => {
  return new Promise(async res => {
    const project = env.projects.ui.projectDirectory;
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
  await generateEnvs();
  console.clear();
  showSegueBar();
};

initialize();
