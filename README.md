# What is PR Latch?

For brevity, Latch is a tool to help streamline the process of reviewing pull requests. In addition, it automates the process of starting up environments so you spend less time at the command-line and more time contributing.

## Installation

```
# install globally
npm i -g prlatch
```

## Initialization

First, ensure there is a created [personal access token](https://help.github.com/en/github/authenticating-to-github/creating-a-personal-access-token-for-the-command-line) for usage with the Github API.

```
# prompts for github credentials and generates default .latchrc.json
latch init
```

## Commands

```
init                         creates .latchrc.json with default values
env-up [project-aliases...]  starts the server for each project alias stipulated
env-down                     stops all project servers
env-new                      prompt to create a new project and updates .latchrc.json
list                         lists all projects in .latchrc.json
review <project-alias>       shows all open PR's on the projects repo
```

### Creating a new environment

The first time `env-new` is ran, you will be prompted for the `Main Project Directory`. This is an absolute path to your code folder (<i>Note: projects will not be available for selection if they are not in this directory</i>)

There will be a prompt for an alias, which is a shorthand to start the project's PR review flow or server.

```
? What is a good alias for this project? example-alias
...

latch env-up example-alias
latch review example-alias
```

Start command uses the command to start the project. E.g: `npm start`.

`port` is... well, it's the port.

### Running the Project Envs

`env-up` takes a space-delimited set of projects and runs each project in the background.

```
latch env-up project-one project two
```

To kill these background processes:

```
latch env-down
```

### Review Flow

`latch review <project-alias>` offers a selection of the current open pr's in the repo. Selecting an option will `fetch`, `checkout`, and `pull` the latest code changes. It will then open a browser to the view PR.

## Where are the tests?!?

Meh. Piss off. ;)
