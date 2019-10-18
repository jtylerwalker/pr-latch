#!/usr/bin/env node

const inquirer = require("inquirer");
const { prGitFlow } = require("./executor.js");
const { fetchPulls } = require("./git-actions.js");
const Spawner = require("./spawner.js");
const InitEnv = require("./init-env.js");
const env = require("../pr-latch.env.json");
const program = require("commander");

require("dotenv").config();

program.version("0.0.1");

program.parse(process.argv);
const [, , ...args] = process.argv;

const init = new InitEnv();
if (args[0] == "new" && args[1] == "env") init.promptforprojectsettings();
if (program.debug) console.log(program.opts());

const autoReview = alias => {
  return new Promise(async res => {
    console.warn(env);
    const project = env.projects[alias].projectDirectory;
    const { pull } = await fetchPulls(project).catch(err => console.warn(err));

    await prGitFlow(pull.branch, uiDir);
    res();
  });
};

const initialize = async alias => {
  console.clear();
  await autoReview(alias);
  console.clear();
};

if (args[0] == "review") {
  initialize(args[1]);
}
if (program.debug) console.log(program.opts());
