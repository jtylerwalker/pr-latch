#!/usr/bin/env node
const program = require("commander");
const {
  envsUp,
  envsDown,
  envNew,
  listEnvs,
  parseAlias
} = require("../lib/init");

program.version("0.0.1");

program.command("env-up [aliases...]").action(envsUp);
program.command("env-down").action(envsDown);
program.command("env-new").action(envNew);
program.command("list").action(listEnvs);
program.command("review <alias>").action(parseAlias);

program.parse(process.argv);
