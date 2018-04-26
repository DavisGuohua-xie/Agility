# README

## Prerequisites

You need to have `yarn` and `npm` installed on your computer. Download and install the following versions:

- [Nodejs](https://nodejs.org/en/ "Nodejs"): v8.11.1 LTS (v10 not compatible)

- [Yarn](https://yarnpkg.com/en/ "Yarn"): v1.6.0

## Installation

Follow the instructions below to setup the project on your local machine.

```sh
git clone https://github.com/DavisGuohua-xie/DirtyBit.git cse110project
cd cse110project
yarn install
```

Now execute `yarn start` and open `localhost:3000` in your browser to see the webpage.

***NOTE: DO NOT UPDATE ANY PACKAGES OR NODEJS AS THE PROJECT MAY/WILL HORRIBLY BREAK.***

## Basic Project Structure

```sh
├── config
├── public
├── scripts
└── src
    ├── actions
    ├── components
    ├── img
    ├── reducers
    ├── selectors
    ├── server
    ├── store
    └── styles
```

`config`: Build configuration files

`public`: Base HTML file exists here

`scripts`: npm build scripts

`src/actions`: Define actions for `redux`

`src/componenents`: All React components should be placed here

`src/img`: Any image files

`src/reducers`: Define `redux` reducer functions here

`src/selectors`: Define selector functions -- functions that process redux store data before returning data back to React

`src/server`: Where backend code will go.

`src/store`: Define `redux` store configuration

`src/styles`: All CSS goes here. Make sure local CSS has extension `*.module.css`