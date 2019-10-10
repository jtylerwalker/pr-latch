const inquirer = require('inquirer');
const { displayProjectValues, attachToProcess } = require("./cli-actions.js");
const { prGitFlow, showAllLocalRepos } = require("./executor.js");
const { fetchPulls } = require("./git-actions.js");
const Spawner = require("./spawner.js");
const env = require('../prussia.env.json');

require('dotenv').config();

const showTitleBar = () => {
	var ui = new inquirer.ui.BottomBar();

	ui.log.write(`\
	----------------------------------------\
	----------------------------------------\
	`);
	ui.log.write(`\
		___                          _        
	| _ \  _ _   _  _   ___  ___ (_)  __ _ 
	|  _/ | '_| | || | (_-< (_-< | | / _| |
	|_|   |_|    \\_,_| /__/ /__/ |_| \\__,_|
	`);
	ui.log.write(`\
	-----------------------------------------\
	-----------------------------------------\
	`);

	ui.updateBottomBar('new bottom bar content');
}

const { HOME } = process.env;

const uiFork = new Spawner("Ui done loading", "3030");
const edgeFork = new Spawner("Edge done loading", "8080");
const authFork = new Spawner("Goggles done loading", "4040");

const CODE_PATH = "example";
const uiDir = `${CODE_PATH}/`;
const edgeDir = `${CODE_PATH}/`;

const viewLocalProjects = async () => {
	let values = await showAllLocalRepos();
	return displayProjectValues(values.filter(Boolean));
}

const autoReview = async () => {
	const { project } = await viewLocalRepos();

	showTitleBar();

	const { pull } = await fetchPulls(project);

	await prGitFlow(pull.branch);
}

const pollForServerUp = spawn => {
	return new Promise(async (res) => {
		let isUp = false;

		while (!isUp) {
			isUp = await spawn.pingServer();
			isUp === true && res(spawn.serverUp(isUp));
		}
	})
}

const generateEnvs = async () => {
	edgeFork.spawnAndSpin('npm', ['run', 'dev'], edgeDir);
	await pollForServerUp(edgeFork);
	uiFork.spawnAndSpin('npm', ['run', 'dev'], uiDir);
	await pollForServerUp(uiFork);
	authFork.spawnAndSpin('npx', ['@ebsco/auth-goggles', '--config', `${HOME}/.auth-goggles.yaml`], `${HOME}`);
	await pollForServerUp(authFork);

	showTitleBar();
}

showTitleBar();
// generateEnvs();
