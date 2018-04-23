# README
## Prerequisites
You need to have `yarn` and `npm` installed on your computer. Please download and install the latest versions:
- [Nodejs](https://nodejs.org/en/ "Nodejs"): v9.11.1
- [Yarn](https://yarnpkg.com/en/ "Yarn"): v1.6.0

## Installation
Please follow the instructions below to setup the project on your local machine.
```sh
git clone https://github.com/DavisGuohua-xie/DirtyBit.git cseproject110
cd cseproject110
yarn install
```

Now execute `yarn start` and open `localhost:3000` in your browser to see the webpage.

**NOTE: DO NOT UPDATE ANY PACKAGES AS THE PROJECT MAY HORRIBLY BREAK.**

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
    ├── store
    └── styles
```

`config`: Build configuration files

`public`: Base HTML file exists

`src/actions`: Define actions for `redux`

`src/componenents`: All React components should be placed here

`src/img`: Any image files

`src/reducers`: Define reducer functions here

`src/selectors`: Define selector functions -- functions that process redux store 
data before returning data back to React

`src/store`: Define store configuration

`src/styles`: All CSS goes here