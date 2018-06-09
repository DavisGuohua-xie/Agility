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






## Credits

- [redux](https://github.com/reduxjs/redux) - Predictable state container for JavaScript apps
- [react-loading](https://github.com/fakiolinho/react-loading) - React component for loading animations
- [reactstrap](https://github.com/reactstrap/reactstrap) - Simple React Bootstrap 4 components
- [react-avatar](https://github.com/Sitebase/react-avatar) - Universal avatar makes it possible to fetch/generate an avatar based on the information you have about that user.
- [react-router-dom](https://github.com/ReactTraining/react-router/tree/master/packages/react-router-dom) - DOM bindings for React Router.
- [toastr](https://github.com/CodeSeven/toastr) - Simple javascript toast notifications
- [prop-types](https://github.com/facebook/prop-types) - Runtime type checking for React props and similar objects
- [react-redux](https://github.com/reduxjs/react-redux) - Official React bindings for Redux
- [parse](https://github.com/parse-community/Parse-SDK-JS) - Parse SDK for JavaScript
- [moment](https://github.com/moment/moment) - Parse, validate, manipulate, and display dates in javascript.
- [react-big-calendar](https://github.com/intljusticemission/react-big-calendar) - gcal/outlook like calendar component
- [react-chartjs-2](https://github.com/jerairrest/react-chartjs-2) - React wrapper for Chart.js
- [react-trello](https://github.com/rcdexta/react-trello) - Pluggable components to add a trello-like kanban board to your application
- [lodash](https://github.com/lodash/lodash) - A modern JavaScript utility library delivering modularity, performance, & extras.
- [chatkit-client-js](https://github.com/pusher/chatkit-client-js) - JavaScript SDK for Pusher Chatkit 
- [express](https://github.com/expressjs/express) - Fast, unopinionated, minimalist web framework for node.
- [body-parser](https://github.com/ReactTraining/react-router) - Node.js body parsing middleware
- [cors](https://github.com/expressjs/cors) - Node.js CORS middleware
- [history](https://github.com/ReactTraining/history) - Manage session history with JavaScript

















