# Questionary
Questionary is a faculty project created for learning purposes. It's a platform for asking and answering questions.

## How to build & run locally

#### Prerequisites
1. Install Node.js (v6.9 is recommended, but 4.6 should be sufficient).
2. Install aurelia-cli with `npm install -g aurelia-cli`.
3. Install postgresSQL server to your machine, create database and a user of your choice.
4. Change connection string in `config/index.js` to match the username and db name you created in previous step.

#### Building
1. Download the repo to you machine and navigate with the comand line to it.
2. Execute `npm install` in the root directory of the repo.
3. cd to aurelia folder and also execute `npm install` here for installing all the client dependencies.
4. cd to root folder and execute `npm start`.
---
If you wish to only build client you can do that in aurelia folder using these commands:

* `au build` -builds client in debug mode with logging turned on.
* `au build --env prod` -builds cliend in production mode with logging turned off.
  * *It creates two bundle files in the `aurelia/scripts` folder*
* `au run` -runs the app in debug mode.
