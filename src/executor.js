const path = require('path');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const chalk = require("chalk");
const logSymbols = require('log-symbols');
const ora = require('ora');
require('dotenv').config();

////// should be in ENV ////////
const {EBSCO_UI_PATH, HOME} = process.env;
const CODE_PATH = `${HOME}/Code`;

const codeDir = `${CODE_PATH}/${EBSCO_UI_PATH}`;

const stopSpinnerAndShowCheck = (spinner, loadingText, isError) => {
	spinner.stop();
	console.log(logSymbols.success, `	${chalk.cyan.bold(loadingText)}`);	
}

const startSpinner = (loadingText) => ora(`	${chalk.white.bold(loadingText)}`).start();

const executor = (action, workingDir, loadingText, cb) => {
	return exec(action, { cwd: `${workingDir}` })
		.then(({ stdout }) => ({ loadingText, stdout }))
		.catch(stderr => console.warn(stderr));
}

const showAllLocalRepos = async () => {
	let { stdout } = await executor(`ls ${CODE_PATH}`, codeDir, "Which project would you like to check out?");

	return stdout.split("\n");
}

const switchToWorkingDir = async () => {
	const spinner = startSpinner('Changing working directory');
	let { loadingText } = await executor(`cd ${codeDir}`, codeDir, `Changing working directory`);

	stopSpinnerAndShowCheck(spinner, loadingText, false);
}

const fetchAll = async () => {
	const spinner = startSpinner("Fetching remote changes");
	let { loadingText } = await executor("git fetch --all", codeDir, `Checking current branch`);

	stopSpinnerAndShowCheck(spinner, loadingText, false);
}

const checkoutMaster = async () => {
	const spinner = startSpinner('Checking current branch');
	let { stdout, loadingText } = await executor("git branch | grep \\* | cut -d ' ' -f2", codeDir, `Checking current branch`);

	stopSpinnerAndShowCheck(spinner, loadingText, false);

	if (stdout && stdout !== "master") {
		const childSpinner = startSpinner("Checking out master");
		({ loadingText } = await executor("git checkout master", codeDir, `Checking out master`))

		stopSpinnerAndShowCheck(childSpinner, loadingText, false);
	}
}

const checkoutBranch = async (branch) => {
	const spinner = startSpinner(`Checking ${branch}`);
	({ loadingText } = await executor(`git checkout ${branch}`, codeDir, `Checking out ${branch}`));

	stopSpinnerAndShowCheck(spinner, loadingText, false);
}

const pullingBranchChanges = async (branch) => {
	const spinner = startSpinner(`Pulling changes for ${branch}`);
	({ loadingText } = await executor(`git pull`, codeDir, `Pulling changes for ${branch}`));

	stopSpinnerAndShowCheck(spinner, loadingText, false);
}

const prGitFlow = async branch => {
	await switchToWorkingDir();
	await fetchAll();
	//await checkoutMaster();
	//await pullingBranchChanges("master");
	await checkoutBranch(branch);
	await pullingBranchChanges(branch);
}

module.exports = { prGitFlow, showAllLocalRepos };
