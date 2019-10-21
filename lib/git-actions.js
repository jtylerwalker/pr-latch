const axios = require("axios");
const chalk = require("chalk");
const inquirer = require("inquirer");
const Prompts = require("./prompts/prompts");
require("dotenv").config();

const GitActions = (() => {
  // TODO: move prompts to correct location
  // TODO: chalk reusable styles
  const normalizePull = pull => ({
    name: `\
 ${chalk.bold.underline(pull.title)}
 ${chalk.gray("| Owner")}: ${chalk.white.bold(pull.user.login)}
 ${chalk.gray("| State")}: ${chalk.white(pull.state)}
 ${chalk.gray("|")} ${pull.labels &&
      pull.labels.map(label => chalk.red.bold(label.name))}
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
        message: `Select a PR to review... please, for the love of god. There are too many.\n`,
        choices: pulls.map(normalizePull)
      }
    ]);

  const handleErr = err => {
    var ui = new inquirer.ui.BottomBar();

    Prompts.static.separator();
    ui.log.write(
      chalk.red.bold(
        `There was an error when trying to pull please review the warning below:`
      )
    );
    Prompts.static.separator();
    ui.log.write(`\
	${err}
	`);
  };

  const fetchPulls = repo => {
    const { GITHUB_TOKEN, GITHUB_API, GITHUB_USERNAME } = process.env;
    const repoUrl = `${GITHUB_API}/${repo}`;

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

  return { fetchPulls };
})();

module.exports = GitActions;
