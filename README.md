# What is PR Latch?
PR latch is a tool to help streamline the process of reviewing pull requests via Github. In addition, it automates the process of starting up necessary environments so you spend less time at the command-line and more time contributing.

## Installation
```sh
# install globally
npm i -g pr-latch
```


## Initialization
Ensure there is a [personal access token](https://help.github.com/en/github/authenticating-to-github/creating-a-personal-access-token-for-the-command-line) for usage with the Github API. 

```sh
# prompts for github credentials
latch init
```

## Commands
```sh
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

```sh
? What is a good alias for this project? example-alias
...

latch env-up example-alias
latch review example-alias
```

The start command is the command you use to start the project-- `npm start` for example.

`port` is the port in which the server runs on, not where you park a ship. 

### Running the Project Envs
`env-up` takes a space delimited set of projects and will spawn background processes to run them. 

```sh
latch env-up project-one project two
```

To kill these background processes:
```sh
latch env-down
```

### Review Flow

`latch review <project-alias>`  Starts the review process, which offers a selection of the latest PR in the repo. Selecting a PR will automatically `fetch`, `checkout`, and `pull` the latest code changes. It will then open a browser to the open PR page.

## Where are the tests?!?
Meh. Piss off. ;)
