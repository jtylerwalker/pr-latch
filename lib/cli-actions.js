const chalk = require("chalk");
const inquirer = require("inquirer");

const projectPrompt = inquirer.createPromptModule();
const normalizeProject = project => ({
  name: `\
	${chalk.bold("| " + project)}
	`,
  value: project
});

const selectProject = projects => projectPrompt();
// projects.map(normalizeProject)

const displayProjectValues = values =>
  selectProject(values).then(projects => projects);

module.exports = { displayProjectValues, attachToProcess };
