const path = require("path")
const chalk = require('chalk');
const inquirer = require('inquirer');
const { displaySelectValues, attachToProcess } = require("./cli-actions.js");
const { prGitFlow, showAllLocalRepos } = require("./executor.js");
const { fetchPulls } = require("./git-actions.js");
const util = require('util');
const Spawner = require("./spawner.js");

require('dotenv').config();

const { HOME, EBSCO_UI_PATH, EBSCO_EDGE_PATH } = process.env;

const showBottomBar = () => {
	var ui = new inquirer.ui.BottomBar();

	ui.log.write(`\
	------------------------\
	`);
	ui.log.write(`\
	it's thursday. Go forth and break something... - Cy.\
	`);
	ui.log.write(`\
	------------------------
	`);

	ui.updateBottomBar('new bottom bar content');
}

const uiFork = new Spawner("Ui done loading", "3030");
const edgeFork = new Spawner("Edge done loading", "8080");
const authFork = new Spawner("Goggles done loading", "4040");

const CODE_PATH = `${HOME}/Code`;
const uiDir = `${CODE_PATH}/${EBSCO_UI_PATH}`;
const edgeDir = `${CODE_PATH}/${EBSCO_EDGE_PATH}`;

const viewLocalRepos = async () => {
	let values = await showAllLocalRepos();
	return displaySelectValues(values.filter(Boolean));
}

const autoReview = async () => {
	const { project } = await viewLocalRepos();

	showBottomBar();
	
	const { pull } = await fetchPulls(project);

	await prGitFlow(pull.branch);
}

const pollForServerUp = spawn => {
	return new Promise(async (res) => {
		let isUp = false;

		while(!isUp) {
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

	showBottomBar();
}

generateEnvs();
