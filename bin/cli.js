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
  startGitFlowFromAlias
} = require("../lib/init");

const envPath = path.join(__dirname, "../.latchrc.json");

program.version("0.0.1");

program
  .command("init")
  .action(async () => {
    if (fs.existsSync(envPath)) {
      Prompts.static.lineBreak();
      console.log(`| ${chalk.cyan.bold("Env already initialized.")}`);
      console.log(
        `| ${chalk.white.bold("You're ready to roll, Sugar Bear.\n")}`
      );
      process.exit(1);
    }

    Prompts.static.title();
    initializeEnv().then(() => {
      console.log(`\n| ${chalk.white.bold(Prompts.static.quotes[1])}`);
      process.exit(1);
    });
  })
  .description("creates .latchrc.json with default values");

if (!fs.existsSync(envPath) && !process.argv.includes("init")) {
  Prompts.static.lineBreak();
  console.log(
    `| ${chalk.redBright.bold("Looks you need to create a latchrc file.")}`
  );
  console.log(`| ${chalk.white.bold("Run 'latch init' to get started")} \n`);
  process.exit(1);
} else {
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
      listEnvs();
    })
    .description("lists all projects in .latchrc.json");

  program
    .command("review <project-alias>")
    .action(alias => {
      console.clear();
      Prompts.static.title();
      Prompts.static.lineBreak();
      startGitFlowFromAlias(alias);
    })
    .description("shows all open PR's on the projects repo");
}

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.help(txt => txt);
}
