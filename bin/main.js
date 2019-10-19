#!/usr/bin/env node
const Prompts = require("../lib/prompts/prompts");
const program = require("commander");
const InitEnv = require("../lib/init-env");
const { fetchPulls } = require("../lib/git-actions");
const { prGitFlow } = require("../lib/executor");

require("dotenv").config();

program.version("0.0.1");
// list envs
// TODO: delete envs
// TODO: update envs
program
  .command("list")
  .alias("ls")
  .description("List current environments")
  .action(() => {
    const env = require("../.latch.env.json");
    Prompts.static.list(env.projects);
  });

// generate new env
// directory, alias, project dir, start command, port
program
  .command("new")
  .alias("n")
  .description("Create a new environment")
  .action(() => {
    const init = new InitEnv();
    const env = require("../.latch.env.json");

    env.mainDirectory
      ? init.promptForProjectSettings(env.mainDirectory)
      : init.promptForMainProjectDirectory();
  });

// TODO:
// prs using alias
// open browser to pr
// latch review ui
const parseAlias = alias => {
  return new Promise(async res => {
    const { projects } = require("../.latch.env.json");
    const { pull } = await fetchPulls(projects[`${alias}`].projectName).catch(
      err => console.warn(err)
    );

    await prGitFlow(pull.branch, projects[`${alias}`].projectDirectory);
    res();
  });
};

program
  .option("review, <string>", "project alias", parseAlias)
  .alias("r")
  .description("View PR's for project");

// TODO:
// env start with aliases
// ex: latch env-up edge ui auth

// TODO:
// env kill with aliases
// ex: latch env-kill [pids?]

// allow commander to parse `process.argv`
program.parse(process.argv);
