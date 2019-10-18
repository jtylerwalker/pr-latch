#!/usr/bin/env node
const Prompts = require("../lib/prompts/prompts");
const program = require("commander");
const InitEnv = require("../lib/init-env");

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
  .command("new") // sub-command name
  .alias("n") // alternative sub-command is `al`
  .description("Create a new environment") // command description
  // function to execute when command is uses
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

// TODO:
// env start with aliases
// ex: latch env-up edge ui auth

// TODO:
// env kill with aliases
// ex: latch env-kill [pids?]

// allow commander to parse `process.argv`
program.parse(process.argv);
