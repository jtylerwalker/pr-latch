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

const displayProjectValues = (values) => selectProject(values).then(projects => projects);

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

module.exports = { displayProjectValues, attachToProcess };
