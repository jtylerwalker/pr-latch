#!/usr/bin/env node
const Prompts = require("../lib/prompts/prompts");
const program = require("commander");

require("dotenv").config();

program.version("0.0.1");
// generate new env
// directory, alias, project dir, start command, port

// prs using alias
// open browser to pr
// latch review ui

// env start with aliases
// ex: latch env-up edge ui auth

// env kill with aliases
// ex: latch env-kill [pids?]

// list envs
// delete envs
// update envs
program
  .command("list") // sub-command name
  .alias("ls") // alternative sub-command is `al`
  .description("List current environments") // command description
  // function to execute when command is uses
  .action(() => {
    const env = require("../.latch.env.json");
    const projects = `${env.projects}`;

    Prompts.static.list(projects);
  });

program
  .command("new") // sub-command name
  .alias("n") // alternative sub-command is `al`
  .description("Create a new environment") // command description
  // function to execute when command is uses
  .action(() => {
    const env = require("../.latch.env.json");
    const projects = `${env.projects}`;

    Prompts.static.list(projects);
  });

// allow commander to parse `process.argv`
program.parse(process.argv);

// const start = () => {
//   const init = new InitEnv();
//   if (args[0] == "new" && args[1] == "env") init.promptforprojectsettings();
//   if (program.debug) console.log(program.opts());
//
//   const autoReview = alias => {
//     return new Promise(async res => {
//       console.warn(env);
//       const project = env.projects[alias].projectDirectory;
//       const { pull } = await fetchPulls(project).catch(err =>
//         console.warn(err)
//       );
//
//       await prGitFlow(pull.branch, uiDir);
//       res();
//     });
//   };
//
//   const initialize = async alias => {
//     console.clear();
//     await autoReview(alias);
//     console.clear();
//   };
//
//   if (args[0] == "review") {
//     initialize(args[1]);
//   }
//   if (program.debug) console.log(program.opts());
// };
//
