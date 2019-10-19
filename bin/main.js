#!/usr/bin/env node
const Prompts = require("../lib/prompts/prompts");
const program = require("commander");
const InitEnv = require("../lib/init-env");
const { fetchPulls } = require("../lib/git-actions");
const { prGitFlow } = require("../lib/executor");
const env = require("../.latch.env.json");

require("dotenv").config();

program.version("0.0.1");

const { ui, ...projects } = env.projects;
console.warn(projects);

/**
 * Commander: List env projects
 */
const listEnvs = () => Prompts.static.list(env.projects);
program
  .option("env, list", "list envs", listEnvs)
  .alias("ls")
  .description("List current environments");

// TODO: delete envs
// TODO: update envs

/**
 * Commander: Generate new env project
 */
const newEnv = () => {
  const init = new InitEnv();

  env.mainDirectory
    ? init.promptForProjectSettings(env.mainDirectory)
    : init.promptForMainProjectDirectory();
};
program
  .option("env, new", "list envs", newEnv)
  .description("Create a new environment");

/**
 * @param {String} alias
 * Commander: PR review flow for stipulated env
 */
const parseAlias = alias => {
  return new Promise(async res => {
    const { pull } = await fetchPulls(
      env.projects[`${alias}`].projectName
    ).catch(err => console.warn(err));

    await prGitFlow(pull.branch, env.projects[`${alias}`].projectDirectory);
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

program.parse(process.argv);
