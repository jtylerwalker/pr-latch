#!/usr/bin/env node
const chalk = require("chalk");
const fs = require("fs");
const path = require("path");
const program = require("commander");
const Prompts = require("../lib/prompts/prompts");
const {
  initializeEnv,
  envsUp,
  envsDown,
  envNew,
  listEnvs,
  parseAlias
} = require("../lib/init");

// TODO: options
program.version("0.0.1");

program
  .command("init")
  .action(async () => {
    const envPath = path.join(__dirname, "../.latchrc.json");

    if (fs.existsSync(envPath)) {
      Prompts.static.lineBreak();
      console.log(`${chalk.cyan.bold("Env already initialized.")}`);
      console.log(`${chalk.white.bold("You're ready to roll, Sugar Bear.\n")}`);
      process.exit(1);
    }

    Prompts.static.title();
    console.log(
      `${chalk.white.bold(Prompts.static.quotes[1])} - ${Prompts.static.quotee}`
    );
    initializeEnv().then(() => process.exit(1));
  })
  .description("creates .latchrc.json with default values");
program
  .command("env-up [project-aliases...]")
  .action(aliases => {
    console.clear();
    Prompts.static.segue();
    envsUp(aliases);
  })
  .description("starts the server for each project alias stipulated");
program
  .command("env-down")
  .action(() => {
    console.clear();
    Prompts.static.segue();
    envsDown();
  })
  .description("stops all project servers");
program
  .command("env-new")
  .action(() => {
    console.clear();
    Prompts.static.title();
    envNew();
  })
  .description("prompt to create a new project and updates .latchrc.json");
program
  .command("list")
  .action(() => {
    Prompts.static.segue();
    listEnvs();
  })
  .description("lists all projects in .latchrc.json");
program
  .command("review <project-alias>")
  .action(alias => {
    console.clear();
    Prompts.static.title();
    Prompts.static.lineBreak();
    parseAlias(alias);
  })
  .description("shows all open PR's on the projects repo");

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.help(txt => txt);
}
