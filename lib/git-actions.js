const axios = require("axios");
const inquirer = require("inquirer");
const Prompts = require("./prompts/prompts");
require("dotenv").config();

const GitActions = (() => {
  // TODO: chalk reusable styles
  const normalizePull = pull => ({
    name: Prompts.static.formattedPull(pull),
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

  // TODO:  place in user-input
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

  const handleErr = err => Prompts.static.error(err);

  const fetchPulls = repo => {
    const {
      githubToken,
      githubApi,
      githubUserName
    } = require("../.latchrc.json");
    const repoUrl = `${githubApi}/${repo}`;

    return axios
      .get(`${repoUrl}/pulls`, {
        headers: {
          Authorization: `token ${githubToken}`,
          "User-Agent": githubUserName
        }
      })
      .then(res => selectPull(res.data))
      .then(pull => pull)
      .catch(err => handleErr(err));
  };

  return { fetchPulls };
})();

module.exports = GitActions;
