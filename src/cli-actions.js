const cliSelect = require('cli-select');
const chalk = require('chalk');
const inquirer = require('inquirer');

const projectPrompt = inquirer.createPromptModule();
const normalizeProject = project => ({
	name: `\
	${chalk.bold("| " + project)}
	`,
	value: project
})
const selectProject = projects => projectPrompt([
	{
		type: 'list',
		name: 'project',
		pageSize: 40,
		message: `Select a project to view its open PR's...\n`,
		choices: projects.map(normalizeProject)
	}
]);

const displaySelectValues = (values) => selectProject(values).then(projects => projects);

const renderPulls = (pull, selected) => {
	if (selected) {
		return chalk.green.underline(pull.title);
	}

	return `Title: ${pull.title}\nUser: ${pull.user}\nState: ${pull.state}\nLabels: ${pull.labels}`;
}

const displayGitRepos = async values => {
	let value = await displaySelectValues(values, renderPulls);

	if (value.id !== null) {
		console.log('selected' + value.id + ": " + JSON.stringify(value));
		console.log('Damn, dog. U gay.');
	} else {
		console.log('cancelled');
	}
}

const showGitRepos = () => {
	const { CODE_PATH } = process.env;
	return cliSelect({
		values: values,
		selected: '(O)',
		unselected: '( )',
		defaultValue: 0,
		cleanup: true,
		valueRenderer: (pull, selected) => {
			if (selected) {
				return chalk.green.underline(pull.title);
			}

			return `Title: ${pull.title}\nUser: ${pull.user}\nState: ${pull.state}\nLabels: ${pull.labels}`;
		}
	}).then((value) => {
		if (value.id !== null) {
			console.log('selected' + value.id + ": " + JSON.stringify(value));
			console.log('Damn, dog. U gay.');
		} else {
			console.log('cancelled');
		}
	});
}

const formattedPull = (pull, id) => {
	return `Title: ${pull.title}\nUser: ${pull.user}\nState: ${pull.state}\nLabels: ${pull.labels}`;
}
 
const displayPulls = values => {
	const displayValues = values.map((value, id) => formattedPull(value, id));

	return cliSelect({
		values: values,
		selected: '(O)',
		unselected: '( )',
		defaultValue: 0,
		cleanup: true,
		valueRenderer: (pull, selected) => {
			if (selected) {
				return chalk.green.underline(pull.title);
			}

			return `Title: ${pull.title}\nUser: ${pull.user}\nState: ${pull.state}\nLabels: ${pull.labels}`;
		}
	}).then((value) => {
		if (value.id !== null) {
			console.log('selected' + value.id + ": " + JSON.stringify(value));
			console.log('Damn, dog. U gay.');
		} else {
			console.log('cancelled');
		}
	});
}

const attachToProcess = () => {
	const attachPrompt = inquirer.createPromptModule();
	const processes = [345, 456, 789];
	const selectPull = pulls => pullPrompt([
		{
			type: 'list',
			name: 'pull',
			pageSize: 40,
			message: `You're ready to go! Choose a process you'd like to view`,
			choices: processes
		}
	]);
}

module.exports = { displaySelectValues, attachToProcess };
