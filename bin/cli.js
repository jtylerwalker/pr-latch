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

// TODO: empty args list
// TODO: options
// TODO: Generate .env file for gitub token and username

program.version("0.0.1");

program.command("init").action(async () => {
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
});
program.command("env-up [aliases...]").action(aliases => {
  console.clear();
  Prompts.static.segue();
  envsUp(aliases);
});
program.command("env-down").action(() => {
  console.clear();
  Prompts.static.segue();
  envsDown();
});
program.command("env-new").action(() => {
  console.clear();
  Prompts.static.title();
  envNew();
});
program.command("list").action(() => {
  Prompts.static.segue();
  listEnvs();
});
program.command("review <alias>").action(alias => {
  console.clear();
  Prompts.static.title();
  Prompts.static.lineBreak();
  parseAlias(alias);
});

program.parse(process.argv);
