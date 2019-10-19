const axios = require("axios");
const chalk = require("chalk");
const inquirer = require("inquirer");
require("dotenv").config();

// TODO: move prompts to correct location
const normalizePull = pull => ({
  name: `\
	${chalk.bold.underline(pull.title)}
	${chalk.gray("| Owner")}: ${chalk.white.bold(pull.user.login)}
	${chalk.gray("| State")}: ${chalk.white(pull.state)}
	${pull.labels && pull.labels.map(label => chalk.cyan.bold(label.name))}
	`,
  value: {
    title: pull.title,
    state: pull.state,
    htmlUrl: pull.html_url,
    labels: pull.labels,
    user: pull.user.login,
    branch: pull.head.ref
  }
});

const pullPrompt = inquirer.createPromptModule();
const selectPull = pulls =>
  pullPrompt([
    {
      type: "list",
      name: "pull",
      pageSize: 40,
      message: `Please, select a PR to review... please... for the love of god... there are too many.\n`,
      choices: pulls.map(normalizePull)
    }
  ]);

const handleErr = err => {
  var ui = new inquirer.ui.BottomBar();

  ui.log.write(`\
	------------------------\
	`);
  ui.log.write(`\
	${chalk.red.bold(
    "There was an error when trying to pull please review the warning below:"
  )}\
	`);
  ui.log.write(`\
	${err}
	`);

  ui.updateBottomBar("new bottom bar content");
};

const fetchPulls = repo => {
  const { GITHUB_TOKEN, GITHUB_API, GITHUB_USERNAME } = process.env;
  const repoUrl = `${GITHUB_API}/repos/EBSCOIS/${repo}`;

  return axios
    .get(`${repoUrl}/pulls`, {
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        "User-Agent": GITHUB_USERNAME
      }
    })
    .then(res => selectPull(res.data))
    .then(pull => pull)
    .catch(err => handleErr(err));
};

module.exports = { fetchPulls };
