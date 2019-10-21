#!/usr/bin/env node
const program = require("commander");
const Prompts = require("../lib/prompts/prompts");
const {
  envsUp,
  envsDown,
  envNew,
  listEnvs,
  parseAlias
} = require("../lib/init");

program.version("0.0.1");

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
